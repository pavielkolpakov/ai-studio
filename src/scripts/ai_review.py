"""AI PR reviewer using Claude Sonnet 4.6.

Triggered by GitHub Actions on `/review` or `/review-changed` PR comments.
Posts inline review comments for high-confidence bugs only.
"""
from __future__ import annotations

import json
import os
import re
import sys
from pathlib import Path

from anthropic import Anthropic
from github import Github
from github.PullRequest import PullRequest

MODEL = "claude-sonnet-4-6"
MAX_INPUT_TOKENS = 100_000
MAX_FINDINGS = 8
CONFIDENCE_THRESHOLD = 0.7
REPO_ROOT = Path(__file__).resolve().parents[2]


SYSTEM_RULES = """You are a senior code reviewer for the Neuronetis project.

<rules>
- Only report bugs you are >70% confident are real.
- Severity "bug": logic error, null deref, race condition, security issue, missing await, broken migration, off-by-one.
- Severity "concern": likely-but-not-certain bug, suspicious pattern, missing error handling at a boundary.
- Do NOT report style, naming, or "consider extracting" suggestions.
- Match this codebase's ethos: terse, no over-engineering, no defensive code at non-boundaries.
- Max 8 findings total. Pick the most important. Prefer false negatives over false positives.
- For each finding, the `line` must be a line number on the RIGHT side of the diff (post-change line in the new file).
- Call the `report_findings` tool exactly once with your findings.
</rules>"""


REPORT_TOOL = {
    "name": "report_findings",
    "description": "Report bug/concern findings on the PR. Call exactly once.",
    "input_schema": {
        "type": "object",
        "properties": {
            "summary": {
                "type": "string",
                "description": "One-sentence overall summary of the review.",
            },
            "findings": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "path": {"type": "string"},
                        "line": {"type": "integer"},
                        "severity": {"type": "string", "enum": ["bug", "concern"]},
                        "confidence": {"type": "number"},
                        "body": {"type": "string"},
                    },
                    "required": ["path", "line", "severity", "confidence", "body"],
                },
            },
        },
        "required": ["summary", "findings"],
    },
}


def collect_claude_md(file_paths: list[str]) -> str:
    """Walk each file's parent dirs (within repo) collecting CLAUDE.md, root-first, deduped."""
    seen: dict[Path, None] = {}
    for fp in file_paths:
        p = (REPO_ROOT / fp).resolve()
        try:
            rel_parts = p.relative_to(REPO_ROOT).parts[:-1]
        except ValueError:
            continue
        cur = REPO_ROOT
        for part in (None, *rel_parts):
            if part is not None:
                cur = cur / part
            md = cur / "CLAUDE.md"
            if md.exists() and md not in seen:
                seen[md] = None
    blocks = []
    for md in seen:
        rel = md.relative_to(REPO_ROOT)
        blocks.append(f"=== {rel} ===\n{md.read_text()}")
    return "\n\n".join(blocks)


def find_last_bot_review_sha(pr: PullRequest) -> str | None:
    """Latest review commit_id submitted by the github-actions bot."""
    bot_reviews = [
        r for r in pr.get_reviews()
        if r.user and (r.user.login == "github-actions[bot]" or r.user.type == "Bot")
    ]
    if not bot_reviews:
        return None
    bot_reviews.sort(key=lambda r: r.submitted_at or 0, reverse=True)
    return bot_reviews[0].commit_id


def parse_diff_anchors(patch: str) -> set[int]:
    """Return set of right-side line numbers present in a unified diff hunk."""
    lines: set[int] = set()
    if not patch:
        return lines
    new_line = 0
    for raw in patch.splitlines():
        m = re.match(r"^@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@", raw)
        if m:
            new_line = int(m.group(1))
            continue
        if raw.startswith("+") and not raw.startswith("+++"):
            lines.add(new_line)
            new_line += 1
        elif raw.startswith("-") and not raw.startswith("---"):
            continue
        else:
            new_line += 1
    return lines


def post_simple_comment(pr: PullRequest, body: str) -> None:
    pr.create_issue_comment(body)


def main() -> int:
    pr_number = int(os.environ["PR_NUMBER"])
    repo_full = os.environ["GITHUB_REPOSITORY"]
    mode = os.environ.get("REVIEW_MODE", "full")
    gh_token = os.environ["GITHUB_TOKEN"]
    anthropic_key = os.environ["ANTHROPIC_API_KEY"]

    gh = Github(gh_token)
    repo = gh.get_repo(repo_full)
    pr = repo.get_pull(pr_number)
    head_sha = pr.head.sha

    all_files = list(pr.get_files())
    base_sha_for_changed: str | None = None

    if mode == "changed":
        base_sha_for_changed = find_last_bot_review_sha(pr)
        if base_sha_for_changed is None:
            print("No prior bot review found; falling back to full review.", file=sys.stderr)
            files = all_files
        else:
            cmp = repo.compare(base_sha_for_changed, head_sha)
            changed_paths = {f.filename for f in cmp.files}
            files = [f for f in all_files if f.filename in changed_paths]
            if not files:
                post_simple_comment(pr, "🤖 Nothing new to review since last AI review.")
                return 0
    else:
        files = all_files

    if not files:
        post_simple_comment(pr, "🤖 No files to review.")
        return 0

    diff_text_parts = []
    file_content_parts = []
    diff_anchors: dict[str, set[int]] = {}

    for f in files:
        if f.status == "removed" or not f.patch:
            continue
        diff_anchors[f.filename] = parse_diff_anchors(f.patch)
        diff_text_parts.append(f"--- a/{f.filename}\n+++ b/{f.filename}\n{f.patch}")
        try:
            content = repo.get_contents(f.filename, ref=head_sha).decoded_content.decode(
                "utf-8", errors="replace"
            )
            if len(content) > 60_000:
                content = content[:60_000] + "\n... [truncated]"
            file_content_parts.append(
                f'<file path="{f.filename}">\n{content}\n</file>'
            )
        except Exception as e:
            print(f"Could not read {f.filename}: {e}", file=sys.stderr)

    if not diff_text_parts:
        post_simple_comment(pr, "🤖 No reviewable text changes.")
        return 0

    diff_text = "\n\n".join(diff_text_parts)
    files_text = "\n".join(file_content_parts)
    project_context = collect_claude_md([f.filename for f in files])

    system_blocks = [
        {
            "type": "text",
            "text": f"<project_context>\n{project_context}\n</project_context>\n\n{SYSTEM_RULES}",
            "cache_control": {"type": "ephemeral"},
        }
    ]

    user_text = (
        f"<pr_title>{pr.title}</pr_title>\n"
        f"<pr_description>{pr.body or ''}</pr_description>\n"
        f"<changed_files>\n{files_text}\n</changed_files>\n"
        f"<diff>\n{diff_text}\n</diff>"
    )

    client = Anthropic(api_key=anthropic_key)

    rough_token_estimate = (len(user_text) + len(project_context) + len(SYSTEM_RULES)) // 4
    if rough_token_estimate > MAX_INPUT_TOKENS:
        post_simple_comment(
            pr,
            f"🤖 PR too large for AI review (~{rough_token_estimate} tokens, cap {MAX_INPUT_TOKENS}).",
        )
        return 0

    resp = client.messages.create(
        model=MODEL,
        max_tokens=4096,
        system=system_blocks,
        tools=[REPORT_TOOL],
        tool_choice={"type": "tool", "name": "report_findings"},
        messages=[{"role": "user", "content": user_text}],
    )

    usage = getattr(resp, "usage", None)
    if usage:
        print(
            f"Tokens: input={usage.input_tokens} output={usage.output_tokens} "
            f"cache_read={getattr(usage, 'cache_read_input_tokens', 0)} "
            f"cache_create={getattr(usage, 'cache_creation_input_tokens', 0)}",
            file=sys.stderr,
        )

    tool_use = next((b for b in resp.content if getattr(b, "type", None) == "tool_use"), None)
    if tool_use is None:
        post_simple_comment(pr, "🤖 AI review failed: no findings tool call returned.")
        return 1

    payload = tool_use.input
    summary = payload.get("summary", "AI review complete.")
    raw_findings = payload.get("findings", [])

    valid: list[dict] = []
    dropped = 0
    for f in raw_findings:
        if f.get("severity") not in ("bug", "concern"):
            dropped += 1
            continue
        if float(f.get("confidence", 0)) < CONFIDENCE_THRESHOLD:
            dropped += 1
            continue
        path = f.get("path", "")
        line = int(f.get("line", 0))
        if line not in diff_anchors.get(path, set()):
            dropped += 1
            print(f"Dropped finding: line {line} not in diff for {path}", file=sys.stderr)
            continue
        valid.append(f)

    valid.sort(key=lambda x: (0 if x["severity"] == "bug" else 1, -float(x["confidence"])))
    valid = valid[:MAX_FINDINGS]

    print(f"Findings: {len(valid)} kept, {dropped} dropped of {len(raw_findings)}", file=sys.stderr)

    if not valid:
        body = f"🤖 **AI Review** — {summary}\n\n_No high-confidence issues found._"
        pr.create_issue_comment(body)
        return 0

    inline_comments = [
        {
            "path": f["path"],
            "line": f["line"],
            "side": "RIGHT",
            "body": f"**{f['severity']}** (confidence {f['confidence']:.0%}): {f['body']}",
        }
        for f in valid
    ]

    review_body = f"🤖 **AI Review** — {summary}\n\n_{len(valid)} finding(s)._"
    pr.create_review(
        commit=repo.get_commit(head_sha),
        body=review_body,
        event="COMMENT",
        comments=inline_comments,
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())

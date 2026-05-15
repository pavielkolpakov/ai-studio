"""Pool of follow-up suggestions the picker LLM can choose from.

`FOLLOWUP_POOL` maps id -> {text, cacheKey?, action?}. The picker sees only
`PICKABLE_IDS` (excludes `book_call`, which is reserved for the frontend
<2-fallback so it can't appear twice).
"""

FOLLOWUP_POOL: dict[str, dict] = {
    # Cached entry-points
    "services_pricing": {"text": "Services & pricing", "cacheKey": "services_and_pricing"},
    "process_overview": {"text": "What's the process like?", "cacheKey": "process"},
    "show_examples": {"text": "Show example projects", "cacheKey": "show_example_projects"},
    "how_to_start": {"text": "How do we get started?", "cacheKey": "how_to_get_started"},
    "about_neuronetis": {"text": "About Neuronetis", "cacheKey": "about"},

    # Action entries
    "ideas_prompt": {"text": "Ideas for my project", "action": "ideas-prompt"},
    "book_call": {"text": "Book a call", "action": "calendly"},

    # Freeform topic exploration (no cacheKey -> sent as a regular user message)
    "what_makes_good_ai_project": {"text": "What makes a good AI project?"},
    "what_makes_you_different": {"text": "What makes you different?"},
    "tech_stack": {"text": "What's your tech stack?"},
    "rag_vs_finetuning": {"text": "RAG vs fine-tuning?"},
    "discovery_details": {"text": "What happens in discovery?"},
    "retainer_terms": {"text": "Do you offer retainers?"},
    "timeline_typical": {"text": "How long does a typical project take?"},
    "audit_deliverables": {"text": "What's in an AI audit?"},
    "integration_examples": {"text": "Show me an integration example"},
    "data_requirements": {"text": "What data do you need from us?"},
    "team_size": {"text": "How big is the team?"},
    "ip_ownership": {"text": "Who owns the code?"},
    "measure_results": {"text": "How do you measure results?"},
    "post_launch_support": {"text": "What support is included after launch?"},
    "industries_served": {"text": "Which industries do you work with?"},
}

PICKABLE_IDS: frozenset[str] = frozenset(k for k in FOLLOWUP_POOL if k != "book_call")


def resolve_picks(ids: list[str]) -> list[dict]:
    """Resolve picked ids to full suggestion objects. Drops unknown ids."""
    out: list[dict] = []
    for pid in ids:
        entry = FOLLOWUP_POOL.get(pid)
        if entry is None:
            continue
        out.append({"id": pid, **entry})
    return out


def pickable_pool_text() -> str:
    """Format the pickable pool as `id: text` lines for the picker prompt."""
    return "\n".join(
        f"{pid}: {FOLLOWUP_POOL[pid]['text']}" for pid in sorted(PICKABLE_IDS)
    )

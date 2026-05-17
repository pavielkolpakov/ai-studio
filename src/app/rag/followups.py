"""Picks 3 follow-up suggestions for the user from `FOLLOWUP_POOL`.

Runs after the main agent finishes, only for freeform LLM responses (not
cached, not when ideas were emitted). Uses a cheap structured-output LLM call
with strict JSON schema. On any failure (timeout, parse error, unknown ids),
returns an empty list - frontend renders nothing.
"""

import asyncio
import logging

from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field

from app.core.config import settings
from app.data.followup_pool import PICKABLE_IDS, pickable_pool_text, resolve_picks

logger = logging.getLogger(__name__)

PICKER_MODEL = "gpt-4o-mini"
PICKER_TIMEOUT_SECONDS = 5.0
ASSISTANT_TRUNCATE_CHARS = 1500


class _Picks(BaseModel):
    ids: list[str] = Field(min_length=3, max_length=3)


SYSTEM_PROMPT = """You select follow-up question suggestions for a user chatting with an AI consultancy.
Given the recent exchange and a pool of candidate questions, pick the 3 IDs that are the most natural next 
questions for this user.

Rules:
- Prefer questions that explore adjacent topics, not what the user just asked.
- Prefer specific over generic.
- All 3 IDs must come from the provided pool. Do not invent IDs."""


def _user_prompt(user_msg: str, assistant_msg: str) -> str:
    truncated = assistant_msg[:ASSISTANT_TRUNCATE_CHARS]
    return (
        f"Last user message: {user_msg}\n\n"
        f"Last assistant message: {truncated}\n\n"
        f"Pool:\n{pickable_pool_text()}"
    )


async def pick_followups(user_msg: str, assistant_msg: str) -> list[dict]:
    """Return up to 3 resolved suggestion objects, or `[]` on any failure."""
    if not user_msg or not assistant_msg:
        return []
    try:
        llm = ChatOpenAI(
            model=PICKER_MODEL,
            api_key=settings.OPENAI_API_KEY,
            streaming=False,
            timeout=PICKER_TIMEOUT_SECONDS,
        )
        structured = llm.with_structured_output(_Picks, method="json_schema", strict=True)
        result = await asyncio.wait_for(
            structured.ainvoke(
                [
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": _user_prompt(user_msg, assistant_msg)},
                ]
            ),
            timeout=PICKER_TIMEOUT_SECONDS,
        )
    except Exception as exc:
        logger.warning("followup picker failed: %s", exc)
        return []

    if any(pid not in PICKABLE_IDS for pid in result.ids):
        logger.warning("followup picker returned invalid ids: %s", result.ids)
        return []

    return resolve_picks(result.ids)

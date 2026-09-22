from functools import cache

from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field
from typesafe_sdk import Noul, TypeSafeClient

from app.core.config import settings
from app.rag.prompts import IDEAS_GENERATION_PROMPT
from app.vault.loader import Note, project_notes

SELECTED_COUNT = 3


class Idea(BaseModel):
    title: str = Field(description="Short, punchy name of the AI project idea.")
    description: str = Field(description="1-2 sentence scope of the idea.")
    deliverables: list[str] = Field(description="3-5 concrete deliverable bullets.")
    tech: list[str] = Field(description="Key technologies / frameworks involved.")
    price_range: str = Field(description="Rough price range, e.g. '$8k-$15k'.")
    time_estimate: str = Field(description="Rough time estimate, e.g. '3-5 weeks'.")


class IdeasPayload(BaseModel):
    ideas: list[Idea] = Field(
        description="2 or 3 tailored AI project ideas.",
        min_length=2,
        max_length=3,
    )


@cache
def _client() -> TypeSafeClient:
    """One pooled client for the process; built on first use, not at import."""
    return TypeSafeClient(api_key=settings.TYPESAFE_API_KEY, model=settings.TYPESAFE_MODEL)


def select_projects(description: str) -> list[Note]:
    """The best-fitting project notes for the description, best first.

    One Jev request scores every catalogue entry in parallel — one noul per
    project, asking whether that entry's `read_when` describes this user. The
    ranking is ours, so there is no name to mis-copy and nothing to fall back to.
    """
    notes = project_notes()
    response = _client().system_one(
        state=description,
        questions={note.name: Noul(instructions=note.read_when) for note in notes},
    )
    ranked = sorted(notes, key=lambda note: response.nouls[note.name].noul, reverse=True)
    return ranked[:SELECTED_COUNT]


def generate_ideas_payload(description: str) -> IdeasPayload:
    """Select the most relevant project notes, then ask a structured-output LLM to
    lightly adapt each to the user's context (2 or 3 ideas)."""
    selected = select_projects(description)
    context = "\n\n".join(f"{note.title}\n\n{note.body}" for note in selected)

    llm = ChatOpenAI(
        model=settings.OPENAI_CHAT_MODEL,
        api_key=settings.OPENAI_API_KEY,
        streaming=False,
    )
    structured_llm = llm.with_structured_output(IdeasPayload).with_config(tags=["ideas"])
    prompt = IDEAS_GENERATION_PROMPT.format(description=description, context=context)
    return structured_llm.invoke(prompt)

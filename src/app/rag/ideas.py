from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field

from app.core.config import settings
from app.rag.prompts import IDEAS_GENERATION_PROMPT, IDEAS_SELECTION_PROMPT
from app.vault.loader import Note, load_index, project_notes

SELECT_MODEL = "gpt-4o-mini"


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


class ProjectSelection(BaseModel):
    names: list[str] = Field(
        description="2 or 3 project names copied verbatim from the catalog.",
        min_length=2,
        max_length=3,
    )


def select_projects(description: str) -> list[Note]:
    """Ask a cheap LLM to pick the 2-3 best-fitting project notes for the description."""
    notes = project_notes()
    by_name = {note.name: note for note in notes}

    llm = ChatOpenAI(model=SELECT_MODEL, api_key=settings.OPENAI_API_KEY, streaming=False)
    structured_llm = llm.with_structured_output(ProjectSelection).with_config(tags=["ideas"])
    prompt = IDEAS_SELECTION_PROMPT.format(description=description, index=load_index())
    selection = structured_llm.invoke(prompt)

    # IdeasPayload requires 2+ ideas, so a partial match is as unusable as no match.
    selected = [by_name[name] for name in selection.names if name in by_name]
    return selected if len(selected) >= 2 else notes[:3]


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

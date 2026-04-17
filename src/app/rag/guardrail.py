from typing import Any

from langchain.agents.middleware import AgentMiddleware
from langchain_core.messages import AIMessage, HumanMessage
from langchain_core.output_parsers import StrOutputParser
from langchain_openai import ChatOpenAI
from langgraph.graph import END
from langgraph.types import Command

from app.core.config import settings
from app.rag.prompts import GUARDRAIL_PROMPT

REJECTION_MESSAGE = (
    "I'm sorry, but as Neuronetis AI assistant, I can only answer questions "
    "about Neuronetis — our services, process, projects, and how AI can help "
    "your business. Feel free to ask about any of these!"
)


def classify_query(question: str) -> bool:
    """Return True if the question is on-topic for Neuronetis, False otherwise."""
    llm = ChatOpenAI(
        model="gpt-4o-mini",
        api_key=settings.OPENAI_API_KEY,
        temperature=0,
    )
    chain = GUARDRAIL_PROMPT | llm | StrOutputParser()
    result = chain.invoke({"input": question})
    return result.strip().upper() == "YES"


class GuardrailMiddleware(AgentMiddleware):
    """Rejects off-topic questions before the agent model is called.

    On rejection, short-circuits the graph with an AIMessage carrying the
    canned REJECTION_MESSAGE so the stream still emits it as normal AI chunks.
    Only runs on the first turn (when the last message is Human and no prior
    AI turn exists) to avoid re-classifying during tool loops.
    """

    def before_model(self, state: dict, runtime: Any) -> dict | Command | None:
        messages = state.get("messages", [])
        # Only classify the latest human turn, not intermediate tool loops
        if not messages or not isinstance(messages[-1], HumanMessage):
            return None
        # Already passed guardrail this turn if there's an AI message after the
        # last Human. (In practice create_agent only calls before_model again
        # after tool calls, where a ToolMessage is last — HumanMessage check
        # above handles that. Belt-and-suspenders.)
        question = messages[-1].content
        if classify_query(question):
            return None
        return Command(
            goto=END,
            update={"messages": [AIMessage(content=REJECTION_MESSAGE)]},
        )

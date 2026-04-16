from langchain_core.output_parsers import StrOutputParser
from langchain_openai import ChatOpenAI

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

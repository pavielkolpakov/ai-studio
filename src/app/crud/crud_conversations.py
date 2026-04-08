import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.conversation import Conversation


async def get_or_create_conversation(
    db: AsyncSession,
    session_id: str,
) -> Conversation:
    stmt = select(Conversation).where(Conversation.session_id == session_id)
    result = await db.execute(stmt)
    conversation = result.scalar_one_or_none()

    if conversation is None:
        conversation = Conversation(
            id=uuid.uuid4(),
            session_id=session_id,
            messages=[],
        )
        db.add(conversation)
        await db.flush()

    return conversation


async def append_message(
    db: AsyncSession,
    conversation: Conversation,
    role: str,
    content: str,
) -> None:
    conversation.messages = [
        *conversation.messages,
        {"role": role, "content": content},
    ]
    await db.flush()


def get_recent_messages(
    messages: list[dict],
    limit: int = 10,
) -> list[dict]:
    """Return the last `limit` messages from a conversation's message list."""
    return messages[-limit:]

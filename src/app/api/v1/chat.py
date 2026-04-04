import uuid
from typing import Annotated

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import async_get_db
from app.crud.crud_conversations import append_message, get_or_create_conversation
from app.schemas.chat import ChatRequest, SessionResponse

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("/session", response_model=SessionResponse)
async def create_session() -> SessionResponse:
    return SessionResponse(session_id=str(uuid.uuid4()))


@router.post("")
async def chat(
    body: ChatRequest,
    db: Annotated[AsyncSession, Depends(async_get_db)],
) -> StreamingResponse:
    conversation = await get_or_create_conversation(db, body.session_id)
    await append_message(db, conversation, "user", body.message)
    await db.commit()

    async def placeholder_stream():
        yield "data: Chat endpoint ready. RAG chain not yet implemented.\n\n"

    return StreamingResponse(
        placeholder_stream(),
        media_type="text/event-stream",
    )

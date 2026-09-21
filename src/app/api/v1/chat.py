import json
import uuid
from typing import Annotated

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import async_get_db
from app.core.rate_limiter import check_chat_rate_limit, rate_limit_chat_ip
from app.crud.crud_conversations import (
    append_message,
    get_or_create_conversation,
    get_recent_messages,
)
from app.rag.chain import build_agent, messages_from_dicts, stream_response
from app.schemas.chat import ChatRequest, SessionResponse

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("/session", response_model=SessionResponse)
async def create_session() -> SessionResponse:
    return SessionResponse(session_id=str(uuid.uuid4()))


@router.post("", dependencies=[Depends(rate_limit_chat_ip)])
async def chat(
    body: ChatRequest,
    db: Annotated[AsyncSession, Depends(async_get_db)],
) -> StreamingResponse:
    check_chat_rate_limit(body.session_id)
    conversation = await get_or_create_conversation(db, body.session_id)
    recent = get_recent_messages(conversation.messages)
    await append_message(db, conversation, "user", body.message)
    await db.commit()

    chat_history = messages_from_dicts(recent)
    agent = build_agent()

    async def sse_stream():
        full_answer = ""
        async for event in stream_response(agent, body.message, chat_history):
            parsed = json.loads(event.removeprefix("data: ").strip())
            if parsed.get("type") == "token":
                full_answer += parsed["token"]
            yield event

        # Save assistant response after streaming
        await append_message(db, conversation, "assistant", full_answer)
        await db.commit()

    return StreamingResponse(
        sse_stream(),
        media_type="text/event-stream",
    )

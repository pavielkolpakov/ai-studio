from typing import Annotated

from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import async_get_db
from app.core.rate_limiter import rate_limit_contact
from app.crud.crud_contact import create_contact_submission
from app.crud.crud_conversations import get_conversation
from app.schemas.contact import ContactRequest, ContactResponse
from app.services.email import send_contact_email

router = APIRouter(prefix="/contact", tags=["contact"])


@router.post(
    "",
    response_model=ContactResponse,
    dependencies=[Depends(rate_limit_contact)],
)
async def contact(
    body: ContactRequest,
    request: Request,
    db: Annotated[AsyncSession, Depends(async_get_db)],
) -> ContactResponse:
    transcript = None
    if body.session_id:
        conversation = await get_conversation(db, body.session_id)
        if conversation and conversation.messages:
            transcript = conversation.messages

    ip = request.client.host if request.client else None

    await create_contact_submission(
        db,
        name=body.name,
        email=body.email,
        message=body.message,
        session_id=body.session_id,
        ip_address=ip,
        transcript=transcript,
    )
    await db.commit()

    await send_contact_email(
        name=body.name,
        email=body.email,
        message=body.message,
        transcript=transcript,
    )

    return ContactResponse()

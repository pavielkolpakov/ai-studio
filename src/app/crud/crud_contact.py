import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.contact import ContactSubmission


async def create_contact_submission(
    db: AsyncSession,
    *,
    name: str,
    email: str,
    message: str,
    session_id: str | None = None,
    ip_address: str | None = None,
    transcript: list[dict] | None = None,
) -> ContactSubmission:
    submission = ContactSubmission(
        id=uuid.uuid4(),
        name=name,
        email=email,
        message=message,
        session_id=session_id,
        ip_address=ip_address,
        transcript=transcript,
    )
    db.add(submission)
    await db.flush()
    return submission

from sqlalchemy import Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db.database import Base
from app.core.db.models import TimestampMixin, UUIDMixin


class ContactSubmission(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "contact_submissions"

    name: Mapped[str] = mapped_column(Text)
    email: Mapped[str] = mapped_column(Text)
    message: Mapped[str] = mapped_column(Text)
    session_id: Mapped[str | None] = mapped_column(Text, nullable=True)
    ip_address: Mapped[str | None] = mapped_column(Text, nullable=True)
    transcript: Mapped[list | None] = mapped_column(JSONB, nullable=True)

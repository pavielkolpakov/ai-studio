from pydantic import BaseModel, EmailStr, Field


class ContactRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    email: EmailStr
    message: str = Field(..., min_length=1, max_length=5000)
    session_id: str | None = None


class ContactResponse(BaseModel):
    success: bool = True
    message: str = "Your message has been sent successfully."

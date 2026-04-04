from pydantic import BaseModel, Field


class SessionResponse(BaseModel):
    session_id: str


class ChatRequest(BaseModel):
    session_id: str
    message: str = Field(..., min_length=1, max_length=2000)


class ChatMessageOut(BaseModel):
    role: str
    content: str

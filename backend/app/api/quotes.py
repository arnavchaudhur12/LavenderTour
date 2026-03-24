from fastapi import APIRouter
from pydantic import BaseModel, EmailStr
from typing import Optional

router = APIRouter()


class QuoteRequest(BaseModel):
    destination: str
    channel: str  # whatsapp | instagram | email
    contact: str
    notes: Optional[str] = None


@router.post("/")
def create_quote(payload: QuoteRequest):
    # TODO: enqueue to SQS / persist to DB
    return {"status": "received", "destination": payload.destination, "channel": payload.channel}

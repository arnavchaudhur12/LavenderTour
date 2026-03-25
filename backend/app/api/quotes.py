from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.models.quote import Quote

router = APIRouter()


class QuoteRequest(BaseModel):
    destination: str
    channel: str  # whatsapp | instagram | email
    contact: str
    notes: Optional[str] = None


@router.post("/")
def create_quote(payload: QuoteRequest, db: Session = Depends(get_db)):
    quote = Quote(
        destination=payload.destination,
        channel=payload.channel,
        contact=payload.contact,
        notes=payload.notes,
    )
    db.add(quote)
    db.commit()
    db.refresh(quote)
    return {
        "status": "received",
        "id": quote.id,
        "destination": quote.destination,
        "channel": quote.channel,
        "contact": quote.contact,
    }

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, constr
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.db import get_db
from app.models.quote import Quote
from app.services.emailer import send_customer_enquiry_email

router = APIRouter()
settings = get_settings()


class QuoteRequest(BaseModel):
    destination: str
    channel: str  # whatsapp | instagram | email
    contact: str
    notes: Optional[str] = None


class EnquiryRequest(BaseModel):
    first_name: constr(min_length=1, max_length=80)
    email: constr(min_length=5, max_length=255)
    phone: constr(min_length=8, max_length=20)
    indie: str
    region: str
    group_size: str
    days: str
    budget: str
    hotel: str
    group_travel: str
    suggested_trips: list[str] = []


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


@router.post("/enquiry")
def create_enquiry(payload: EnquiryRequest, db: Session = Depends(get_db)):
    notes = (
        f"First name: {payload.first_name}\n"
        f"Email: {payload.email}\n"
        f"Phone: {payload.phone}\n"
        f"Indie traveler: {payload.indie}\n"
        f"Region: {payload.region}\n"
        f"Group size: {payload.group_size}\n"
        f"Trip length: {payload.days}\n"
        f"Budget: {payload.budget}\n"
        f"Stay preference: {payload.hotel}\n"
        f"Open to group travel: {payload.group_travel}\n"
        f"Suggested trips: {', '.join(payload.suggested_trips) if payload.suggested_trips else 'None'}"
    )

    enquiry = Quote(destination=payload.region, channel="email", contact=payload.email, notes=notes)
    db.add(enquiry)
    db.flush()

    subject = f"New Lavender Tour enquiry from {payload.first_name}"
    body = (
        "A new questionnaire enquiry has been submitted on Lavender Tour.\n\n"
        f"{notes}\n\n"
        f"Enquiry ID: {enquiry.id}"
    )

    try:
        send_customer_enquiry_email(subject, body, settings)
    except RuntimeError as exc:
        db.rollback()
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    db.commit()
    db.refresh(enquiry)

    return {
        "status": "received",
        "id": enquiry.id,
        "message": "Thanks, your request has been sent to our customer care team. We will assist you within 24 hours.",
    }

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, constr
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.db import get_db
from app.models.quote import Quote
from app.services.emailer import send_internal_notification_email

router = APIRouter()
settings = get_settings()


class QuoteRequest(BaseModel):
    destination: str
    channel: str
    contact: str
    notes: Optional[str] = None


class EnquiryRequest(BaseModel):
    first_name: constr(min_length=1, max_length=80)
    email: constr(min_length=5, max_length=255)
    phone: constr(min_length=8, max_length=20)
    indie: str
    region: str
    destination_type: Optional[str] = None
    travel_country: str
    travel_state: Optional[str] = None
    travel_city: str
    departure_date: constr(min_length=8, max_length=30)
    group_size: str
    days: str
    budget_per_person_inr: int
    hotel: str
    group_travel: str
    comments: Optional[constr(max_length=1000)] = None
    newsletter_opt_in: bool = False
    suggested_trips: list[str] = []


@router.post('/')
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
        'status': 'received',
        'id': quote.id,
        'destination': quote.destination,
        'channel': quote.channel,
        'contact': quote.contact,
    }


@router.post('/enquiry')
def create_enquiry(payload: EnquiryRequest, db: Session = Depends(get_db)):
    notes = (
        f'First name: {payload.first_name}\n'
        f'Email: {payload.email}\n'
        f'Phone: {payload.phone}\n'
        f'Indie traveler: {payload.indie}\n'
        f'Region: {payload.region}\n'
        f'Destination type: {payload.destination_type or "Not specified"}\n'
        f'Country: {payload.travel_country}\n'
        f'State/Region: {payload.travel_state or "Not specified"}\n'
        f'City: {payload.travel_city}\n'
        f'Departure date: {payload.departure_date}\n'
        f'Group size: {payload.group_size}\n'
        f'Trip length: {payload.days}\n'
        f'Budget per person: INR {payload.budget_per_person_inr}\n'
        f'Stay preference: {payload.hotel}\n'
        f'Open to group travel: {payload.group_travel}\n'
        f'Newsletter opt-in: {"Yes" if payload.newsletter_opt_in else "No"}\n'
        f'Suggested trips: {", ".join(payload.suggested_trips) if payload.suggested_trips else "None"}\n'
        f'Special requests: {payload.comments or "None"}'
    )

    enquiry = Quote(destination=payload.travel_city, channel='email', contact=payload.email, notes=notes)
    db.add(enquiry)
    db.flush()

    subject = f'New Lavender Tour enquiry from {payload.first_name}'
    body = (
        'A new questionnaire enquiry has been submitted on Lavender Tour.\n\n'
        f'{notes}\n\n'
        f'Enquiry ID: {enquiry.id}'
    )

    try:
        send_internal_notification_email(subject, body, settings)
    except RuntimeError as exc:
        db.rollback()
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    db.commit()
    db.refresh(enquiry)

    return {
        'status': 'received',
        'id': enquiry.id,
        'message': 'Thanks, your request has been sent to our customer care team. We will assist you within 24 hours.',
    }

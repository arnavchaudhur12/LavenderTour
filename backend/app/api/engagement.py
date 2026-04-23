from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr, constr
from typing import Optional
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.db import get_db
from app.models.engagement import FeedbackEntry, NewsletterSubscriber
from app.services.emailer import send_internal_notification_email

router = APIRouter()
settings = get_settings()


class NewsletterRequest(BaseModel):
    name: constr(min_length=1, max_length=120)
    email: EmailStr
    interests: list[constr(min_length=2, max_length=80)] = []


class FeedbackRequest(BaseModel):
    name: constr(min_length=1, max_length=120)
    city: constr(min_length=2, max_length=120)
    trip_type: Optional[constr(min_length=2, max_length=120)] = None
    rating: int
    comment: constr(min_length=10, max_length=500)


@router.post('/newsletter')
def subscribe_newsletter(payload: NewsletterRequest, db: Session = Depends(get_db)):
    existing = db.scalar(select(NewsletterSubscriber).where(NewsletterSubscriber.email == payload.email.lower()))
    if existing is not None:
        return {'status': 'subscribed', 'message': 'You are already subscribed to our travel newsletter.'}

    subscriber = NewsletterSubscriber(
        name=payload.name.strip(),
        email=payload.email.lower(),
        interests=', '.join(payload.interests) if payload.interests else None,
    )
    db.add(subscriber)
    db.flush()

    body = (
        'A new newsletter signup has been received.\n\n'
        f'Name: {subscriber.name}\n'
        f'Email: {subscriber.email}\n'
        f'Interests: {subscriber.interests or "General travel updates"}\n'
        f'Subscription ID: {subscriber.id}'
    )
    try:
        send_internal_notification_email('New Lavender Tour newsletter signup', body, settings)
    except RuntimeError as exc:
        db.rollback()
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=409, detail='This email is already subscribed.') from exc

    return {'status': 'subscribed', 'message': 'Thanks for subscribing. We will share travel ideas and updates with you soon.'}


@router.post('/feedback')
def submit_feedback(payload: FeedbackRequest, db: Session = Depends(get_db)):
    if payload.rating < 1 or payload.rating > 5:
        raise HTTPException(status_code=422, detail='Rating must be between 1 and 5')

    entry = FeedbackEntry(
        name=payload.name.strip(),
        city=payload.city.strip(),
        trip_type=payload.trip_type.strip() if payload.trip_type else None,
        rating=payload.rating,
        comment=payload.comment.strip(),
    )
    db.add(entry)
    db.flush()

    body = (
        'A new Lavender Tour feedback submission has been received.\n\n'
        f'Name: {entry.name}\n'
        f'City: {entry.city}\n'
        f'Trip type: {entry.trip_type or "Not provided"}\n'
        f'Rating: {entry.rating}/5\n'
        f'Feedback: {entry.comment}\n'
        f'Feedback ID: {entry.id}'
    )
    try:
        send_internal_notification_email('New Lavender Tour customer feedback', body, settings)
    except RuntimeError as exc:
        db.rollback()
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    db.commit()
    return {'status': 'received', 'message': 'Thank you for sharing your experience with Lavender Tour.'}

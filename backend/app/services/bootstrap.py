from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.destination import Destination


SEED_DESTINATIONS = [
    {"title": "Char Dham Circuit", "tag": "Spiritual", "region": "india", "days": "9-12", "budget": "comfort", "country": "India", "priority": 100},
    {"title": "Kaziranga + Shillong", "tag": "Wildlife", "region": "india", "days": "6-8", "budget": "comfort", "country": "India", "priority": 90},
    {"title": "Kedarkantha Trek", "tag": "Trekking", "region": "india", "days": "6-8", "budget": "budget", "country": "India", "priority": 80},
    {"title": "Phuket + Krabi", "tag": "Thailand", "region": "abroad", "days": "6-8", "budget": "comfort", "country": "Thailand", "priority": 100},
    {"title": "Dubai City Escape", "tag": "City Luxe", "region": "abroad", "days": "3-5", "budget": "premium", "country": "UAE", "priority": 85},
    {"title": "Singapore Family Break", "tag": "Family", "region": "abroad", "days": "3-5", "budget": "premium", "country": "Singapore", "priority": 80},
]


def seed_destinations(db: Session) -> None:
    existing_titles = set(db.scalars(select(Destination.title)).all())
    for item in SEED_DESTINATIONS:
        if item["title"] in existing_titles:
            continue
        db.add(Destination(**item))
    db.commit()

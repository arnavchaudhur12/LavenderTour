from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.destination import Destination


SEED_DESTINATIONS = [
    {"title": "Jim Corbett National Park", "tag": "Forest Safari", "region": "india", "days": "3-5", "budget": "comfort", "country": "India", "priority": 100},
    {"title": "Kaziranga National Park", "tag": "Rhino Safari", "region": "india", "days": "3-5", "budget": "comfort", "country": "India", "priority": 99},
    {"title": "Ranthambore National Park", "tag": "Tiger Reserve", "region": "india", "days": "3-5", "budget": "premium", "country": "India", "priority": 98},
    {"title": "Bandhavgarh National Park", "tag": "Tiger Safari", "region": "india", "days": "3-5", "budget": "premium", "country": "India", "priority": 97},
    {"title": "Kanha National Park", "tag": "Wildlife", "region": "india", "days": "6-8", "budget": "comfort", "country": "India", "priority": 96},
    {"title": "Sundarbans National Park", "tag": "Mangrove Safari", "region": "india", "days": "3-5", "budget": "comfort", "country": "India", "priority": 95},
    {"title": "Periyar National Park", "tag": "Forest Escape", "region": "india", "days": "3-5", "budget": "comfort", "country": "India", "priority": 94},
    {"title": "Goa Beach Stay", "tag": "Beach", "region": "india", "days": "3-5", "budget": "premium", "country": "India", "priority": 93},
    {"title": "Gokarna Beach Break", "tag": "Beach", "region": "india", "days": "3-5", "budget": "budget", "country": "India", "priority": 92},
    {"title": "Varkala Cliffside Escape", "tag": "Beach", "region": "india", "days": "3-5", "budget": "comfort", "country": "India", "priority": 91},
    {"title": "Kovalam Resort Coast", "tag": "Beach", "region": "india", "days": "3-5", "budget": "comfort", "country": "India", "priority": 90},
    {"title": "Puri Sea + Temple Circuit", "tag": "Beach", "region": "india", "days": "3-5", "budget": "budget", "country": "India", "priority": 89},
    {"title": "Tarkarli Coast Escape", "tag": "Beach", "region": "india", "days": "3-5", "budget": "comfort", "country": "India", "priority": 88},
    {"title": "Swaraj Dweep Island Stay", "tag": "Beach", "region": "india", "days": "6-8", "budget": "premium", "country": "India", "priority": 87},
    {"title": "Manali Mountain Escape", "tag": "Mountains", "region": "india", "days": "3-5", "budget": "comfort", "country": "India", "priority": 86},
    {"title": "Shimla Hill Station", "tag": "Mountains", "region": "india", "days": "3-5", "budget": "comfort", "country": "India", "priority": 85},
    {"title": "Darjeeling Tea Slopes", "tag": "Mountains", "region": "india", "days": "6-8", "budget": "comfort", "country": "India", "priority": 84},
    {"title": "Nainital Lake Hills", "tag": "Mountains", "region": "india", "days": "3-5", "budget": "budget", "country": "India", "priority": 83},
    {"title": "Mussoorie Hills", "tag": "Mountains", "region": "india", "days": "3-5", "budget": "comfort", "country": "India", "priority": 82},
    {"title": "Gangtok Himalayan Route", "tag": "Mountains", "region": "india", "days": "6-8", "budget": "premium", "country": "India", "priority": 81},
    {"title": "Munnar Tea Highlands", "tag": "Mountains", "region": "india", "days": "3-5", "budget": "comfort", "country": "India", "priority": 80},
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

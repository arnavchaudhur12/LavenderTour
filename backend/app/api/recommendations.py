from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Literal, List
from sqlalchemy import desc, select
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.models.destination import Destination

router = APIRouter()


class Preference(BaseModel):
    indie: bool
    region: Literal["india", "abroad"]
    group_size: str
    days: str
    budget: str
    hotel: str
    group_travel: bool


class Recommendation(BaseModel):
    title: str
    tag: str
    region: str
    days: str
    budget: str


@router.post("/", response_model=List[Recommendation])
def get_recommendations(payload: Preference, db: Session = Depends(get_db)):
    query = (
        select(Destination)
        .where(Destination.region == payload.region, Destination.active.is_(True))
        .order_by(desc(Destination.priority), Destination.title)
    )
    destinations = db.scalars(query).all()
    filtered = []
    for item in destinations:
        if payload.days != item.days and payload.budget != item.budget:
            continue
        filtered.append(
            Recommendation(
                title=item.title,
                tag=item.tag,
                region=item.region,
                days=item.days,
                budget=item.budget,
            )
        )
    if filtered:
        return filtered
    return [
        Recommendation(title=item.title, tag=item.tag, region=item.region, days=item.days, budget=item.budget)
        for item in destinations[:3]
    ]

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Literal, List

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
def get_recommendations(payload: Preference):
    # Placeholder rule-based logic. Replace with DB/ML powered engine.
    base = [
        Recommendation(title="Char Dham Circuit", tag="Spiritual", region="india", days="9-12", budget="comfort"),
        Recommendation(title="Kaziranga + Shillong", tag="Wildlife", region="india", days="6-8", budget="comfort"),
        Recommendation(title="Phuket + Krabi", tag="Thailand", region="abroad", days="6-8", budget="comfort"),
    ]
    return [r for r in base if r.region == payload.region]

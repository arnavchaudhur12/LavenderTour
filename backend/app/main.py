from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import router as api_router
from app.core.config import get_settings
from app.core.db import Base, SessionLocal, engine
from app.models.auth_user import AuthUser, PasswordResetToken
from app.models.destination import Destination
from app.models.quote import Quote
from app.services.bootstrap import seed_destinations

settings = get_settings()
app = FastAPI(title=settings.app_name, version="0.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        seed_destinations(db)


@app.get("/health", tags=["meta"])
def health():
    return {"status": "ok", "environment": settings.environment}

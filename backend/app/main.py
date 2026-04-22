from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import inspect, text

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
app.include_router(api_router, prefix="/api")


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    ensure_auth_user_schema()
    with SessionLocal() as db:
        seed_destinations(db)


@app.get("/health", tags=["meta"])
def health():
    return {"status": "ok", "environment": settings.environment}


@app.get("/api/health", tags=["meta"])
def api_health():
    return health()


def ensure_auth_user_schema():
    inspector = inspect(engine)
    auth_user_columns = {column["name"] for column in inspector.get_columns("auth_users")}
    if "first_name" not in auth_user_columns:
        with engine.begin() as connection:
            connection.execute(text("ALTER TABLE auth_users ADD COLUMN first_name VARCHAR(80) DEFAULT ''"))

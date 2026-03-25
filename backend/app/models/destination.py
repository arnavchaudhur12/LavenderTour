from datetime import datetime

from sqlalchemy import Boolean, DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import Base


class Destination(Base):
    __tablename__ = "destinations"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(120), unique=True, index=True)
    tag: Mapped[str] = mapped_column(String(80), index=True)
    region: Mapped[str] = mapped_column(String(20), index=True)
    days: Mapped[str] = mapped_column(String(20), index=True)
    budget: Mapped[str] = mapped_column(String(20), index=True)
    country: Mapped[str] = mapped_column(String(80))
    active: Mapped[bool] = mapped_column(Boolean, default=True)
    priority: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

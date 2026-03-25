from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, constr
from sqlalchemy import desc, select
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.db import get_db
from app.models.user import OTPCode, User

router = APIRouter()
settings = get_settings()


class OTPRequest(BaseModel):
    phone: constr(min_length=8, max_length=15)


class OTPVerify(BaseModel):
    phone: constr(min_length=8, max_length=15)
    code: constr(min_length=4, max_length=8)


@router.post("/request-otp")
def request_otp(payload: OTPRequest, db: Session = Depends(get_db)):
    user = db.scalar(select(User).where(User.phone == payload.phone))
    if user is None:
        user = User(phone=payload.phone)
        db.add(user)
        db.flush()

    otp = OTPCode(
        phone=payload.phone,
        code=settings.default_otp_code,
        expires_at=datetime.utcnow() + timedelta(minutes=settings.otp_ttl_minutes),
        user_id=user.id,
    )
    db.add(otp)
    db.commit()
    return {"message": "OTP sent", "phone": payload.phone, "expires_in_minutes": settings.otp_ttl_minutes}


@router.post("/verify-otp")
def verify_otp(payload: OTPVerify, db: Session = Depends(get_db)):
    otp = db.scalar(
        select(OTPCode)
        .where(OTPCode.phone == payload.phone, OTPCode.is_used.is_(False))
        .order_by(desc(OTPCode.created_at))
    )
    if otp is None or otp.expires_at < datetime.utcnow() or otp.code != payload.code:
        raise HTTPException(status_code=401, detail="Invalid code")
    otp.is_used = True
    user = db.scalar(select(User).where(User.phone == payload.phone))
    db.commit()
    return {"token": f"stub-jwt-token-{payload.phone}", "phone": payload.phone, "role": user.role if user else "customer"}

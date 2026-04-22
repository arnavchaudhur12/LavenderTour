from datetime import datetime, timedelta
import secrets

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, constr
from sqlalchemy import desc, select
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.db import get_db
from app.models.auth_user import AuthUser, PasswordResetToken
from app.services.emailer import send_password_reset_email
from app.services.passwords import hash_password, verify_password

router = APIRouter()
settings = get_settings()


class RegisterRequest(BaseModel):
    first_name: constr(min_length=1, max_length=80)
    email: constr(min_length=5, max_length=255)
    phone: constr(min_length=8, max_length=20)
    password: constr(min_length=8, max_length=128)
    role: constr(min_length=4, max_length=20) = "customer"


class LoginRequest(BaseModel):
    email: constr(min_length=5, max_length=255)
    password: constr(min_length=8, max_length=128)


class ForgotPasswordRequest(BaseModel):
    email: constr(min_length=5, max_length=255)


class ResetPasswordRequest(BaseModel):
    token: constr(min_length=20, max_length=128)
    password: constr(min_length=8, max_length=128)


def normalize_email(email: str) -> str:
    normalized = email.strip().lower()
    if "@" not in normalized or normalized.startswith("@") or normalized.endswith("@"):
        raise HTTPException(status_code=422, detail="Invalid email address")
    return normalized


def normalize_phone(phone: str) -> str:
    normalized = "".join(ch for ch in phone if ch.isdigit() or ch == "+").strip()
    if len(normalized.replace("+", "")) < 8:
        raise HTTPException(status_code=422, detail="Invalid phone number")
    return normalized


def normalize_first_name(first_name: str) -> str:
    normalized = " ".join(first_name.strip().split())
    if not normalized:
        raise HTTPException(status_code=422, detail="First name is required")
    return normalized


@router.post("/register")
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    first_name = normalize_first_name(payload.first_name)
    email = normalize_email(payload.email)
    phone = normalize_phone(payload.phone)
    existing_user = db.scalar(select(AuthUser).where(AuthUser.email == email))
    if existing_user is not None:
        raise HTTPException(status_code=409, detail="Email already registered")
    existing_phone = db.scalar(select(AuthUser).where(AuthUser.phone == phone))
    if existing_phone is not None:
        raise HTTPException(status_code=409, detail="Phone number already registered")

    user = AuthUser(
        first_name=first_name,
        email=email,
        phone=phone,
        password_hash=hash_password(payload.password),
        role=payload.role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return {
        "message": "Account created",
        "first_name": user.first_name,
        "email": user.email,
        "phone": user.phone,
        "role": user.role,
    }


@router.post("/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    email = normalize_email(payload.email)
    user = db.scalar(select(AuthUser).where(AuthUser.email == email))
    if user is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {
        "token": f"stub-jwt-token-{user.email}",
        "first_name": user.first_name,
        "email": user.email,
        "role": user.role,
    }


@router.post("/forgot-password")
def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    email = normalize_email(payload.email)
    user = db.scalar(select(AuthUser).where(AuthUser.email == email))
    if user is None:
        return {"message": "If the email exists, a reset link has been sent"}

    reset_token = secrets.token_urlsafe(32)
    token = PasswordResetToken(
        token=reset_token,
        expires_at=datetime.utcnow() + timedelta(minutes=settings.password_reset_ttl_minutes),
        user_id=user.id,
    )
    db.add(token)
    db.flush()
    try:
        send_password_reset_email(user.email, reset_token, settings)
    except RuntimeError as exc:
        db.rollback()
        raise HTTPException(status_code=502, detail=str(exc)) from exc
    db.commit()

    response = {"message": "If the email exists, a reset link has been sent"}
    if settings.email_debug_return_token:
        response["reset_token"] = reset_token
    return response


@router.post("/reset-password")
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    token = db.scalar(
        select(PasswordResetToken)
        .where(PasswordResetToken.token == payload.token, PasswordResetToken.is_used.is_(False))
        .order_by(desc(PasswordResetToken.created_at))
    )
    if token is None or token.expires_at < datetime.utcnow() or token.user is None:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")

    token.user.password_hash = hash_password(payload.password)
    token.is_used = True
    db.commit()
    return {"message": "Password updated successfully"}

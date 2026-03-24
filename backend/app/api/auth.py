from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, constr

router = APIRouter()


class OTPRequest(BaseModel):
    phone: constr(min_length=8, max_length=15)


class OTPVerify(BaseModel):
    phone: constr(min_length=8, max_length=15)
    code: constr(min_length=4, max_length=8)


@router.post("/request-otp")
def request_otp(payload: OTPRequest):
    # TODO: integrate with AWS SNS / Cognito custom flow
    return {"message": "OTP sent", "phone": payload.phone}


@router.post("/verify-otp")
def verify_otp(payload: OTPVerify):
    # TODO: validate against store (Redis/Cognito), issue JWT
    if payload.code != "1234":
        raise HTTPException(status_code=401, detail="Invalid code")
    return {"token": "stub-jwt-token", "phone": payload.phone, "role": "customer"}

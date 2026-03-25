from functools import lru_cache
from typing import Literal, Optional

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Lavender Tour API"
    environment: str = "dev"
    frontend_base_url: str = "http://localhost:3000"
    database_url: str = "postgresql+psycopg://lavender:lavender@localhost:5432/lavendertour"
    password_reset_ttl_minutes: int = 30
    email_delivery_backend: Literal["console", "smtp"] = "console"
    email_debug_return_token: bool = False
    email_from_address: Optional[str] = None
    smtp_host: Optional[str] = None
    smtp_port: int = 465
    smtp_username: Optional[str] = None
    smtp_password: Optional[str] = None
    smtp_use_tls: bool = False
    smtp_use_ssl: bool = True

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


@lru_cache
def get_settings() -> Settings:
    return Settings()

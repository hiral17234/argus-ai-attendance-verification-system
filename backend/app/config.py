import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # Application Info
    APP_NAME: str = "ARGUS Institutional Identity Verification & Attendance Platform"
    APP_VERSION: str = "2.0.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # API & CORS
    API_V1_PREFIX: str = "/api/v1"
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]
    
    # Database Configuration (PostgreSQL default, with automatic fallback for local development)
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://postgres:postgres@localhost:5432/argus_db"
    )
    SQLITE_FALLBACK_URL: str = "sqlite:///./argus_local.db"
    
    # JWT Authentication
    SECRET_KEY: str = os.getenv("SECRET_KEY", "argus-institutional-secret-key-change-in-production-2026-secure-token")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Institutional Email Domains (Strict Allowlist)
    STUDENT_EMAIL_DOMAIN: str = "mitsgwl.ac.in"
    TEACHER_EMAIL_DOMAIN: str = "mitsgwalior.ac.in"
    ADMIN_EMAIL_DOMAIN: str = "mitsadmin.ac.in"
    
    # OTP & Security
    OTP_EXPIRE_MINUTES: int = 10
    OTP_MAX_ATTEMPTS: int = 5
    PASSWORD_RESET_EXPIRE_MINUTES: int = 30
    
    # Geofence default radius (meters)
    DEFAULT_GEOFENCE_RADIUS_METERS: int = 150

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()


import os
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # App Settings
    APP_NAME: str = "ToolShare API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # Security
    SECRET_KEY: str = "your-secret-key-here"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Database
    DATABASE_URL: str = "sqlite:///./toolshare.db"
    DATABASE_POOL_SIZE: int = 10
    DATABASE_MAX_OVERFLOW: int = 20
    
    # Firebase
    FIREBASE_PROJECT_ID: str = "toolssharingapp"
    FIREBASE_API_KEY: str = "AIzaSyCWRIVKV-Irzenu8Ex7QBhiJ2rmeWiWglg"
    FIREBASE_SERVICE_ACCOUNT_PATH: str = "service-account.json"
    FIREBASE_PRIVATE_KEY_ID: str = ""
    FIREBASE_PRIVATE_KEY: str = ""
    FIREBASE_CLIENT_EMAIL: str = ""
    FIREBASE_CLIENT_ID: str = ""
    FIREBASE_AUTH_URI: str = "https://accounts.google.com/o/oauth2/auth"
    FIREBASE_TOKEN_URI: str = "https://oauth2.googleapis.com/token"
    
    # Java Token Service
    JAVA_TOKEN_SERVICE_URL: str = "http://localhost:8080"
    JAVA_TOKEN_SERVICE_TIMEOUT: int = 30
    JAVA_TOKEN_SERVICE_RETRY_ATTEMPTS: int = 3
    
    # CORS
    ALLOWED_HOSTS: List[str] = ["*"]
    CORS_ORIGINS: List[str] = ["*"]
    
    # File Upload
    MAX_FILE_SIZE: int = 5 * 1024 * 1024  # 5MB
    ALLOWED_FILE_TYPES: List[str] = ["jpg", "jpeg", "png", "webp"]
    UPLOAD_DIR: str = "uploads"
    
    # Email
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USERNAME: str = ""
    SMTP_PASSWORD: str = ""
    EMAIL_FROM: str = "noreply@toolshare.app"
    
    # Push Notifications
    FCM_SERVER_KEY: str = ""
    
    # External APIs
    GOOGLE_MAPS_API_KEY: str = ""
    STRIPE_SECRET_KEY: str = ""
    STRIPE_WEBHOOK_SECRET: str = ""
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    
    # Cache
    REDIS_URL: str = "redis://localhost:6379"
    CACHE_TTL: int = 3600  # 1 hour
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    RATE_LIMIT_PER_HOUR: int = 1000
    
    # Pagination
    DEFAULT_PAGE_SIZE: int = 20
    MAX_PAGE_SIZE: int = 100
    
    # Token System
    INITIAL_TOKEN_BALANCE: int = 5
    TOKEN_COST_PER_BORROW: int = 1
    TOKEN_REWARD_PER_LEND: int = 1
    MAX_TOKEN_BALANCE: int = 100
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
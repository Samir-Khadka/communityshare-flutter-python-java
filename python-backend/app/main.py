from fastapi import FastAPI, HTTPException, Depends
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.security import HTTPBearer
from contextlib import asynccontextmanager
import uvicorn
import logging
import os
import sys

# Add the parent directory to sys.path so 'app' package is found
# This allows running 'python main.py' from inside the 'app' folder
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if parent_dir not in sys.path:
    sys.path.append(parent_dir)

from app.config.settings import settings
from app.config.database import engine, Base
from app.api.v1 import auth, users, items, transactions, messages, reviews, notifications, search, location
from app.utils.logger import setup_logger
from app.core.firebase import initialize_firebase
from app.core.java_client import JavaTokenClient

# Setup logging
logger = setup_logger(__name__)

# Initialize Java Token Client
java_token_client = JavaTokenClient()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting ToolShare Python Backend...")
    
    # Initialize Firebase
    success = initialize_firebase()
    if success:
        logger.info("Firebase Admin SDK active.")
    else:
        logger.warning("Firebase Admin SDK failed. Backend will use REST API fallback.")
    
    # Initialize database tables
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully")
    except Exception as e:
        logger.error(f"Failed to create database tables: {e}")
        raise
    
    # Test Java connection
    try:
        await java_token_client.health_check()
        logger.info("Java Token Service connection status checked")
    except Exception as e:
        logger.warning(f"Initial Java Token Service health check failed (continuing anyway): {e}")
    
    yield
    
    # Shutdown
    logger.info("Shutting down ToolShare Python Backend...")

# Create FastAPI app
app = FastAPI(
    title="ToolShare API",
    description="Backend API for ToolShare - Community Tool Sharing Platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_HOSTS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add trusted host middleware
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=settings.ALLOWED_HOSTS
)

# Security
security = HTTPBearer()

# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/v1/users", tags=["Users"])
app.include_router(items.router, prefix="/api/v1/items", tags=["Items"])
app.include_router(transactions.router, prefix="/api/v1/transactions", tags=["Transactions"])
app.include_router(messages.router, prefix="/api/v1/messages", tags=["Messages"])
app.include_router(reviews.router, prefix="/api/v1/reviews", tags=["Reviews"])
app.include_router(notifications.router, prefix="/api/v1/notifications", tags=["Notifications"])
app.include_router(search.router, prefix="/api/v1/search", tags=["Search"])
app.include_router(location.router, prefix="/api/v1/location", tags=["Location"])

@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    favicon_path = os.path.join(os.path.dirname(__file__), "static", "favicon.png")
    return FileResponse(favicon_path)

@app.get("/")
async def root():
    return {
        "message": "ToolShare API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/health")
async def health_check():
    try:
        # Check database connection
        from app.config.database import SessionLocal
        from sqlalchemy import text
        db = SessionLocal()
        try:
            db.execute(text("SELECT 1"))
        finally:
            db.close()
        
        # Check Java Token Service
        java_health = await java_token_client.health_check()
        
        return {
            "status": "healthy",
            "database": "connected",
            "java_token_service": java_health,
            "firebase": "connected"
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return {
            "status": "unhealthy",
            "error": str(e)
        }

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Global exception: {exc}")
    return {
        "error": "Internal server error",
        "message": "An unexpected error occurred"
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info"
    )
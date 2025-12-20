import uvicorn
import os
import sys

# Add the current directory to sys.path so 'app' package is found
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

if __name__ == "__main__":
    from app.config.settings import settings
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info"
    )

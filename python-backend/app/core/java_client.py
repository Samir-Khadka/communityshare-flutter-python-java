import httpx
import logging
from typing import Dict, Any, List, Optional
from app.config.settings import settings

logger = logging.getLogger(__name__)

class JavaTokenClient:
    def __init__(self):
        self.base_url = settings.JAVA_TOKEN_SERVICE_URL
        self.timeout = settings.JAVA_TOKEN_SERVICE_TIMEOUT
        self.client = httpx.AsyncClient(base_url=self.base_url, timeout=self.timeout)

    async def health_check(self) -> Dict[str, Any]:
        """Check the health of the Java Token Service"""
        try:
            response = await self.client.get("/api/tokens/health")
            response.raise_for_status()
            try:
                return response.json()
            except Exception:
                # If it's not JSON (e.g., plain text "healthy"), wrap it
                return {"status": response.text.strip()}
        except Exception as e:
            logger.error(f"Java Token Service health check failed: {e}")
            return {"status": "down", "error": str(e)}

    async def get_balance(self, user_id: str) -> Dict[str, Any]:
        """Get token balance for a user from Java service"""
        try:
            response = await self.client.get(f"/api/tokens/balance/{user_id}")
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Failed to fetch balance for user {user_id}: {e}")
            raise

    async def process_transaction(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Process a token transaction via Java service"""
        try:
            response = await self.client.post("/api/tokens/transaction", json=payload)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Failed to process transaction: {e}")
            raise

    async def get_history(self, user_id: str, page: int = 0, size: int = 20) -> List[Dict[str, Any]]:
        """Get transaction history for a user from Java service"""
        try:
            params = {"page": page, "size": size}
            response = await self.client.get(f"/api/tokens/history/{user_id}", params=params)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Failed to fetch history for user {user_id}: {e}")
            raise

    async def close(self):
        """Close the async client"""
        await self.client.aclose()

from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any
from app.core.java_client import JavaTokenClient
import logging

logger = logging.getLogger(__name__)
router = APIRouter()
java_client = JavaTokenClient()

@router.get("/balance/{user_id}")
async def get_token_balance(user_id: str):
    """Fetch token balance from Java service"""
    try:
        balance = await java_client.get_balance(user_id)
        return balance
    except Exception as e:
        logger.error(f"Error fetching balance for {user_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch balance from token service")

@router.post("/process")
async def process_token_transaction(payload: Dict[str, Any]):
    """Process a transaction via Java service"""
    try:
        result = await java_client.process_transaction(payload)
        return result
    except Exception as e:
        logger.error(f"Error processing transaction: {e}")
        raise HTTPException(status_code=500, detail="Transaction processing failed")

@router.get("/history/{user_id}")
async def get_transaction_history(user_id: str, page: int = 0, size: int = 20):
    """Fetch transaction history from Java service"""
    try:
        history = await java_client.get_history(user_id, page, size)
        return history
    except Exception as e:
        logger.error(f"Error fetching history for {user_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch transaction history")

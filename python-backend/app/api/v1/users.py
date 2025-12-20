from fastapi import APIRouter, HTTPException, Depends, Body
from typing import List, Optional, Dict, Any
from firebase_admin import firestore
from app.config.settings import settings
import logging

logger = logging.getLogger(__name__)

router = APIRouter()
from app.core.java_client import JavaTokenClient
java_client = JavaTokenClient()

def get_firestore_db():
    try:
        return firestore.client()
    except Exception:
        return None

@router.get("")
async def get_users():
    db = get_firestore_db()
    
    # Try Admin SDK first
    if db:
        try:
            users_ref = db.collection('users')
            docs = users_ref.stream()
            users = []
            for doc in docs:
                user_data = doc.to_dict()
                user_data['id'] = doc.id
                if user_data.get('email') == 'ram123@gmail.com':
                    user_data['role'] = 'admin'
                users.append(user_data)
            return users
        except Exception as e:
            logger.warning(f"Admin SDK users fetch failed: {e}. Falling back to REST.")
            
    # Fallback to REST API
    try:
        from app.core.firestore_rest import firestore_rest
        rest_users = await firestore_rest.get_collection('users')
        for u in rest_users:
            if u.get('email') == 'ram123@gmail.com':
                u['role'] = 'admin'
        return rest_users
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching users from both SDK and REST: {str(e)}")

@router.post("")
async def create_user(user_id: str, email: str, display_name: str, role: str = 'user'):
    try:
        db = get_firestore_db()
        user_ref = db.collection('users').document(user_id)
        
        if user_ref.get().exists:
            return {"status": "exists", "message": "User already exists"}
            
        if email == 'ram123@gmail.com':
            role = 'admin'
            
        user_data = {
            'id': user_id,
            'email': email,
            'displayName': display_name,
            'role': role,
            'tokens': 100 if role == 'admin' else 5, # Admin gets more starting tokens
            'rating': 5.0
        }
        
        user_ref.set(user_data)
        return {"status": "success", "user": user_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating user: {str(e)}")

@router.get("/{user_id}")
async def get_user(user_id: str):
    db = get_firestore_db()
    
    # Try Admin SDK first
    if db:
        try:
            user_doc = db.collection('users').document(user_id).get()
            if not user_doc.exists:
                # If it's ram123, we might not have seeded it yet but we want to allow login
                # But usually we want to return 404 if not found
                raise HTTPException(status_code=404, detail="User not found")
            
            user_data = user_doc.to_dict()
            user_data['id'] = user_doc.id
            
            # Lazy Admin Promotion for ram123@gmail.com
            if user_data.get('email') == 'ram123@gmail.com':
                if user_data.get('role') != 'admin':
                    db.collection('users').document(user_id).update({'role': 'admin'})
                user_data['role'] = 'admin'
                
            return user_data
        except HTTPException:
            raise
        except Exception as e:
            logger.warning(f"Admin SDK user fetch failed: {e}. Falling back to REST.")

    # Fallback to REST API
    try:
        from app.core.firestore_rest import firestore_rest
        user_data = await firestore_rest.get_document('users', user_id)
        if not user_data:
            # Check if this is the magic admin email even if not in DB
            # Actually, better to let it fail or handled by login logic
            raise HTTPException(status_code=404, detail="User not found")
            
        # Hard Force Admin for ram123 even in REST fallback
        if user_data.get('email') == 'ram123@gmail.com':
            user_data['role'] = 'admin'
            
        return user_data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching user from both SDK and REST: {str(e)}")

@router.patch("/{user_id}/role")
async def update_user_role(user_id: str, role: str):
    try:
        if role not in ['user', 'admin']:
            raise HTTPException(status_code=400, detail="Invalid role. Must be 'user' or 'admin'")
            
        db = get_firestore_db()
        user_ref = db.collection('users').document(user_id)
        
        if not user_ref.get().exists:
            raise HTTPException(status_code=404, detail="User not found")
            
        user_ref.update({'role': role})
        return {"status": "success", "message": f"User role updated to {role}"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating user role: {str(e)}")
@router.post("/{user_id}/adjust-tokens")
async def adjust_user_tokens(user_id: str, payload: Dict[str, Any] = Body(...)):
    """Admin endpoint to manually adjust user tokens"""
    try:
        # payload should contain 'amount' and 'transactionType' (ADMIN_ADJUSTMENT or PENALTY)
        # amount should be positive absolute value
        java_payload = {
            "userId": user_id,
            "amount": payload.get('amount', 0),
            "transactionType": payload.get('transactionType', 'ADMIN_ADJUSTMENT'),
            "description": payload.get('description', 'Manual adjustment by admin'),
            "referenceId": "ADMIN_ACTION"
        }
        
        result = await java_client.process_transaction(java_payload)
        
        # Also update Firestore to keep it in sync if needed (though balance is mostly in Java now)
        # But for now, we'll just rely on the Java service
        
        return result
    except Exception as e:
        logger.error(f"Error adjusting tokens for {user_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to adjust tokens: {str(e)}")

@router.delete("/{user_id}")
async def delete_user(user_id: str):
    """Admin endpoint to remove a user"""
    try:
        db = get_firestore_db()
        user_ref = db.collection('users').document(user_id)
        
        if not user_ref.get().exists:
            raise HTTPException(status_code=404, detail="User not found")
            
        user_ref.delete()
        return {"status": "success", "message": "User deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting user {user_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to delete user: {str(e)}")

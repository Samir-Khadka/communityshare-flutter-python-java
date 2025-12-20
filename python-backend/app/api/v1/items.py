from fastapi import APIRouter, HTTPException, Depends, Query, Body
from typing import List, Optional, Dict, Any
from firebase_admin import firestore
from app.config.settings import settings

router = APIRouter()
from app.core.java_client import JavaTokenClient
java_client = JavaTokenClient()

def get_firestore_db():
    try:
        return firestore.client()
    except Exception:
        return None

@router.get("")
async def get_items(category: Optional[str] = None):
    db = get_firestore_db()
    
    # Try Admin SDK first
    if db:
        try:
            items_ref = db.collection('items')
            if category and category != 'all':
                query = items_ref.where('category', '==', category)
                docs = query.stream()
            else:
                docs = items_ref.stream()
                
            items = []
            for doc in docs:
                item_data = doc.to_dict()
                item_data['id'] = doc.id
                items.append(item_data)
            return items
        except Exception as e:
            logger.warning(f"Admin SDK items fetch failed: {e}. Falling back to REST.")
            
    # Fallback to REST API
    try:
        from app.core.firestore_rest import firestore_rest
        items = await firestore_rest.get_collection('items')
        if category and category != 'all':
            items = [it for it in items if it.get('category') == category]
        return items
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error fetching items from both SDK and REST: {str(e)}")

@router.get("/{item_id}")
async def get_item(item_id: str):
    try:
        db = get_firestore_db()
        item_doc = db.collection('items').document(item_id).get()
        
        if not item_doc.exists:
            raise HTTPException(status_code=404, detail="Item not found")
            
        item_data = item_doc.to_dict()
        item_data['id'] = item_doc.id
        return item_data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching item: {str(e)}")

@router.put("/{item_id}")
async def update_item(item_id: str, item_update: Dict[str, Any] = Body(...)):
    try:
        db = get_firestore_db()
        item_ref = db.collection('items').document(item_id)
        
        if not item_ref.get().exists:
            raise HTTPException(status_code=404, detail="Item not found")
            
        item_ref.update(item_update)
        return {"status": "success", "message": "Item updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating item: {str(e)}")

@router.delete("/{item_id}")
async def delete_item(item_id: str, admin_removal: bool = Query(False)):
    try:
        db = get_firestore_db()
        item_ref = db.collection('items').document(item_id)
        item_snapshot = item_ref.get()
        
        if not item_snapshot.exists:
            raise HTTPException(status_code=404, detail="Item not found")
            
        item_data = item_snapshot.to_dict()
        owner_id = item_data.get('ownerId')

        # If it's an admin removal, apply a penalty
        if admin_removal and owner_id:
            try:
                penalty_payload = {
                    "userId": owner_id,
                    "amount": 20.0,
                    "transactionType": "PENALTY",
                    "description": f"Penalty for item violation: {item_data.get('title')}",
                    "referenceId": item_id
                }
                await java_client.process_transaction(penalty_payload)
            except Exception as e:
                # Log the error but continue deletion (or we might want to fail)
                print(f"Failed to apply penalty: {e}")

        item_ref.delete()
        return {"status": "success", "message": "Item deleted successfully" + (" with penalty" if admin_removal else "")}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting item: {str(e)}")

@router.post("")
async def create_item(item: Dict[str, Any] = Body(...)):
    try:
        db = get_firestore_db()
        item_id = item.get('id')
        if not item_id:
            raise HTTPException(status_code=400, detail="Item ID is required")
            
        item_ref = db.collection('items').document(item_id)
        item_ref.set(item)
        
        # Apply Listing Reward (10 tokens)
        owner_id = item.get('ownerId')
        if owner_id:
            try:
                reward_payload = {
                    "userId": owner_id,
                    "amount": 10.0,
                    "transactionType": "ADMIN_ADJUSTMENT", # Or a new LISTING_REWARD type if added
                    "description": f"Listing Reward for: {item.get('title')}",
                    "referenceId": item_id
                }
                await java_client.process_transaction(reward_payload)
            except Exception as e:
                print(f"Failed to apply listing reward: {e}")

        return {"status": "success", "item": item}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating item: {str(e)}")

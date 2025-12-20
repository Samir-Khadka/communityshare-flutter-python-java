import httpx
from app.config.settings import settings
import logging

logger = logging.getLogger(__name__)

class FirestoreRestClient:
    def __init__(self):
        self.project_id = settings.FIREBASE_PROJECT_ID
        self.api_key = settings.FIREBASE_API_KEY
        self.base_url = f"https://firestore.googleapis.com/v1/projects/{self.project_id}/databases/(default)/documents"

    async def get_collection(self, collection_name: str):
        url = f"{self.base_url}/{collection_name}?key={self.api_key}"
        logger.info(f"REST Firestore Request: GET {url.split('?')[0]} (API Key hidden)")
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(url)
                logger.info(f"REST Firestore Response: {response.status_code}")
                if response.status_code == 200:
                    data = response.json()
                    documents = data.get('documents', [])
                    logger.info(f"REST Firestore found {len(documents)} documents in '{collection_name}'")
                    return [self._parse_firestore_doc(doc) for doc in documents]
                else:
                    logger.error(f"REST Firestore error ({response.status_code}) on '{collection_name}': {response.text}")
                    return []
            except Exception as e:
                logger.error(f"REST Firestore connection error: {e}")
                return []

    async def get_document(self, collection_name: str, doc_id: str):
        url = f"{self.base_url}/{collection_name}/{doc_id}?key={self.api_key}"
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            if response.status_code == 200:
                return self._parse_firestore_doc(response.json())
            return None

    async def update_document(self, collection_name: str, doc_id: str, data: dict):
        # Simplistic update using PATCH
        url = f"{self.base_url}/{collection_name}/{doc_id}?key={self.api_key}"
        # We need to construct document structure for REST
        # For simplicity, this is a placeholder. 
        # Most of our needs are GET.
        logger.warning("Update via REST not fully implemented, but GET is working.")
        return False

    def _parse_firestore_doc(self, doc):
        fields = doc.get('fields', {})
        res = {'id': doc.get('name', '').split('/')[-1]}
        for k, v in fields.items():
            if 'stringValue' in v:
                res[k] = v['stringValue']
            elif 'integerValue' in v:
                res[k] = int(v['integerValue'])
            elif 'doubleValue' in v:
                res[k] = float(v['doubleValue'])
            elif 'booleanValue' in v:
                res[k] = v['booleanValue']
            # Add more types if needed
        return res

# Global instance
firestore_rest = FirestoreRestClient()

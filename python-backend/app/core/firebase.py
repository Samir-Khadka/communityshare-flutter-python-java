import firebase_admin
from firebase_admin import credentials, firestore
from app.config.settings import settings
import logging

logger = logging.getLogger(__name__)

def initialize_firebase():
    if not firebase_admin._apps:
        try:
            # Try to initialize with Service Account if file exists
            import os
            # __file__ is app/core/firebase.py, we need to go up 3 levels to reach the root python-backend/
            root_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
            cert_path = os.path.join(root_dir, settings.FIREBASE_SERVICE_ACCOUNT_PATH)
            
            if os.path.exists(cert_path):
                cred = credentials.Certificate(cert_path)
                firebase_admin.initialize_app(cred)
                logger.info("Firebase initialized with Service Account JSON.")
            else:
                # Fallback to project_id (requires ADC)
                firebase_admin.initialize_app(options={
                    'projectId': settings.FIREBASE_PROJECT_ID
                })
                logger.info(f"Firebase initialized with projectId fallback: {settings.FIREBASE_PROJECT_ID}")
            
            # Test firestore client immediately to verify credentials
            try:
                db = firestore.client()
                # If we got here, we have credentials
                logger.info(f"Firebase initialized with Admin SDK for project: {settings.FIREBASE_PROJECT_ID}")
                
                # Ensure ram123@gmail.com is an admin
                users_ref = db.collection('users')
                query = users_ref.where('email', '==', 'ram123@gmail.com').stream()
                for doc in query:
                    if doc.to_dict().get('role') != 'admin':
                        doc.reference.update({'role': 'admin'})
                        logger.info("Successfully set ram123@gmail.com as permanent Admin.")
                return True
            except Exception as e:
                logger.warning(f"Firebase Admin SDK credentials missing or invalid. Falling back to REST API. Error: {e}")
                return False
                
        except Exception as e:
            import traceback
            logger.error(f"Failed to initialize Firebase app: {e}")
            traceback.print_exc()
            return False
    return True

import firebase_admin
from firebase_admin import credentials, firestore
import sys

def set_admin(email):
    if not firebase_admin._apps:
        firebase_admin.initialize_app()
    
    db = firestore.client()
    users_ref = db.collection('users')
    query = users_ref.where('email', '==', email).stream()
    
    found = False
    for doc in query:
        doc.reference.update({'role': 'admin'})
        print(f"Successfully set user {email} (ID: {doc.id}) as Admin.")
        found = True
    
    if not found:
        print(f"User with email {email} not found.")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        set_admin(sys.argv[1])
    else:
        print("Please provide an email address.")

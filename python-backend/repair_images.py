import firebase_admin
from firebase_admin import credentials, firestore
import os

# Initialize Firestore
service_account_path = 'd:/Programs/communityshare/python-backend/service-account.json'
if not os.path.exists(service_account_path):
    print(f"Error: {service_account_path} not found.")
    exit(1)

cred = credentials.Certificate(service_account_path)
firebase_admin.initialize_app(cred)
db = firestore.client()

category_images = {
    'Tools': 'https://images.unsplash.com/photo-1540348563548-6485ec92671e?auto=format&fit=crop&w=800&q=80',
    'Gardening': 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80',
    'Electronics': 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    'Camping': 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80',
    'Sports': 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80',
    'Other': 'https://images.unsplash.com/photo-1540103359371-30d075bc7bde?auto=format&fit=crop&w=800&q=80',
}

def repair_images():
    items_ref = db.collection('items')
    docs = items_ref.stream()
    
    updated_count = 0
    for doc in docs:
        item_data = doc.to_dict()
        category = item_data.get('category', 'Other')
        # If imageUrl is missing, null, or is the old broken one
        current_url = item_data.get('imageUrl')
        
        target_url = category_images.get(category, category_images['Other'])
        
        # Simple fix: just update all of them to be safe, or only if missing/broken
        # Given the user says they "vanish", let's ensure they have the new good ones
        if current_url != target_url:
            doc.reference.update({'imageUrl': target_url})
            updated_count += 1
            print(f"Updated item {doc.id} ({item_data.get('title')})")

    print(f"Successfully updated image URLs for {updated_count} items.")

if __name__ == '__main__':
    repair_images()

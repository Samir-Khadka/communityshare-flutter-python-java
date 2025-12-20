// Firebase configuration for web app
import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Using direct Firebase config from Flutter app
const firebaseConfig = {
    apiKey: "AIzaSyCWRIVKV-Irzenu8Ex7QBhiJ2rmeWiWglg",
    authDomain: "toolssharingapp.firebaseapp.com",
    projectId: "toolssharingapp",
    storageBucket: "toolssharingapp.firebasestorage.app",
    messagingSenderId: "19857172539",
    appId: "1:19857172539:web:b75609995faaf0dffcd41e"
}

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
const auth = getAuth(app)
const db = getFirestore(app)

export { app, auth, db }

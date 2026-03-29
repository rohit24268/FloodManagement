import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import type { SOSPin, Alert } from "../types/disaster";

// Firebase configuration - REPLACE WITH YOUR OWN CONFIG
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDemoKeyForDevelopment",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "disaster-demo",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abc123def456",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

/**
 * Save an SOS emergency ping to Firebase
 */
export async function saveSOSPin(
  latitude: number,
  longitude: number
): Promise<SOSPin | null> {
  try {
    const docRef = await addDoc(collection(db, "emergency_pings"), {
      latitude,
      longitude,
      timestamp: Date.now(),
      status: "pending",
      userId: "anonymous", // In production, use actual user IDs
    });

    return {
      id: docRef.id,
      latitude,
      longitude,
      timestamp: Date.now(),
      status: "pending",
    };
  } catch (error) {
    console.error("Error saving SOS pin:", error);
    return null;
  }
}

/**
 * Subscribe to real-time SOS pins
 */
export function subscribeToSOSPins(callback: (pins: SOSPin[]) => void): () => void {
  try {
    const q = query(
      collection(db, "emergency_pings"),
      where("status", "in", ["pending", "responded"]),
      orderBy("timestamp", "desc"),
      limit(100)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const pins = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as SOSPin[];
      callback(pins);
    });

    return unsubscribe;
  } catch (error) {
    console.error("Error subscribing to SOS pins:", error);
    return () => {};
  }
}

/**
 * Subscribe to active alerts
 */
export function subscribeToAlerts(callback: (alerts: Alert[]) => void): () => void {
  try {
    const q = query(
      collection(db, "alerts"),
      where("active", "==", true),
      orderBy("timestamp", "desc"),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const alerts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Alert[];
      callback(alerts);
    });

    return unsubscribe;
  } catch (error) {
    console.error("Error subscribing to alerts:", error);
    return () => {};
  }
}

/**
 * Create a new alert in Firebase
 */
export async function createAlert(alert: Omit<Alert, "id">): Promise<Alert | null> {
  try {
    const docRef = await addDoc(collection(db, "alerts"), alert);
    return { id: docRef.id, ...alert };
  } catch (error) {
    console.error("Error creating alert:", error);
    return null;
  }
}

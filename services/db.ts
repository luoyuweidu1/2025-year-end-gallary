import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  doc,
  getDoc
} from "firebase/firestore";
import { firebaseConfig } from "./firebaseConfig";
import { Memory } from '../types';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const COLLECTION_NAME = "galleries";
const LOCAL_STORAGE_KEY = "meowseum_my_gallery_id";

/**
 * Saves the gallery to Firestore and stores the ID locally so the user can find it again.
 */
export const saveGallery = async (memories: Memory[]) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      createdAt: Date.now(),
      memories: memories,
      deviceAgent: navigator.userAgent
    });
    
    // Save the ID to local storage so we know which gallery belongs to this user
    localStorage.setItem(LOCAL_STORAGE_KEY, docRef.id);
    
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};

/**
 * Retrieves the specific gallery created by the current user (stored in LocalStorage).
 */
export const getLatestGallery = async () => {
  try {
    const myGalleryId = localStorage.getItem(LOCAL_STORAGE_KEY);
    
    if (!myGalleryId) {
      return null;
    }

    const docRef = doc(db, COLLECTION_NAME, myGalleryId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as any;
    } else {
      // If doc doesn't exist (maybe deleted), clear local storage
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      return null;
    }
  } catch (e) {
    console.error("Error fetching gallery: ", e);
    return null;
  }
};

/**
 * Checks if the user has a gallery ID stored locally.
 */
export const hasSavedGalleries = async (): Promise<boolean> => {
    // Quick check: do we have an ID stored?
    return !!localStorage.getItem(LOCAL_STORAGE_KEY);
};

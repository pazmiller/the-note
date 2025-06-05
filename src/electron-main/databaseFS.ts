import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp( firebaseConfig );
const db = getFirestore( app );
const notesCollection = collection( db, 'notes' );

export const cloudNotes = {
  async createNote( note: { title: string; content: string; uid: string } )
  {
    const docRef = await addDoc( notesCollection, {
      ...note,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    } );
    return { id: docRef.id };
  },
  async getAllNotes( uid: string )
  {
    // 通过 uid 筛选出当前用户的笔记
    const q = query( notesCollection, where( "uid", "==", uid ) );
    const snapshot = await getDocs( q );
    return snapshot.docs.map( doc => ( { id: doc.id, ...doc.data() } ) );
  },
  async getNote( noteId: string )
  {
    const noteRef = doc( db, 'notes', noteId );
    const noteSnap = await getDoc( noteRef );
    if ( noteSnap.exists() )
    {
      return { id: noteSnap.id, ...noteSnap.data() };
    } else
    {
      return null;
    }
  },
  async updateNote( noteId: string, noteData: { title: string; content: string } )
  {
    const noteRef = doc( db, 'notes', noteId );
    return await updateDoc( noteRef, { ...noteData, updated_at: new Date().toISOString() } );
  },
  async deleteNote( noteId: string )
  {
    const noteRef = doc( db, 'notes', noteId );
    return await deleteDoc( noteRef );
  },
};

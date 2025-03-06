import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAqpieXYPeE4E_s7pCJItHGVdIzg13FnCI",
  authDomain: "eseential-note.firebaseapp.com",
  projectId: "eseential-note",
  storageBucket: "eseential-note.firebasestorage.app",
  messagingSenderId: "689345182013",
  appId: "1:689345182013:web:e6abde488644bf5f1dad54",
  measurementId: "G-S6RL8JSYK2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const notesCollection = collection(db, 'notes');

export const cloudNotes = {
  async createNote(note: { title: string; content: string; uid: string }) {
    const docRef = await addDoc(notesCollection, {
      ...note,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    return { id: docRef.id };
  },
  async getAllNotes(uid: string) {
    // 通过 uid 筛选出当前用户的笔记
    const q = query(notesCollection, where("uid", "==", uid));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  async getNote(noteId: string) {
    const noteRef = doc(db, 'notes', noteId);
    const noteSnap = await getDoc(noteRef);
    if (noteSnap.exists()) {
      return { id: noteSnap.id, ...noteSnap.data() };
    } else {
      return null;
    }
  },
  async updateNote(noteId: string, noteData: { title: string; content: string }) {
    const noteRef = doc(db, 'notes', noteId);
    return await updateDoc(noteRef, { ...noteData, updated_at: new Date().toISOString() });
  },
  async deleteNote(noteId: string) {
    const noteRef = doc(db, 'notes', noteId);
    return await deleteDoc(noteRef);
  },
};

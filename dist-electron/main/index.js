import { ipcMain, app as app$1, BrowserWindow } from "electron";
import { join } from "path";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, query, where, getDocs, doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import __cjs_mod__ from "node:module";
const __filename = import.meta.filename;
const __dirname = import.meta.dirname;
const require2 = __cjs_mod__.createRequire(import.meta.url);
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
const notesCollection = collection(db, "notes");
const cloudNotes = {
  async createNote(note) {
    const docRef = await addDoc(notesCollection, {
      ...note,
      created_at: (/* @__PURE__ */ new Date()).toISOString(),
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    });
    return { id: docRef.id };
  },
  async getAllNotes(uid) {
    const q = query(notesCollection, where("uid", "==", uid));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc2) => ({ id: doc2.id, ...doc2.data() }));
  },
  async getNote(noteId) {
    const noteRef = doc(db, "notes", noteId);
    const noteSnap = await getDoc(noteRef);
    if (noteSnap.exists()) {
      return { id: noteSnap.id, ...noteSnap.data() };
    } else {
      return null;
    }
  },
  async updateNote(noteId, noteData) {
    const noteRef = doc(db, "notes", noteId);
    return await updateDoc(noteRef, { ...noteData, updated_at: (/* @__PURE__ */ new Date()).toISOString() });
  },
  async deleteNote(noteId) {
    const noteRef = doc(db, "notes", noteId);
    return await deleteDoc(noteRef);
  }
};
function setupIpcHandlers() {
  ipcMain.handle("create-note", async (_, title, content, uid = "testUser") => {
    try {
      return await cloudNotes.createNote({ title, content, uid });
    } catch (error) {
      console.error("Error creating note:", error);
      throw error;
    }
  });
  ipcMain.handle("get-all-notes", async (_, uid = "testUser") => {
    try {
      return await cloudNotes.getAllNotes(uid);
    } catch (error) {
      console.error("Error getting all notes:", error);
      throw error;
    }
  });
  ipcMain.handle("get-note", async (_, noteId) => {
    try {
      return await cloudNotes.getNote(noteId);
    } catch (error) {
      console.error("Error getting note:", error);
      throw error;
    }
  });
  ipcMain.handle("update-note", async (_, noteId, title, content) => {
    try {
      return await cloudNotes.updateNote(noteId, { title, content });
    } catch (error) {
      console.error("Error updating note:", error);
      throw error;
    }
  });
  ipcMain.handle("delete-note", async (_, noteId) => {
    try {
      return await cloudNotes.deleteNote(noteId);
    } catch (error) {
      console.error("Error deleting note:", error);
      throw error;
    }
  });
}
let mainWindow = null;
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(__dirname, "../../dist-electron/preload/index.cjs")
    }
  });
  mainWindow.webContents.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
}
ipcMain.handle("set-window-size", async (_, width, height) => {
  if (mainWindow) {
    mainWindow.setSize(width, height);
  }
});
app$1.whenReady().then(() => {
  setupIpcHandlers();
  createWindow();
  app$1.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
app$1.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app$1.quit();
  }
});

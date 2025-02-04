import { app, ipcMain, BrowserWindow } from "electron";
import { join } from "path";
import Database from "better-sqlite3";
import __cjs_mod__ from "node:module";
const __filename = import.meta.filename;
const __dirname = import.meta.dirname;
const require2 = __cjs_mod__.createRequire(import.meta.url);
let db = null;
const database = {
  init() {
    if (db) return;
    const dbPath = join(app.getPath("userData"), "notes.db");
    db = new Database(dbPath);
    db.exec(`
      CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `);
  },
  createNote(title, content) {
    const stmt = db.prepare(`
      INSERT INTO notes (title, content, created_at, updated_at) 
      VALUES (?, ?, datetime('now'), datetime('now'))
    `);
    return stmt.run(title, content);
  },
  getAllNotes() {
    const stmt = db.prepare("SELECT * FROM notes ORDER BY updated_at DESC");
    return stmt.all();
  },
  getNote(id) {
    const stmt = db.prepare("SELECT * FROM notes WHERE id = ?");
    return stmt.get(id);
  },
  updateNote(id, title, content) {
    const stmt = db.prepare(`
      UPDATE notes 
      SET title = ?, content = ?, updated_at = datetime('now') 
      WHERE id = ?
    `);
    return stmt.run(title, content, id);
  },
  deleteNote(id) {
    const stmt = db.prepare("DELETE FROM notes WHERE id = ?");
    return stmt.run(id);
  }
};
function setupIpcHandlers() {
  ipcMain.handle("create-note", async (_, title, content) => {
    try {
      return database.createNote(title, content);
    } catch (error) {
      console.error("Error creating note:", error);
      throw error;
    }
  });
  ipcMain.handle("get-all-notes", async () => {
    try {
      return database.getAllNotes();
    } catch (error) {
      console.error("Error getting all notes:", error);
      throw error;
    }
  });
  ipcMain.handle("get-note", async (_, id) => {
    try {
      return database.getNote(id);
    } catch (error) {
      console.error("Error getting note:", error);
      throw error;
    }
  });
  ipcMain.handle("update-note", async (_, id, title, content) => {
    try {
      return database.updateNote(id, title, content);
    } catch (error) {
      console.error("Error updating note:", error);
      throw error;
    }
  });
  ipcMain.handle("delete-note", async (_, id) => {
    try {
      return database.deleteNote(id);
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
  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
}
app.whenReady().then(() => {
  database.init();
  setupIpcHandlers();
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

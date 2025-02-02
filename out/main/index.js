import { BrowserWindow, app, ipcMain } from "electron";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import Database from "better-sqlite3";
const currentDir = dirname(fileURLToPath(import.meta.url));
const rootDir = join(currentDir, "../../../");
const paths = {
  root: rootDir,
  preload: join(rootDir, "preload/index.js"),
  renderer: join(rootDir, "renderer/index.html")
};
async function createMainWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: paths.preload
    }
  });
  if (process.env.VITE_DEV_SERVER_URL) {
    await win.loadURL(process.env.VITE_DEV_SERVER_URL);
    win.webContents.openDevTools();
  } else {
    await win.loadFile(paths.renderer);
  }
  return win;
}
const dbPath = join(app.getPath("userData"), "notes.db");
const db = new Database(dbPath);
db.exec(`
  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);
const NotesDB = {
  create: (title, content) => {
    const stmt = db.prepare("INSERT INTO notes (title, content) VALUES (?, ?)");
    return stmt.run(title, content);
  },
  getAll: () => {
    const stmt = db.prepare("SELECT * FROM notes ORDER BY updated_at DESC");
    return stmt.all();
  },
  get: (id) => {
    const stmt = db.prepare("SELECT * FROM notes WHERE id = ?");
    return stmt.get(id);
  },
  update: (id, title, content) => {
    const stmt = db.prepare(`
      UPDATE notes 
      SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `);
    return stmt.run(title, content, id);
  },
  delete: (id) => {
    const stmt = db.prepare("DELETE FROM notes WHERE id = ?");
    return stmt.run(id);
  }
};
function setupIpcHandlers() {
  ipcMain.handle("notes:create", async (_, title, content) => {
    return NotesDB.create(title, content);
  });
  ipcMain.handle("notes:getAll", async () => {
    return NotesDB.getAll();
  });
  ipcMain.handle("notes:get", async (_, id) => {
    return NotesDB.get(id);
  });
  ipcMain.handle("notes:update", async (_, id, title, content) => {
    return NotesDB.update(id, title, content);
  });
  ipcMain.handle("notes:delete", async (_, id) => {
    return NotesDB.delete(id);
  });
}
async function initialize() {
  await createMainWindow();
  setupIpcHandlers();
}
app.whenReady().then(initialize);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

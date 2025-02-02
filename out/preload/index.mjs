import { contextBridge, ipcRenderer } from "electron";
const api = {
  createNote: (title, content) => ipcRenderer.invoke("notes:create", title, content),
  getAllNotes: () => ipcRenderer.invoke("notes:getAll"),
  getNote: (id) => ipcRenderer.invoke("notes:get", id),
  updateNote: (id, title, content) => ipcRenderer.invoke("notes:update", id, title, content),
  deleteNote: (id) => ipcRenderer.invoke("notes:delete", id)
};
contextBridge.exposeInMainWorld("notesApi", api);

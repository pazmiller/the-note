"use strict";
const electron = require("electron");
console.log("Preload loadedddddd");
const api = {
  createNote: (title, content) => electron.ipcRenderer.invoke("create-note", title, content),
  getAllNotes: () => electron.ipcRenderer.invoke("get-all-notes"),
  getNote: (id) => electron.ipcRenderer.invoke("get-note", id),
  updateNote: (id, title, content) => electron.ipcRenderer.invoke("update-note", id, title, content),
  deleteNote: (id) => electron.ipcRenderer.invoke("delete-note", id)
};
electron.contextBridge.exposeInMainWorld("notesApi", api);

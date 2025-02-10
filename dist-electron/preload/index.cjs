"use strict";
const electron = require("electron");
const api = {
  createNote: (title, content, uid) => electron.ipcRenderer.invoke("create-note", title, content, uid),
  getAllNotes: (uid) => electron.ipcRenderer.invoke("get-all-notes", uid),
  getNote: (noteId) => electron.ipcRenderer.invoke("get-note", noteId),
  updateNote: (noteId, title, content) => electron.ipcRenderer.invoke("update-note", noteId, title, content),
  deleteNote: (noteId) => electron.ipcRenderer.invoke("delete-note", noteId),
  setWindowSize: (width, height) => electron.ipcRenderer.invoke("set-window-size", width, height)
};
electron.contextBridge.exposeInMainWorld("notesApi", api);

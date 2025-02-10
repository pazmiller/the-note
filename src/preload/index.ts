import { contextBridge, ipcRenderer } from 'electron'

export type NotesAPI = {
  createNote: (title: string, content: string, uid?: string) => Promise<any>
  getAllNotes: (uid?: string) => Promise<Note[]>
  getNote: (noteId: string) => Promise<Note | null>
  updateNote: (noteId: string, title: string, content: string) => Promise<any>
  deleteNote: (noteId: string) => Promise<any>
  setWindowSize: (width: number, height: number) => Promise<void>
}

const api: NotesAPI = {
  createNote: (title, content, uid) => ipcRenderer.invoke('create-note', title, content, uid),
  getAllNotes: (uid) => ipcRenderer.invoke('get-all-notes', uid),
  getNote: (noteId) => ipcRenderer.invoke('get-note', noteId),
  updateNote: (noteId, title, content) => ipcRenderer.invoke('update-note', noteId, title, content),
  deleteNote: (noteId) => ipcRenderer.invoke('delete-note', noteId),
  setWindowSize: (width, height) => ipcRenderer.invoke('set-window-size', width, height)
}

contextBridge.exposeInMainWorld('notesApi', api)

declare global {
  interface Window {
    notesApi: NotesAPI
  }
}

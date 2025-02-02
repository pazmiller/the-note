import { contextBridge, ipcRenderer } from 'electron'
export type NotesAPI = {
  createNote: (title: string, content: string) => Promise<any>
  getAllNotes: () => Promise<Note[]>
  getNote: (id: number) => Promise<Note>
  updateNote: (id: number, title: string, content: string) => Promise<any>
  deleteNote: (id: number) => Promise<any>
}

const api: NotesAPI = {
  createNote: (title, content) => 
    ipcRenderer.invoke('notes:create', title, content),
  getAllNotes: () => 
    ipcRenderer.invoke('notes:getAll'),
  getNote: (id) => 
    ipcRenderer.invoke('notes:get', id),
  updateNote: (id, title, content) => 
    ipcRenderer.invoke('notes:update', id, title, content),
  deleteNote: (id) => 
    ipcRenderer.invoke('notes:delete', id)
}

contextBridge.exposeInMainWorld('notesApi', api)

// TypeScript 声明
declare global {
  interface Window {
    notesApi: NotesAPI
  }
}
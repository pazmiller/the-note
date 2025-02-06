console.log('Preload loadedddddd');
import { contextBridge, ipcRenderer } from 'electron'

export type NotesAPI = {
  createNote: (title: string, content: string) => Promise<any>
  getAllNotes: () => Promise<Note[]>
  getNote: (id: number) => Promise<Note>
  updateNote: (id: number, title: string, content: string) => Promise<any>
  deleteNote: (id: number) => Promise<any>
  // 新增方法：设置窗口大小
  setWindowSize: (width: number, height: number) => Promise<void>
}

const api: NotesAPI = {
  createNote: (title, content) => ipcRenderer.invoke('create-note', title, content),
  getAllNotes: () => ipcRenderer.invoke('get-all-notes'),
  getNote: (id) => ipcRenderer.invoke('get-note', id),
  updateNote: (id, title, content) => ipcRenderer.invoke('update-note', id, title, content),
  deleteNote: (id) => ipcRenderer.invoke('delete-note', id),
  // 通过 IPC 调用主进程中注册的 "set-window-size" 事件
  setWindowSize: (width, height) => ipcRenderer.invoke('set-window-size', width, height)
}

contextBridge.exposeInMainWorld('notesApi', api)

// TypeScript 声明
declare global {
  interface Window {
    notesApi: NotesAPI
  }
}

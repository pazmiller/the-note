import { contextBridge, ipcRenderer } from 'electron'
import { NotesAPI } from '../../types';


const api: NotesAPI = {
  createNote: ( title, content, uid ) => ipcRenderer.invoke( 'create-note', title, content, uid ),
  getAllNotes: ( uid ) => ipcRenderer.invoke( 'get-all-notes', uid ),
  getNote: ( noteId ) => ipcRenderer.invoke( 'get-note', noteId ),
  updateNote: ( noteId, title, content ) => ipcRenderer.invoke( 'update-note', noteId, title, content ),
  deleteNote: ( noteId ) => ipcRenderer.invoke( 'delete-note', noteId ),
  setWindowSize: ( width, height ) => ipcRenderer.invoke( 'set-window-size', width, height )
}

contextBridge.exposeInMainWorld( 'notesApi', api )

declare global
{
  interface Window
  {
    notesApi: NotesAPI
  }
}

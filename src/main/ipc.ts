// src/main/ipc.ts
import { ipcMain } from 'electron'
import { cloudNotes } from './databaseFS'

export function setupIpcHandlers() {
  ipcMain.handle('create-note', async (_, title: string, content: string, uid:string='testUser') => {
    try {
      return await cloudNotes.createNote({title, content, uid})
    } catch (error) {
      console.error('Error creating note:', error)
      throw error
    }
  })

  ipcMain.handle('get-all-notes', async (_, uid:string='testUser') => {
    try {
      return await cloudNotes.getAllNotes(uid)
    } catch (error) {
      console.error('Error getting all notes:', error)
      throw error
    }
  })

  ipcMain.handle('get-note', async (_, noteId: string) => {
    try {
      return await cloudNotes.getNote(noteId)
    } catch (error) {
      console.error('Error getting note:', error)
      throw error
    }
  })

  ipcMain.handle('update-note', async (_, noteId: string, title: string, content: string) => {
    try {
      return await cloudNotes.updateNote(noteId, {title, content})
    } catch (error) {
      console.error('Error updating note:', error)
      throw error
    }
  })

  ipcMain.handle('delete-note', async (_, noteId: string) => {
    try {
      return await cloudNotes.deleteNote(noteId)
    } catch (error) {
      console.error('Error deleting note:', error)
      throw error
    }
  })
}
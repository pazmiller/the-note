// src/main/ipc.ts
import { ipcMain } from 'electron'
import { database } from './database'

export function setupIpcHandlers() {
  ipcMain.handle('create-note', async (_, title: string, content: string) => {
    try {
      return database.createNote(title, content)
    } catch (error) {
      console.error('Error creating note:', error)
      throw error
    }
  })

  ipcMain.handle('get-all-notes', async () => {
    try {
      return database.getAllNotes()
    } catch (error) {
      console.error('Error getting all notes:', error)
      throw error
    }
  })

  ipcMain.handle('get-note', async (_, id: number) => {
    try {
      return database.getNote(id)
    } catch (error) {
      console.error('Error getting note:', error)
      throw error
    }
  })

  ipcMain.handle('update-note', async (_, id: number, title: string, content: string) => {
    try {
      return database.updateNote(id, title, content)
    } catch (error) {
      console.error('Error updating note:', error)
      throw error
    }
  })

  ipcMain.handle('delete-note', async (_, id: number) => {
    try {
      return database.deleteNote(id)
    } catch (error) {
      console.error('Error deleting note:', error)
      throw error
    }
  })
}
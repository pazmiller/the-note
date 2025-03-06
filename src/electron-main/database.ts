// src/electron-main/database.ts
import Database from 'better-sqlite3'
import { app } from 'electron'
import { join } from 'path'

let db: any = null

export const database = {
  init()
  {
    if ( db ) return

    const dbPath = join( app.getPath( 'userData' ), 'notes.db' )
    db = new Database( dbPath )

    db.exec( `
      CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `)
  },

  createNote( title: string, content: string )
  {
    const stmt = db.prepare( `
      INSERT INTO notes (title, content, created_at, updated_at) 
      VALUES (?, ?, datetime('now'), datetime('now'))
    `)
    return stmt.run( title, content )
  },

  getAllNotes()
  {
    const stmt = db.prepare( 'SELECT * FROM notes ORDER BY updated_at DESC' )
    return stmt.all()
  },

  getNote( id: number )
  {
    const stmt = db.prepare( 'SELECT * FROM notes WHERE id = ?' )
    return stmt.get( id )
  },

  updateNote( id: number, title: string, content: string )
  {
    const stmt = db.prepare( `
      UPDATE notes 
      SET title = ?, content = ?, updated_at = datetime('now') 
      WHERE id = ?
    `)
    return stmt.run( title, content, id )
  },

  deleteNote( id: number )
  {
    const stmt = db.prepare( 'DELETE FROM notes WHERE id = ?' )
    return stmt.run( id )
  }
}
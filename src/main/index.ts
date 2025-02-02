import { app, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { database } from './database'
import { setupIpcHandlers } from './ipc'


// 处理 Windows 上的 squirrel 事件
if (require('electron-squirrel-startup')) app.quit()

let mainWindow: BrowserWindow | null = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(__dirname, '../preload/index.mjs')
    }
  })

  // 加载 renderer 入口
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// IPC 处理程序
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

app.whenReady().then(() => {
  // 初始化数据库
  database.init()
  
  // 设置 IPC 处理程序
  setupIpcHandlers()
  
  createWindow()
})

// 应用生命周期处理
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
// src/main/index.ts
import { app, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { database } from './database'
import { setupIpcHandlers } from './ipc'

let mainWindow: BrowserWindow | null = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(__dirname, '../../dist-electron/preload/index.cjs')
    }
  })

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}
// 增加一个 IPC 处理，用于调整窗口大小
ipcMain.handle('set-window-size', async (_, width: number, height: number) => {
  if (mainWindow) {
    mainWindow.setSize(width, height)
  }
})
// 只调用一次 app.whenReady()
app.whenReady().then(() => {
  database.init()
  setupIpcHandlers()
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

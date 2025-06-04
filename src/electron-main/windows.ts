// src/electron-main/windows.ts
import { BrowserWindow } from 'electron'
import { paths } from './utils/paths'

export async function createMainWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: paths.preload
    }
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    await win.loadURL(process.env.VITE_DEV_SERVER_URL)
    win.webContents.openDevTools()
  } else {
    await win.loadFile(paths.renderer)
  }

  return win
}
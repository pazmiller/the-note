// src/main/utils/paths.ts
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// 直接使用 import.meta.url
const currentDir = dirname(fileURLToPath(import.meta.url))
const rootDir = join(currentDir, '../../../')

export const paths = {
  root: rootDir,
  preload: join(rootDir, 'preload/index.js'),
  renderer: join(rootDir, 'renderer/index.html')
}
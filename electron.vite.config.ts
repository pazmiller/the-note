// electron.vite.config.ts
import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig( {
  main: {
    plugins: [ externalizeDepsPlugin() ],
    resolve: {
      alias: {
        '@': resolve( 'src/electron-main' )
      }
    },
    build: {
      outDir: 'dist-electron/main',
      rollupOptions: {
        input: {
          index: resolve( __dirname, 'src/electron-main/index.ts' )
        },
        external: [ 'electron', 'better-sqlite3' ]
      }
    }
  },
  preload: {
    plugins: [ externalizeDepsPlugin() ],
    resolve: {
      alias: {
        '@': resolve( 'src/preload' )
      }
    },
    build: {
      outDir: 'dist-electron/preload',
      rollupOptions: {
        input: {
          index: resolve( __dirname, 'src/preload/index.ts' )
        },
        external: [ 'electron', 'better-sqlite3', 'electron-squirrel-startup' ],
        output: {
          format: 'cjs'
        }
      }
    }
  },
  renderer: {
    root: 'src/renderer',
    build: {
      outDir: 'dist-electron/renderer',
      rollupOptions: {
        input: {
          index: resolve( __dirname, 'src/renderer/index.html' )
        }
      }
    },
    resolve: {
      alias: {
        '@': resolve( 'src/renderer' )
      }
    },
    plugins: [ react() ]
  }
} )

// types.d.ts (根目录)

// 数据模型

  
  // IPC API 类型
  export interface NotesAPI {
    createNote: (title: string, content: string) => Promise<{ lastInsertRowid: number }>
    getAllNotes: () => Promise<Note[]>
    getNote: (id: number) => Promise<Note>
    updateNote: (id: number, title: string, content: string) => Promise<{ changes: number }>
    deleteNote: (id: number) => Promise<{ changes: number }>
  }
  
  // 全局窗口属性扩展
  declare global {
    interface Window {
      notesApi: NotesAPI
    }

    export interface Note {
        id: number
        title: string
        content: string
        created_at: string
        updated_at: string
      }
      export interface NotesState {
        notes: Note[]
        selectedNote: Note | null
        loading: boolean
        error: string | null
      }
  }
  
  // 工具类型
  export type AsyncReturnType<T extends (...args: any) => Promise<any>> = 
    T extends (...args: any) => Promise<infer R> ? R : any
  
  // 状态类型
  
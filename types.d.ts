export interface NotesAPI {
  // 创建笔记时，传入 title、content 以及 uid，返回创建后文档的 id
  createNote: (title: string, content: string, uid: string) => Promise<{ id: string }>
  // 根据 uid 获取当前用户的所有笔记
  getAllNotes: (uid: string) => Promise<Note[]>
  // 根据 noteId 获取单个笔记
  getNote: (id: string) => Promise<Note | null>
  // 更新笔记，返回 void
  updateNote: (id: string, title: string, content: string) => Promise<void>
  // 删除笔记，返回 void
  deleteNote: (id: string) => Promise<void>
  // 新增：调整窗口大小
  setWindowSize: (width: number, height: number) => Promise<void>
}

// 全局窗口属性扩展
declare global {
  interface Window {
    notesApi: NotesAPI;
    authUser?: FirebaseUser | null; 
  }

  export interface FirebaseUser {
    uid: string;
    email: string | null;
    displayName?: string | null;
    photoURL?: string | null;
  }
  
  export interface Note {
    id: string
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

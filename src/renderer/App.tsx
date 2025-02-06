// src/renderer/App.tsx
import { useState, useEffect } from 'react'
import RightClickMenu from './components/RightClickMenu'

export default function App() {
  const [notes, setNotes] = useState<Note[]>([])
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [theme, setTheme] = useState('light')
  const [focusMode, setFocusMode] = useState(false)
  const [rightClickMenu, setRightClickMenu] = useState<{
    visible: boolean
    x: number
    y: number
    note: Note | null
  }>({
    visible: false,
    x: 0,
    y: 0,
    note: null,
  })

  // 获取所有笔记
  const fetchNotes = async () => {
    try {
      setLoading(true)
      const allNotes = await window.notesApi.getAllNotes()
      setNotes(allNotes)
    } catch (error) {
      console.error('Failed to fetch notes:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotes()
  }, [])

  const handleNewNote = () => {
    setSelectedNote(null)
    setTitle('')
    setContent('')
  }

  const handleSaveNote = async () => {
    if (!title.trim()) return
    try {
      setLoading(true)
      if (selectedNote) {
        await window.notesApi.updateNote(selectedNote.id, title, content)
      } else {
        await window.notesApi.createNote(title, content)
      }
      await fetchNotes()
    } catch (error) {
      console.error('Failed to save note:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectNote = async (noteId: number) => {
    try {
      setLoading(true)
      const note = await window.notesApi.getNote(noteId)
      if (!note) {
        console.error(`Note with id ${noteId} not found`)
        return
      }
      setSelectedNote(note)
      setTitle(note.title)
      setContent(note.content)
    } catch (error) {
      console.error('Failed to get note:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMenu = (e: React.MouseEvent, note: Note) => {
    e.preventDefault()
    setRightClickMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      note: note,
    })
  }

  const closeRightClickMenu = () => {
    setRightClickMenu({ visible: false, x: 0, y: 0, note: null })
  }

  const handleEditNote = () => {
    if (rightClickMenu.note) {
      handleSelectNote(rightClickMenu.note.id)
    }
  }

  const handleDeleteNote = async () => {
    if (rightClickMenu.note) {
      try {
        await window.notesApi.deleteNote(rightClickMenu.note.id)
        await fetchNotes()
      } catch (error) {
        console.error('Failed to delete note:', error)
      }
    }
  }

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'))
  }

  // 当进入专注模式时，通知主进程改变窗口大小；退出时恢复原尺寸
  const enterFocusMode = async () => {
    setFocusMode(true)
    // await window.notesApi.setWindowSize(500, 250)
  }

  const exitFocusMode = async () => {
    setFocusMode(false)
    // await window.notesApi.setWindowSize(900, 670)
  }

  const handleExitFocusMode = async() =>{
    await handleSaveNote()
    await exitFocusMode()
  }

  const containerClass =
    theme === 'light'
      ? 'flex h-screen bg-gray-100 text-gray-900'
      : 'flex h-screen bg-gray-900 text-gray-100'

  const inputClass =
    theme === 'light'
      ? 'bg-gray-200 border border-gray-300'
      : 'bg-gray-800 border border-gray-700'

  // 如果处于专注模式，则(专注模式视图)
  if (focusMode) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div
          className="relative shadow-lg rounded-md"
          style={{
            width: '100vw',
            height: '100vh',
            backgroundColor: theme === 'light' ? '#fff' : '#333',
            color: theme === 'light' ? '#000' : '#fff',
          }}
        >
          <textarea
            className="w-full h-full p-2 resize-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="p-2 overflow-auto h-full w-full">
            {selectedNote ? selectedNote.content : '没有选中的笔记'}
          </div>
          <button
            className="absolute top-2 right-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded px-2 py-1"
            onClick={handleExitFocusMode}
          >
            返回
          </button>
        </div>
      </div>
    )
  }
  
  

  return (
    <div className={containerClass}>
      {/* 左侧笔记列表 */}
      <div className="w-64 border-r border-gray-700 p-4 flex flex-col relative">
        <button
          onClick={handleNewNote}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-2 px-4 mb-4"
          disabled={loading}
        >
          New Note
        </button>

        <button
          onClick={toggleTheme}
          className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg py-2 px-4 mb-4"
          disabled={loading}
        >
          {theme === 'light' ? '切换到黑夜模式' : '切换到白天模式'}
        </button>

        <div className="overflow-y-auto flex-1">
          {notes.map(note => (
            <div
              key={note.id}
              onClick={() => handleSelectNote(note.id)}
              onContextMenu={(e) => handleMenu(e, note)}
              className={`p-3 mb-2 rounded-lg cursor-pointer ${
                selectedNote?.id === note.id ? 'bg-gray-300' : 'hover:bg-gray-600'
              }`}
            >
              <h3 className="font-medium truncate">{note.title}</h3>
              <p className="text-sm text-gray-400 truncate">{note.content}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(note.updated_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>

        {/* 放在左下角的专注模式按钮 */}
        <button
          className="absolute bottom-4 left-4 bg-purple-500 hover:bg-purple-600 text-white rounded-lg py-1 px-3"
          onClick={enterFocusMode}
        >
          专注模式
        </button>
      </div>

      {/* 右侧编辑区 */}
      <div className="flex-1 p-6 flex flex-col">
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Note title"
          className={`${inputClass} rounded-lg p-3 mb-4 w-full`}
          disabled={loading}
        />

        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Write your note here..."
          className={`${inputClass} rounded-lg p-3 mb-4 flex-1 w-full resize-none`}
          disabled={loading}
        />

        <button
          onClick={handleSaveNote}
          className="bg-green-600 hover:bg-green-700 text-white rounded-lg py-2 px-4 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>

      {rightClickMenu.visible && (
        <RightClickMenu
          x={rightClickMenu.x}
          y={rightClickMenu.y}
          onClose={closeRightClickMenu}
          onEdit={handleEditNote}
          onDelete={handleDeleteNote}
        />
      )}
    </div>
  )
}

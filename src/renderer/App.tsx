// src/renderer/App.tsx

import { useState, useEffect } from 'react'

export default function App() {
  const [notes, setNotes] = useState<Note[]>([])
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [theme, setTheme] = useState('light')  // 默认白天模式

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

  // 组件加载时获取笔记
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
        // 更新现有笔记
        await window.notesApi.updateNote(selectedNote.id, title, content)
      } else {
        // 创建新笔记
        await window.notesApi.createNote(title, content)
      }
      // 重新获取所有笔记以更新列表
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
      setSelectedNote(note)
      setTitle(note.title)
      setContent(note.content)
    } catch (error) {
      console.error('Failed to get note:', error)
    } finally {
      setLoading(false)
    }
  }

  // 切换主题函数
  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'))
  }

  // 根据主题设置容器类名
  const containerClass =
    theme === 'light'
      ? 'flex h-screen bg-gray-100 text-gray-900'
      : 'flex h-screen bg-gray-900 text-gray-100'

  // 根据主题调整输入框等组件的背景色（可以根据需要进一步优化）
  const inputClass =
    theme === 'light'
      ? 'bg-gray-200 border border-gray-300'
      : 'bg-gray-800 border border-gray-700'

  return (
    <div className={containerClass}>
      {/* 左侧笔记列表 */}
      <div className="w-64 border-r border-gray-700 p-4 flex flex-col">
        <button
          onClick={handleNewNote}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-2 px-4 mb-4"
          disabled={loading}
        >
          New Note
        </button>

        {/* 主题切换按钮 */}
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
              className={`p-3 mb-2 rounded-lg cursor-pointer ${
                selectedNote?.id === note.id ? 'bg-gray-700' : 'hover:bg-gray-800'
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
    </div>
  )
}

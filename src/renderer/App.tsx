import { useState, useEffect } from 'react'
import { format } from 'date-fns'

export default function App() {
  const [notes, setNotes] = useState<Note[]>([])
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

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

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      {/* 左侧笔记列表 */}
      <div className="w-64 border-r border-gray-700 p-4 flex flex-col">
        <button
          onClick={handleNewNote}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-2 px-4 mb-4"
          disabled={loading}
        >
          New Note
        </button>
        
        <div className="overflow-y-auto flex-1">
          {notes.map(note => (
            <div
              key={note.id}
              onClick={() => handleSelectNote(note.id)}
              className={`p-3 mb-2 rounded-lg cursor-pointer ${
                selectedNote?.id === note.id 
                  ? 'bg-gray-700' 
                  : 'hover:bg-gray-800'
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
          className="bg-gray-800 border border-gray-700 rounded-lg p-3 mb-4 w-full"
          disabled={loading}
        />
        
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Write your note here..."
          className="bg-gray-800 border border-gray-700 rounded-lg p-3 mb-4 flex-1 w-full resize-none"
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
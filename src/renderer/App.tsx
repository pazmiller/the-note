// src/renderer/App.tsx
import { useState, useEffect } from 'react';
import Login from './login';
import RightClickMenu from './components/RightClickMenu';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

export default function App() {
  // 管理登录状态，初始时取 window.authUser（如果有）或 null
  const [authUser, setAuthUser] = useState<FirebaseUser | null>(window.authUser || null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState('light');
  const [focusMode, setFocusMode] = useState(false);
  const [rightClickMenu, setRightClickMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    note: Note | null;
  }>({
    visible: false,
    x: 0,
    y: 0,
    note: null,
  });

  // currentUid 从 authUser 中获取；若未登录则使用 'testUser'
  const currentUid = authUser?.uid || 'testUser';

  // 监听 Firebase Auth 状态，自动恢复登录状态
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
        window.authUser = user;
      } else {
        setAuthUser(null);
        window.authUser = undefined;
      }
    });
    return unsubscribe;
  }, []);

  // 每当登录状态变化时，拉取笔记（仅当用户登录时）
  useEffect(() => {
    if (authUser) {
      fetchNotes();
    }
  }, [authUser]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const allNotes = await window.notesApi.getAllNotes(currentUid);
      setNotes(allNotes);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewNote = () => {
    setSelectedNote(null);
    setTitle('');
    setContent('');
  };

  const handleSaveNote = async () => {
    if (!title.trim()) return;
    try {
      setLoading(true);
      if (selectedNote) {
        await window.notesApi.updateNote(selectedNote.id, title, content);
      } else {
        await window.notesApi.createNote(title, content, currentUid);
      }
      await fetchNotes();
    } catch (error) {
      console.error('Failed to save note:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectNote = async (noteId: string) => {
    try {
      setLoading(true);
      const note = await window.notesApi.getNote(noteId);
      if (!note) {
        console.error(`Note with id ${noteId} not found`);
        return;
      }
      setSelectedNote(note);
      setTitle(note.title);
      setContent(note.content);
    } catch (error) {
      console.error('Failed to get note:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMenu = (e: React.MouseEvent, note: Note) => {
    e.preventDefault();
    setRightClickMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      note: note,
    });
  };

  const closeRightClickMenu = () => {
    setRightClickMenu({ visible: false, x: 0, y: 0, note: null });
  };

  const handleEditNote = () => {
    if (rightClickMenu.note) {
      handleSelectNote(rightClickMenu.note.id);
    }
  };

  const handleDeleteNote = async () => {
    if (rightClickMenu.note) {
      try {
        await window.notesApi.deleteNote(rightClickMenu.note.id);
        await fetchNotes();
      } catch (error) {
        console.error('Failed to delete note:', error);
      }
    }
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      window.authUser = undefined;
      setAuthUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const enterFocusMode = async () => {
    setFocusMode(true);
  };

  const exitFocusMode = async () => {
    setFocusMode(false);
  };

  const handleExitFocusMode = async () => {
    await handleSaveNote();
    await exitFocusMode();
  };

  const containerClass =
    theme === 'light'
      ? 'flex h-screen bg-gray-100 text-gray-900'
      : 'flex h-screen bg-gray-900 text-gray-100';

  const inputClass =
    theme === 'light'
      ? 'bg-gray-200 border border-gray-300'
      : 'bg-gray-800 border border-gray-700';

  if (!authUser) {
    return (
      <Login onLogin={(user) => {
        window.authUser = user;
        setAuthUser(user);
      }} />
    );
  }

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
          <button
            className="absolute top-2 right-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded px-2 py-1"
            onClick={handleExitFocusMode}
          >
            返回
          </button>
        </div>
      </div>
    );
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
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white rounded-lg py-2 px-4 mb-4"
          disabled={loading}
        >
          Log Out
        </button>
        <div className="overflow-y-auto flex-1">
          {notes.map(note => (
            <div
              key={note.id}
              onClick={() => handleSelectNote(note.id)}
              onContextMenu={(e) => handleMenu(e, note)}
              className={`p-3 mb-2 rounded-lg cursor-pointer ${selectedNote?.id === note.id ? 'bg-gray-300' : 'hover:bg-gray-600'}`}
            >
              <h3 className="font-medium truncate">{note.title}</h3>
              <p className="text-sm text-gray-400 truncate">{note.content}</p>
              <p className="text-xs text-gray-500 mt-1">{new Date(note.updated_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
        {/* 左下角的专注模式按钮 */}
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
  );
}

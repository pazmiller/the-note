// src/renderer/App.tsx
import { useState, useEffect } from 'react';
import Login from './login';
import RightClickMenu from './components/RightClickMenu';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

export default function App()
{
  const [ authUser, setAuthUser ] = useState<FirebaseUser | null>( window.authUser || null );
  const [ notes, setNotes ] = useState<Note[]>( [] );
  const [ selectedNote, setSelectedNote ] = useState<Note | null>( null );
  const [ title, setTitle ] = useState( '' );
  const [ content, setContent ] = useState( '' );
  const [ loading, setLoading ] = useState( false );
  const [ theme, setTheme ] = useState( 'light' );
  const [ focusMode, setFocusMode ] = useState( false );
  const [ rightClickMenu, setRightClickMenu ] = useState<{
    visible: boolean;
    x: number;
    y: number;
    note: Note | null;
  }>( {
    visible: false,
    x: 0,
    y: 0,
    note: null,
  } );

  // 根据currentUid返回对应用户；若未登录则使用 'testUser'
  const currentUid = authUser?.uid || 'testUser';

  // 监听 Firebase Auth 状态，自动恢复登录状态
  useEffect( () =>
  {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged( auth, ( user ) =>
    {
      if ( user )
      {
        setAuthUser( user );
        window.authUser = user;
      } else
      {
        setAuthUser( null );
        window.authUser = undefined;
      }
    } );
    return unsubscribe;
  }, [] );

  // If 确认User登录信息成功, then fetchNotes
  useEffect( () =>
  {
    if ( authUser )
    {
      fetchNotes();
    }
  }, [ authUser ] );

  const fetchNotes = async () =>
  {
    try
    {
      setLoading( true );
      const allNotes = await window.notesApi.getAllNotes( currentUid );
      setNotes( allNotes );
    } catch ( error )
    {
      console.error( 'Failed to fetch notes:', error );
    } finally
    {
      setLoading( false );
    }
  };

  const handleNewNote = () =>
  {
    setSelectedNote( null );
    setTitle( '' );
    setContent( '' );
  };

  const handleSaveNote = async () =>
  {
    if ( !title.trim() ) return;
    try
    {
      setLoading( true );
      if ( selectedNote )
      {
        await window.notesApi.updateNote( selectedNote.id, title, content );
      } else
      {
        await window.notesApi.createNote( title, content, currentUid );
      }
      await fetchNotes();
    } catch ( error )
    {
      console.error( 'Failed to save note:', error );
    } finally
    {
      setLoading( false );
    }
  };

  const handleSelectNote = async ( noteId: string ) =>
  {
    try
    {
      setLoading( true );
      const note = await window.notesApi.getNote( noteId );
      if ( !note )
      {
        console.error( `Note with id ${noteId} not found` );
        return;
      }
      setSelectedNote( note );
      setTitle( note.title );
      setContent( note.content );
    } catch ( error )
    {
      console.error( 'Failed to get note:', error );
    } finally
    {
      setLoading( false );
    }
  };

  const handleMenu = ( e: React.MouseEvent, note: Note ) =>
  {
    e.preventDefault();
    setRightClickMenu( {
      visible: true,
      x: e.clientX,
      y: e.clientY,
      note: note,
    } );
  };

  const closeRightClickMenu = () =>
  {
    setRightClickMenu( { visible: false, x: 0, y: 0, note: null } );
  };

  const handleEditNote = () =>
  {
    if ( rightClickMenu.note )
    {
      handleSelectNote( rightClickMenu.note.id );
    }
  };

  const handleDeleteNote = async () =>
  {
    if ( rightClickMenu.note )
    {
      try
      {
        await window.notesApi.deleteNote( rightClickMenu.note.id );
        await fetchNotes();
      } catch ( error )
      {
        console.error( 'Failed to delete note:', error );
      }
    }
  };

  const toggleTheme = () =>
  {
    setTheme( prev => ( prev === 'light' ? 'dark' : 'light' ) );
  };

  const handleLogout = async () =>
  {
    try
    {
      const auth = getAuth();
      await signOut( auth );
      window.authUser = undefined;
      setAuthUser( null );
    } catch ( error )
    {
      console.error( 'Logout error:', error );
    }
  };

  const enterFocusMode = async () =>
  {
    setFocusMode( true );
  };

  const exitFocusMode = async () =>
  {
    setFocusMode( false );
  };

  const handleExitFocusMode = async () =>
  {
    await handleSaveNote();
    await exitFocusMode();
  };

  // const containerClass =
  //   theme === 'light'
  //     ? 'flex h-screen bg-gray-100 text-gray-900'
  //     : 'flex h-screen bg-black text-gray-100';

  // const inputClass =
  //   theme === 'light'
  //     ? 'bg-gray-200 border border-gray-300'
  //     : 'bg-black border border-gray-700';
  // 在App组件内
  useEffect( () =>
  {
    if ( theme === 'dark' )
    {
      document.documentElement.classList.add( 'dark' );
    } else
    {
      document.documentElement.classList.remove( 'dark' );
    }
  }, [ theme ] );

  // 修改容器类名
  const containerClass = "flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300";

  // 修改输入框类名
  const inputClass = "bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 transition-colors duration-300";



  if ( !authUser )
  {
    return (
      <Login onLogin={( user ) =>
      {
        window.authUser = user;
        setAuthUser( user );
      }} />
    );
  }

  if ( focusMode )
  {
    return (
      // 专注模式界面
      <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50">
        <div className="w-full max-w-4xl p-6 rounded-xl shadow-2xl relative"
          style={{
            backgroundColor: theme === 'light' ? '#f8f9fa' : '#2d3748',
            color: theme === 'light' ? '#1a202c' : '#e2e8f0',
          }}>
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="Untitled Note"
              value={title}
              onChange={( e ) => setTitle( e.target.value )}
              className="text-2xl font-bold bg-transparent border-none outline-none w-full"
            />
            <button
              className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg px-4 py-2 transition-colors flex items-center"
              onClick={handleExitFocusMode}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Exit Focus Mode
            </button>
          </div>

          <div className="h-[calc(100vh-200px)] overflow-auto rounded-lg"
            style={{
              backgroundColor: theme === 'light' ? '#ffffff' : '#1a202c',
            }}>
            <textarea
              className="w-full h-full p-6 resize-none outline-none bg-transparent leading-relaxed"
              value={content}
              onChange={( e ) => setContent( e.target.value )}
              placeholder="Write your thoughts here..."
            />
          </div>

          <div className="mt-4 flex justify-end">
            <button
              className="bg-green-500 hover:bg-green-600 text-white rounded-lg px-4 py-2 transition-colors"
              onClick={handleExitFocusMode}
            >
              Save & Exit
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex h-screen transition-colors duration-300 ${theme === 'light' ? 'bg-gray-100 text-gray-900' : 'bg-gray-900 text-gray-100'}`}>
      {/* 左侧笔记列表 */}
      <div className="w-64 border-r transition-colors duration-300 dark:border-gray-700 border-gray-200 p-4 flex flex-col relative">
        <button
          onClick={handleNewNote}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-2 px-4 mb-4 transition-colors duration-200"
          disabled={loading}
        >
          New Note
        </button>
        <button
          onClick={toggleTheme}
          className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg py-2 px-4 mb-4 transition-colors duration-200"
          disabled={loading}
        >
          {theme === 'light' ? 'Lights Off' : 'Lights On'}
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white rounded-lg py-2 px-4 mb-4 transition-colors duration-200"
          disabled={loading}
        >
          Log Out
        </button>
        <div className="overflow-y-auto flex-1">
          {notes.map( note => (
            <div
              key={note.id}
              onClick={() => handleSelectNote( note.id )}
              onContextMenu={( e ) => handleMenu( e, note )}
              className={`p-4 mb-3 rounded-xl cursor-pointer transition-all duration-200 ${selectedNote?.id === note.id
                ? `${theme === 'light' ? 'bg-blue-100' : 'bg-blue-900 bg-opacity-30'}`
                : `hover:${theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'}`
                }`}
            >
              <h3 className="font-medium truncate">{note.title}</h3>
              <p className="text-sm transition-colors duration-300 dark:text-gray-400 text-gray-600 truncate">{note.content}</p>
              <p className="text-xs transition-colors duration-300 dark:text-gray-500 text-gray-500 mt-1">{new Date( note.updated_at ).toLocaleDateString()}</p>
            </div>
          ) )}
        </div>
        {/* Button for Focus Mode */}
        <button
          className="absolute bottom-4 left-4 bg-purple-500 hover:bg-purple-600 text-white rounded-lg py-1 px-3 transition-colors duration-200"
          onClick={enterFocusMode}
        >
          Focus Zone
        </button>
      </div>
      {/* 右侧Main Section */}
      <div className="flex-1 p-6 flex flex-col">
        <input
          type="text"
          value={title}
          onChange={e => setTitle( e.target.value )}
          placeholder="Note title"
          className={`rounded-lg p-3 mb-4 w-full transition-colors duration-300 ${theme === 'light'
            ? 'bg-gray-200 border border-gray-300'
            : 'bg-gray-800 border border-gray-700'
            }`}
          disabled={loading}
        />
        <textarea
          value={content}
          onChange={e => setContent( e.target.value )}
          placeholder="Write your note here..."
          className={`rounded-lg p-3 mb-4 flex-1 w-full resize-none transition-colors duration-300 ${theme === 'light'
            ? 'bg-gray-200 border border-gray-300'
            : 'bg-gray-800 border border-gray-700'
            }`}
          disabled={loading}
        />
        <button
          onClick={handleSaveNote}
          className="bg-green-600 hover:bg-green-700 text-white rounded-lg py-2 px-4 disabled:opacity-50 transition-colors duration-200"
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

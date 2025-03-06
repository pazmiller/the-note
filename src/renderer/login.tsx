// src/renderer/login.tsx
import { useState } from 'react';

import
{
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from 'firebase/auth';
import myImage from '../assets/siam.jpg';
import { firebaseAppConfig } from '../firebaseConfig';

export default function Login( { onLogin }: { onLogin: ( user: any ) => void } )
{
  const [ email, setEmail ] = useState( '' );
  const [ password, setPassword ] = useState( '' );
  const [ rememberMe, setRememberMe ] = useState( false );
  const [ error, setError ] = useState<string | null>( null );

  const auth = getAuth( firebaseAppConfig );

  const applyPersistence = async () =>
  {
    await setPersistence( auth, rememberMe ? browserLocalPersistence : browserSessionPersistence );
  };

  const handleLogin = async () =>
  {
    setError( null );
    try
    {
      await applyPersistence();
      const userCredential = await signInWithEmailAndPassword( auth, email, password );
      onLogin( userCredential.user );
    } catch ( e: any )
    {
      console.error( "Login error:", e );
      setError( e.message );
    }
  };

  const handleRegister = async () =>
  {
    setError( null );
    try
    {
      await applyPersistence();
      const userCredential = await createUserWithEmailAndPassword( auth, email, password );
      onLogin( userCredential.user );
    } catch ( e: any )
    {
      console.error( "Register error:", e );
      setError( e.message );
    }
  };

  return (
    // 登录页面优化
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-400 flex">
      {/* 左侧：图片 */}
      <div className="w-1/2 h-screen hidden lg:block">
        <img src={myImage} alt="Local Image" className="object-cover w-full h-full" />
      </div>
      {/* 右侧：登录表单，提升质感 */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2">
        <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-2xl">
          <h2 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
            Notes
          </h2>
          <p className="text-gray-500 text-center mb-8">Welcome back! Please log in to continue</p>

          {error && <p className="mb-4 text-red-500 p-3 bg-red-50 rounded-md">{error}</p>}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail( e.target.value )}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword( e.target.value )}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>

          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe( e.target.checked )}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>

            <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500">Forgot password?</a>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-lg font-medium shadow hover:shadow-lg transition-all"
            >
              Login 登录
            </button>

            <button
              onClick={handleRegister}
              className="w-full bg-white text-indigo-600 border border-indigo-500 py-3 rounded-lg font-medium hover:bg-indigo-50 transition-all"
            >
              Register 注册
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// src/renderer/login.tsx
import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from 'firebase/auth';
import myImage from '../assets/siam.jpg';

// Firebase 配置
const firebaseConfig = {
  apiKey: "AIzaSyAqpieXYPeE4E_s7pCJItHGVdIzg13FnCI",
  authDomain: "eseential-note.firebaseapp.com",
  projectId: "eseential-note",
  storageBucket: "eseential-note.firebasestorage.app",
  messagingSenderId: "689345182013",
  appId: "1:689345182013:web:e6abde488644bf5f1dad54",
  measurementId: "G-S6RL8JSYK2"
};

// 初始化 Firebase App
initializeApp(firebaseConfig);

export default function Login({ onLogin }: { onLogin: (user: any) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const auth = getAuth();

  const applyPersistence = async () => {
    await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
  };

  const handleLogin = async () => {
    setError(null);
    try {
      await applyPersistence();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      onLogin(userCredential.user);
    } catch (e: any) {
      console.error("Login error:", e);
      setError(e.message);
    }
  };

  const handleRegister = async () => {
    setError(null);
    try {
      await applyPersistence();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      onLogin(userCredential.user);
    } catch (e: any) {
      console.error("Register error:", e);
      setError(e.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* 左侧：图片，始终占50%宽度和全屏高度 */}
      <div className="w-1/2 h-screen hidden lg:block">
        <img 
          src={myImage} 
          alt="Local Image" 
          className="object-cover w-full h-full"
        />
      </div>
      {/* 右侧：登录表单，同样占50%宽度和全屏高度 */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2">
       <div className="w-full max-w-md p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Login 登录 / Register 注册</h2>
          {error && <p className="mb-4 text-red-500">{error}</p>}
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-6 flex items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="mr-2"
              />
              <span>Remember me</span>
            </label>
          </div>
          <div className="flex justify-between">
            <button 
              onClick={handleLogin} 
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Login 登录
            </button>
            <button 
              onClick={handleRegister} 
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Register 注册
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

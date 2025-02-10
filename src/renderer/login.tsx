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

// 如果没有集中初始化 Firebase，你可以在这里初始化
const firebaseConfig = {
  apiKey: "AIzaSyAqpieXYPeE4E_s7pCJItHGVdIzg13FnCI",
  authDomain: "eseential-note.firebaseapp.com",
  projectId: "eseential-note",
  storageBucket: "eseential-note.firebasestorage.app",
  messagingSenderId: "689345182013",
  appId: "1:689345182013:web:e6abde488644bf5f1dad54",
  measurementId: "G-S6RL8JSYK2"
};

initializeApp(firebaseConfig);

export default function Login({ onLogin }: { onLogin: (user: any) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  const auth = getAuth();

  // 设置持久化策略：如果勾选“记住我”使用 localPersistence，否则使用 sessionPersistence
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
      await applyPersistence();  // 加上持久化策略
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      onLogin(userCredential.user);
    } catch (e: any) {
      console.error("Register error:", e);
      setError(e.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
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
  );
}

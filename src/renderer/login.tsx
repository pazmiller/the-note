// src/renderer/login.tsx
import { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

// 导入你的 Firebase 配置（可以放在一个单独的文件里，比如 firebaseConfig.ts）
const firebaseConfig = {
  apiKey: "AIzaSyAqpieXYPeE4E_s7pCJItHGVdIzg13FnCI",
  authDomain: "eseential-note.firebaseapp.com",
  projectId: "eseential-note",
  storageBucket: "eseential-note.firebasestorage.app",
  messagingSenderId: "689345182013",
  appId: "1:689345182013:web:e6abde488644bf5f1dad54",
  measurementId: "G-S6RL8JSYK2"
};

// 初始化 Firebase App（注意如果你在其他地方已经初始化过了，就不要重复调用）
initializeApp(firebaseConfig);

export default function Login({ onLogin }: { onLogin: (user: any) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  // 现在调用 getAuth() 时会使用已初始化的默认 app
  const auth = getAuth();

  const handleLogin = async () => {
    setError(null);
    try {
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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      onLogin(userCredential.user);
    } catch (e: any) {
      console.error("Register error:", e);
      setError(e.message);
    }
  };

  return (
    <div>
      <h2>Login 登录 / Register 注册</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <div>
        <button onClick={handleLogin}>Login 登录</button>
        <button onClick={handleRegister}>Register 注册</button>
      </div>
    </div>
  );
}

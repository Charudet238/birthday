'use client';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function AuthPage() {
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-blue-50 p-6 text-center">
      <h1 className="text-2xl font-bold mb-6">เข้าสู่ระบบเพื่อสร้างการ์ดคำอวยพร</h1>
      <button
        onClick={handleLogin}
        className="bg-blue-600 text-white px-6 py-2 rounded shadow"
      >
        ลงชื่อเข้าใช้ด้วย Google
      </button>
    </main>
  );
}

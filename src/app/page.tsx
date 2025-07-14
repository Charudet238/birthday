'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function HomePage() {
  const [recipient, setRecipient] = useState('');
  const router = useRouter();

  function handleNext() {
    if (recipient.trim()) {
      router.push(`/card/${encodeURIComponent(recipient)}`);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-pink-100 text-center p-4">
      <h1 className="text-3xl font-bold mb-4">🎂 สุขสันต์วันเกิด!</h1>
      <p className="mb-6 text-lg">กรุณาใส่ชื่อผู้รับคำอวยพร</p>
      <input
        type="text"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        placeholder="ชื่อผู้รับ"
        className="border p-2 rounded w-full max-w-sm mb-4"
      />
      <button
        onClick={handleNext}
        className="bg-pink-500 text-white px-6 py-2 rounded shadow"
      >
        ดูการ์ดคำอวยพร
      </button>
    </main>
  );
}

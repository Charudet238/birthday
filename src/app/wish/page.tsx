"use client";

import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import type { User } from "firebase/auth";

export default function WishPage() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      if (!u) router.push("/");
      else setUser(u);
    });
    return () => unsub();
  }, [router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name || !message || !user) return;
    setLoading(true);

    await addDoc(collection(db, "wishes"), {
      uid: user.uid,
      name,
      message,
      createdAt: Timestamp.now(),
    });

    router.push("/wishes");
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-yellow-100 p-6">
      <h1 className="text-2xl font-bold mb-4">✍️ เขียนคำอวยพร</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
        <input
          type="text"
          placeholder="ชื่อคุณ"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded"
        />
        <textarea
          placeholder="คำอวยพร"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          className="border p-2 rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-yellow-500 text-white px-4 py-2 rounded shadow"
        >
          {loading ? "กำลังส่ง..." : "ส่งคำอวยพร"}
        </button>
      </form>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useRouter } from "next/navigation";
// import type { User } from "firebase/auth";

export default function WishesPage() {
  const [wishes, setWishes] = useState<{ name: string; message: string }[]>([]);
  // const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (u) => {
      if (!u) {
        router.push("/");
      } else {
        // setUser(u);
        const q = query(collection(db, "wishes"), where("uid", "==", u.uid));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(
          (doc) => doc.data() as { name: string; message: string }
        );
        setWishes(data);
      }
    });

    return () => unsub();
  }, [router]);

  return (
    <main className="min-h-screen bg-blue-50 p-6">
      <h1 className="text-2xl font-bold text-center mb-6">🎁 คำอวยพรของฉัน</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {wishes.map((wish, index) => (
          <div key={index} className="bg-white p-4 rounded shadow">
            <p className="font-bold text-lg">จาก: {wish.name}</p>
            <p className="mt-2 whitespace-pre-line">{wish.message}</p>
          </div>
        ))}
      </div>
    </main>
  );
}

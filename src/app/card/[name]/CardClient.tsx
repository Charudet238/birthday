"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import balloon from "@/assets/pixel-balloon.png";
import heart from "@/assets/pixel-heart.png";

type RiseConfig = {
  left: string; // ตำแหน่งซ้ายเป็น %
  duration: number; // วินาทีที่ลอยขึ้น
  delay: number; // หน่วงเวลาเริ่ม (วินาที)
};

export default function EnvelopeCard({ name }: { name: string }) {
  const [started, setStarted] = useState(false);
  const [open, setOpen] = useState(false);
  const [candleLit, setCandleLit] = useState(true);

  const [balloons, setBalloons] = useState<RiseConfig[]>([]);
  const [hearts, setHearts] = useState<RiseConfig[]>([]);

  const audioRef = useRef<HTMLAudioElement>(null);
  const bgAudioRef = useRef<HTMLAudioElement>(null);

  // สุ่ม config สำหรับลูกโป่ง
  useEffect(() => {
    const count = 12,
      minDist = 8;
    const arr: RiseConfig[] = [];
    let attempts = 0;
    while (arr.length < count && attempts < count * 30) {
      attempts++;
      const leftVal = Math.random() * 80 + 10;
      if (arr.every((c) => Math.abs(parseFloat(c.left) - leftVal) >= minDist)) {
        arr.push({
          left: `${leftVal.toFixed(1)}%`,
          duration: Math.random() * 4 + 6,
          delay: Math.random() * 3,
        });
      }
    }
    setBalloons(arr);
  }, []);

  // สุ่ม config สำหรับหัวใจ
  useEffect(() => {
    const count = 8,
      minDist = 10;
    const arr: RiseConfig[] = [];
    let attempts = 0;
    while (arr.length < count && attempts < count * 30) {
      attempts++;
      const leftVal = Math.random() * 80 + 10;
      if (arr.every((c) => Math.abs(parseFloat(c.left) - leftVal) >= minDist)) {
        arr.push({
          left: `${leftVal.toFixed(1)}%`,
          duration: Math.random() * 4 + 6,
          delay: Math.random() * 3,
        });
      }
    }
    setHearts(arr);
  }, []);

  const message = [
    `สุขสันต์วันเกิดนะ ${name}! 🎂`,
    `ขอให้ปีนี้เป็นปีที่ดีของ ${name} นะครับ เต็มไปด้วยรอยยิ้ม เรื่องดี ๆ และกำลังใจจากคนรอบข้าง :)`,
  ];

  const handleBlowCandle = () => {
    setCandleLit(false);
    const bg = bgAudioRef.current;
    if (bg) {
      bg.volume = 0;
      const fadeIn = () => {
        bg.play().then(() => {
          let v = 0;
          const iv = setInterval(() => {
            v += 0.03;
            bg.volume = Math.min(v, 0.3);
            if (v >= 0.3) clearInterval(iv);
          }, 150);
        });
      };
      if (bg.readyState >= 3) fadeIn();
      else bg.addEventListener("canplaythrough", fadeIn, { once: true });
    }
    setTimeout(() => setStarted(true), 1500);
  };

  // Cleanup เมื่อ unmount
  useEffect(() => {
    // จับค่า ref ปัจจุบันไว้ในตัวแปร
    const audioEl = bgAudioRef.current;
    return () => {
      if (audioEl) {
        audioEl.pause();
        audioEl.currentTime = 0;
      }
    };
  }, []);

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-yellow-50 to-pink-100 p-4 overflow-hidden font-sans">
      {/* เสียง */}
      <audio ref={audioRef} src="/open-sound.mp3" preload="auto" />
      <audio ref={bgAudioRef} src="/background-music.mp3" preload="auto" loop />

      {!started ? (
        // หน้าจอเป่าเทียน
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          <div
            className="relative w-32 h-32 bg-pink-300 rounded-md shadow-lg cursor-pointer"
            onClick={handleBlowCandle}
          >
            <div className="absolute top-[-20px] left-1/2 -translate-x-1/2 w-2 h-8 bg-yellow-600 rounded-sm">
              {candleLit && (
                <div className="w-3 h-3 bg-yellow-400 rounded-full mx-auto mt-[-10px] animate-pulse" />
              )}
            </div>
            <div className="absolute bottom-2 w-full text-center font-bold text-white text-lg">
              🎂 HBD
            </div>
          </div>
          <p className="mt-4 text-gray-700 font-medium">
            คลิกที่เค้กเพื่อเป่าเทียน
          </p>
        </motion.div>
      ) : (
        <>
          {/* ลูกโป่ง */}
          {balloons.map(({ left, duration, delay }, i) => (
            <Image
              key={`b${i}`}
              src={balloon}
              alt="balloon"
              width={100}
              height={100}
              style={{
                position: "absolute",
                bottom: "-60px",
                left,
                animationName: "rise",
                animationDuration: `${duration}s`,
                animationTimingFunction: "ease-out",
                animationFillMode: "forwards",
                animationDelay: `${delay}s`,
              }}
              unoptimized={false} // ให้ Next.js ปรับขนาด/แปลงภาพอัตโนมัติ
              priority={true} // ให้โหลดทันที ไม่รอ lazy
            />
          ))}

          {/* หัวใจ */}
          {hearts.map(({ left, duration, delay }, i) => (
            <Image
              key={`h${i}`}
              src={heart}
              alt="heart"
              width={100}
              height={100}
              style={{
                position: "absolute",
                bottom: "-60px",
                left,
                animationName: "rise",
                animationDuration: `${duration}s`,
                animationTimingFunction: "ease-out",
                animationFillMode: "forwards",
                animationDelay: `${delay}s`,
              }}
              unoptimized={false}
              priority={true}
            />
          ))}

          {/* Confetti */}
          <div className="confetti" style={{ top: "5%", left: "30%" }} />
          <div className="confetti" style={{ top: "20%", left: "40%" }} />
          <div className="confetti" style={{ top: "45%", left: "80%" }} />

          {/* ซองจดหมาย */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg aspect-[4/3]"
          >
            {/* หลังซอง */}
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="absolute inset-0 bg-red-300 rounded-md shadow-xl z-0"
            />

            {/* ฝาซอง */}
            <motion.div
              layout
              onClick={() => setOpen((o) => !o)}
              initial={{ rotate: 0 }}
              animate={open ? { rotate: [0, -2, 2, -1, 1, 0] } : { rotate: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[90%] sm:w-11/12 h-[60%] bg-white rounded-md p-4 z-10 cursor-pointer shadow-md"
              style={{ y: open ? -160 : 0 }}
            >
              <AnimatePresence>
                {open && (
                  <motion.ul
                    key="msg"
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={{
                      hidden: {},
                      visible: { transition: { staggerChildren: 0.2 } },
                    }}
                    className="space-y-2 text-gray-700 text-sm sm:text-base"
                  >
                    {message.map((m, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        transition={{ duration: 0.4 }}
                      >
                        {m}
                      </motion.li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </>
      )}

      {/* keyframes */}
      <style jsx global>{`
        @keyframes rise {
          0% {
            transform: translateY(0) scale(0.5);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: translateY(-120vh) scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

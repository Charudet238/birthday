"use client";

import { useState, useRef, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import balloon from "@/assets/pixel-balloon.png";
import heart from "@/assets/pixel-heart.png";

type RiseConfig = {
  left: string;
  duration: number;
  delay: number;
};

// Variants สำหรับซอง (ฝา+ตัวจดหมาย)
const flapVariants: Variants = {
  closed: {
    rotateX: 0,
    transition: { duration: 0.5, ease: "easeInOut" },
  },
  open: {
    rotateX: -180,
    transition: { duration: 0.8, ease: "easeInOut" },
  },
};

// const letterVariants: Variants = {
//   hidden: { y: 0, opacity: 0 },
//   visible: {
//     y: -120,
//     opacity: 1,
//     transition: {
//       type: "spring",
//       stiffness: 200,
//       damping: 20,
//     },
//   },
// };

const swingVariants: Variants = {
  closed: {
    // ลูป keyframes แกว่งซ้าย‑ขวา + ขึ้น‑ลง
    rotateZ: [0, -4, 4, 0],
    x: [0, -2, 2, 0],
    y: [0, -1, 1, 0],
    transition: {
      duration: 1, // ยาวหน่อย ให้การแกว่งดูนุ่มนวล
      ease: "easeInOut",
      repeat: Infinity, // วนไม่รู้จบ
      repeatDelay: 0.2,
    },
  },
  open: {
    // พอเปิด ก็คืนสู่ตำแหน่งนิ่งตรงกลาง
    rotateZ: 0,
    x: 0,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
};

export default function EnvelopeCard({ name }: { name: string }) {
  const [started, setStarted] = useState(false);
  const [open, setOpen] = useState(false);
  const [candleLit, setCandleLit] = useState(true);
  const [balloons, setBalloons] = useState<RiseConfig[]>([]);
  const [hearts, setHearts] = useState<RiseConfig[]>([]);

  const audioRef = useRef<HTMLAudioElement>(null);
  const bgAudioRef = useRef<HTMLAudioElement>(null);

  // สุ่มลูกโป่ง
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

  // สุ่มหัวใจ
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
    `ขอให้ปีนี้เป็นปีที่ดีเติมเต็มด้วยรอยยิ้มและกำลังใจ มีสุขภาพแข็งแรง ห่างไกลโรคภัย พร้อมพลังใจที่แข็งแกร่งทุกวัน ขอให้ความฝันและเป้าหมายสมหวัง ทุกก้าวเดินเต็มไปด้วยโอกาสใหม่ ๆ พบเจอแต่คนดี ๆ และมิตรภาพอบอุ่นรอบตัว และสุดท้ายนี้ขอให้ชีวิต ${name} สนุกสนาน สดใส และเปี่ยมด้วยความสุขไม่รู้จบ :)`,
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

  // Cleanup audio
  useEffect(() => {
    const bg = bgAudioRef.current;
    return () => {
      if (bg) {
        bg.pause();
        bg.currentTime = 0;
      }
    };
  }, []);

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-yellow-50 to-pink-100 p-4 overflow-hidden font-sans">
      <audio ref={audioRef} src="/open-sound.mp3" preload="auto" />
      <audio ref={bgAudioRef} src="/background-music.mp3" preload="auto" loop />

      {!started ? (
        // หน้าเป่าเทียน
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
                animationFillMode: "both",
                animationDelay: `${delay}s`,
              }}
              unoptimized
              priority
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
                animationFillMode: "both",
                animationDelay: `${delay}s`,
              }}
              unoptimized
              priority
            />
          ))}

          {/* Confetti */}
          <div className="confetti" style={{ top: "5%", left: "30%" }} />
          <div className="confetti" style={{ top: "20%", left: "40%" }} />
          <div className="confetti" style={{ top: "45%", left: "80%" }} />

          {/* ซองจดหมาย */}
          <motion.div
            className="relative w-full max-w-xs aspect-[4/3]"
            style={{ perspective: 800, transformOrigin: "top center" }}
            variants={swingVariants}
            initial="closed"
            animate={open ? "open" : "closed"}
          >
            {/* หลังซอง */}
            <div className="absolute inset-0 bg-red-300 rounded-md shadow-xl" />

            {/* ตัวจดหมายแผ่นขาว */}
            <motion.div
              className="absolute inset-x-[5%] bg-white rounded-md shadow-lg z-10 p-4 cursor-pointer overflow-hidden relative"
              initial={{ height: 0, opacity: 0 }}
              animate={
                open
                  ? { height: "auto", opacity: 1 }
                  : { height: 0, opacity: 0 }
              }
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              onClick={() => setOpen(false)}
            >
              <ul className="space-y-2 text-gray-700 text-sm sm:text-base">
                {message.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
              <p className="absolute bottom-2 right-2 text-xs text-gray-500">
                จาก : D
              </p>
            </motion.div>

            {/* ฝาซอง */}
            <motion.div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[90%] h-[60%] bg-white rounded-md shadow-md z-20 flex items-center justify-center cursor-pointer"
              style={{
                transformStyle: "preserve-3d",
                transformOrigin: "top center",
                backfaceVisibility: "hidden",
              }}
              variants={flapVariants}
              initial="closed"
              animate={open ? "open" : "closed"}
              onClick={() => setOpen(!open)} // กดที่ฝาซองเพื่อเปิด/ปิด
            >
              {!open && (
                <p className="text-gray-700 text-sm">
                  กดที่จดหมายเพื่ออ่านครับ
                </p>
              )}
            </motion.div>
          </motion.div>
        </>
      )}

      {/* keyframes ลูกโป่ง/หัวใจ */}
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

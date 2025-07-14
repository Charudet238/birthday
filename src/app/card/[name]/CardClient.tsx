"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function EnvelopeCard({ name }: { name: string }) {
  const [started, setStarted] = useState(false);
  const [open, setOpen] = useState(false);
  const [candleLit, setCandleLit] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const bgAudioRef = useRef<HTMLAudioElement>(null);

  const message = [
    `สุขสันต์วันเกิดนะ ${name}! 🎂`,
    `ขอให้ปีนี้เป็นปีที่ดีของ ${name} นะครับ เต็มไปด้วยรอยยิ้ม เรื่องดี ๆ และกำลังใจจากคนรอบข้าง :)`,
  ];

  const handleToggle = () => {
    setOpen((prev) => {
      const newState = !prev;
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
      return newState;
    });
  };

  const handleBlowCandle = () => {
    setCandleLit(false);

    const bgAudio = bgAudioRef.current;
    if (bgAudio) {
      bgAudio.volume = 0;

      const playWithFadeIn = () => {
        bgAudio
          .play()
          .then(() => {
            console.log("✅ bg music started");
            let vol = 0;
            const interval = setInterval(() => {
              vol += 0.03;
              bgAudio.volume = Math.min(vol, 0.3);
              if (vol >= 0.3) clearInterval(interval);
            }, 150);
          })
          .catch((e) => {
            console.warn("🔇 bg music blocked:", e.message);
          });
      };

      if (bgAudio.readyState >= 3) {
        playWithFadeIn();
      } else {
        bgAudio.addEventListener("canplaythrough", playWithFadeIn, {
          once: true,
        });
      }
    }

    setTimeout(() => {
      setStarted(true);
    }, 1500);
  };

  // หยุดเพลงเมื่อออกจาก component
  useEffect(() => {
    return () => {
      const bgAudio = bgAudioRef.current;
      if (bgAudio) {
        bgAudio.pause();
        bgAudio.currentTime = 0;
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-pink-100 p-4 overflow-hidden font-sans">
      {/* ✅ เสียงอยู่ด้านนอก */}
      <audio ref={audioRef} src="/open-sound.mp3" preload="auto" />
      <audio ref={bgAudioRef} src="/background-music.mp3" preload="auto" loop />

      {!started && (
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
            {/* Candle */}
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
      )}

      {started && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg aspect-[4/3]"
        >
          {/* Envelope Base */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="absolute inset-0 bg-red-300 rounded-md shadow-xl z-0"
          />

          {/* Paper */}
          <motion.div
            layout
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[90%] sm:w-11/12 h-[60%] bg-white rounded-md p-4 z-10 cursor-pointer shadow-md"
            style={{ y: open ? -160 : 0 }}
            onClick={handleToggle}
            whileHover={{ scale: 1.02 }}
            animate={open ? { rotate: [0, -2, 2, -1, 1, 0] } : { rotate: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <AnimatePresence>
              {open && (
                <motion.ul
                  key="message"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={{
                    hidden: {},
                    visible: {
                      transition: { staggerChildren: 0.2 },
                    },
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

          {/* Flap */}
          <motion.div
            initial={{ rotateX: 90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="absolute bottom-0 left-0 w-full h-[50%] bg-red-400 rounded-t-full z-20"
            style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
          />
        </motion.div>
      )}
    </div>
  );
}

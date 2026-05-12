import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function useScrollDirection() {
  const [visible, setVisible] = useState(true);
  const [atTop, setAtTop]     = useState(true);
  const lastY   = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const THRESHOLD = 8;
    function onScroll() {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const y   = window.scrollY;
        const top = y < 24;
        setAtTop(top);
        if (!top) {
          const delta = y - lastY.current;
          if (Math.abs(delta) > THRESHOLD) setVisible(delta < 0);
        } else {
          setVisible(true);
        }
        lastY.current   = y;
        ticking.current = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return { visible, atTop };
}

function KyzenLogo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 select-none shrink-0 px-2">
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
        style={{
          background: "#ffffff",
          boxShadow: "0 0 12px rgba(255,255,255,0.25)",
        }}
      >
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
          <path d="M3 2v10M3 7l5-5M3 7l5 5" stroke="black" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <span
        style={{
          fontFamily: "'Barlow', sans-serif",
          fontSize: 15,
          fontWeight: 600,
          color: "rgba(255,255,255,0.9)",
          letterSpacing: "-0.01em",
        }}
      >
        Kyzen
      </span>
    </Link>
  );
}

function CTAButton() {
  return (
    <Link to="/signup" className="shrink-0">
      <motion.button
        whileHover={{ scale: 1.03, boxShadow: "0 0 26px rgba(255,255,255,0.25), 0 2px 14px rgba(0,0,0,0.5)" }}
        whileTap={{ scale: 0.97 }}
        className="relative overflow-hidden flex items-center gap-1.5 rounded-full cursor-pointer select-none"
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13.5,
          fontWeight: 600,
          letterSpacing: "0.01em",
          paddingLeft: 18,
          paddingRight: 18,
          paddingTop: 8,
          paddingBottom: 8,
          background: "#ffffff",
          color: "#000000",
          boxShadow: "0 0 16px rgba(255,255,255,0.14), 0 2px 8px rgba(0,0,0,0.4)",
          border: "1px solid rgba(255,255,255,0.85)",
        }}
      >
        <span
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.18) 50%, transparent 65%)",
            backgroundSize: "300% 100%",
            animation: "nav-shimmer 3s ease-in-out infinite 2s",
          }}
        />
        Start Free
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" style={{ opacity: 0.6 }}>
          <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="black" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.button>
    </Link>
  );
}

export default function Navbar() {
  const { visible, atTop } = useScrollDirection();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes nav-shimmer {
          0%   { background-position: 200% 0 }
          100% { background-position: -100% 0 }
        }
      `}</style>

      <motion.div
        className="fixed inset-x-0 top-0 z-[100] flex justify-center pointer-events-none"
        style={{ paddingTop: 20, paddingLeft: 24, paddingRight: 24 }}
        animate={{ y: visible ? 0 : -80, opacity: visible ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.6 }}
      >
        <motion.nav
          className="pointer-events-auto flex items-center justify-between"
          animate={{
            background: atTop
              ? "rgba(8,8,8,0.45)"
              : "rgba(8,8,8,0.82)",
            boxShadow: atTop
              ? "0 1px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)"
              : "0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.10), inset 0 1px 0 rgba(255,255,255,0.07)",
            borderColor: atTop
              ? "rgba(255,255,255,0.08)"
              : "rgba(255,255,255,0.14)",
          }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: "min(100%, 1200px)",
            borderRadius: 9999,
            border: "1px solid",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            paddingLeft: 18,
            paddingRight: 7,
            paddingTop: 7,
            paddingBottom: 7,
            gap: 80,
          }}
        >
          <KyzenLogo />
          <CTAButton />
        </motion.nav>
      </motion.div>
    </>
  );
}
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function useScrollDirection() {
  const [visible, setVisible] = useState(true);
  const [atTop, setAtTop] = useState(true);
  const lastY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const THRESHOLD = 8;
    function onScroll() {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const top = y < 24;
        setAtTop(top);
        if (!top) {
          const delta = y - lastY.current;
          if (Math.abs(delta) > THRESHOLD) setVisible(delta < 0);
        } else {
          setVisible(true);
        }
        lastY.current = y;
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
      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-landing-white shadow-[0_0_12px_rgba(255,255,255,0.25)]">
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
          <path
            d="M3 2v10M3 7l5-5M3 7l5 5"
            stroke="black"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span className="font-landing-logo text-[15px] font-semibold text-[rgba(255,255,255,0.9)] tracking-[-0.01em]">
        Kyzen
      </span>
    </Link>
  );
}

function CTAButton() {
  return (
    <Link to="/signup" className="shrink-0">
      <motion.button
        whileHover={{
          scale: 1.03,
          boxShadow: "0 0 26px rgba(255,255,255,0.25), 0 2px 14px rgba(0,0,0,0.5)",
        }}
        whileTap={{ scale: 0.97 }}
        className="relative overflow-hidden flex items-center gap-1.5 rounded-full cursor-pointer select-none font-landing-body text-[13.5px] font-semibold tracking-[0.01em] pl-[18px] pr-[18px] py-2 bg-landing-white text-black shadow-[0_0_16px_rgba(255,255,255,0.14),0_2px_8px_rgba(0,0,0,0.4)] border border-[rgba(255,255,255,0.85)]"
      >
        <span className="absolute inset-0 rounded-full pointer-events-none bg-landing-nav-shimmer nav-shimmer" />
        Start Free
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" className="opacity-60">
          <path
            d="M2.5 6h7M6.5 3l3 3-3 3"
            stroke="black"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.button>
    </Link>
  );
}

export default function Navbar() {
  const { visible, atTop } = useScrollDirection();

  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-[100] flex justify-center pointer-events-none pt-5 px-6"
      animate={{ y: visible ? 0 : -80, opacity: visible ? 1 : 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.6 }}
    >
      <nav
        className={[
          "pointer-events-auto flex items-center justify-between w-full max-w-[1200px] rounded-full border backdrop-blur-[20px] pl-[18px] pr-[7px] py-[7px] gap-20 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          atTop
            ? "bg-landing-nav-bg-top border-landing-nav-border-top shadow-landing-nav-top"
            : "bg-landing-nav-bg-scrolled border-landing-nav-border-scrolled shadow-landing-nav-scrolled",
        ].join(" ")}
      >
        <KyzenLogo />
        <CTAButton />
      </nav>
    </motion.div>
  );
}

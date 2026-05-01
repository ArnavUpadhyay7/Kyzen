import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Quest { title: string; xp: number; done: boolean; tag: string }

// ─── Data ─────────────────────────────────────────────────────────────────────
const QUESTS: Quest[] = [
  { title: "Ship feature branch before 18:00", xp: 450, done: true,  tag: "DEV"   },
  { title: "30-min deep work session",         xp: 200, done: true,  tag: "FOCUS" },
  { title: "Solve 2 LeetCode mediums",         xp: 300, done: false, tag: "DSA"   },
  { title: "Push daily commit streak",         xp: 150, done: false, tag: "HABIT" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 22 },
  animate:    { opacity: 1, y: 0  },
  transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const },
});

// ─── Live XP ticker ───────────────────────────────────────────────────────────
const XpTicker = () => {
  const [val, setVal] = useState(3240);
  useEffect(() => {
    const id = setInterval(() => setVal(v => v + Math.floor(Math.random() * 7 + 1)), 2600);
    return () => clearInterval(id);
  }, []);
  return (
    <AnimatePresence mode="popLayout">
      <motion.span key={val}
        initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 10, opacity: 0 }}
        transition={{ duration: 0.22 }} className="tabular-nums inline-block">
        +{val.toLocaleString()}
      </motion.span>
    </AnimatePresence>
  );
};

// ─── The Orb — layered CSS black-hole / energy mass ──────────────────────────
const Orb = () => (
  <div className="absolute inset-x-0 flex justify-center pointer-events-none select-none"
    style={{ top: "120px", zIndex: 1 }}>

    {/* === Outermost atmospheric haze === */}
    <div className="absolute rounded-full"
      style={{
        width: 900, height: 900,
        top: "50%", left: "50%",
        transform: "translate(-50%, -38%)",
        background: "radial-gradient(ellipse at 50% 50%, rgba(109,40,217,0.18) 0%, rgba(76,29,149,0.06) 45%, transparent 70%)",
        filter: "blur(60px)",
      }} />

    {/* === Wide purple disk sweep — the accretion field === */}
    <div className="absolute"
      style={{
        width: 820, height: 260,
        top: "50%", left: "50%",
        transform: "translate(-50%, 10%)",
        borderRadius: "50%",
        background: "radial-gradient(ellipse at 50% 40%, rgba(139,92,246,0.55) 0%, rgba(109,40,217,0.3) 35%, rgba(76,29,149,0.08) 65%, transparent 80%)",
        filter: "blur(28px)",
      }} />

    {/* === Secondary disk — tighter, brighter === */}
    <div className="absolute"
      style={{
        width: 560, height: 120,
        top: "50%", left: "50%",
        transform: "translate(-50%, 38%)",
        borderRadius: "50%",
        background: "radial-gradient(ellipse at 50% 50%, rgba(192,132,252,0.7) 0%, rgba(139,92,246,0.45) 40%, rgba(109,40,217,0.1) 70%, transparent 85%)",
        filter: "blur(12px)",
      }} />

    {/* === Photon ring — bright horizontal arc === */}
    <div className="absolute"
      style={{
        width: 380, height: 60,
        top: "50%", left: "50%",
        transform: "translate(-50%, 52%)",
        borderRadius: "50%",
        background: "radial-gradient(ellipse at 50% 50%, rgba(245,243,255,0.0) 0%, rgba(216,180,254,0.95) 40%, rgba(167,139,250,0.7) 60%, transparent 80%)",
        filter: "blur(3px)",
      }} />

    {/* === Ultra-bright core ring line === */}
    <div className="absolute"
      style={{
        width: 320, height: 44,
        top: "50%", left: "50%",
        transform: "translate(-50%, 64%)",
        borderRadius: "50%",
        border: "2px solid rgba(245,243,255,0.7)",
        boxShadow: "0 0 18px 4px rgba(192,132,252,0.8), 0 0 60px 12px rgba(139,92,246,0.4), inset 0 0 20px rgba(216,180,254,0.15)",
        filter: "blur(0.5px)",
      }} />

    {/* === Second ring — softer, wider === */}
    <div className="absolute"
      style={{
        width: 430, height: 60,
        top: "50%", left: "50%",
        transform: "translate(-50%, 50%)",
        borderRadius: "50%",
        border: "1px solid rgba(167,139,250,0.35)",
        boxShadow: "0 0 24px 4px rgba(139,92,246,0.25)",
        filter: "blur(1px)",
      }} />

    {/* === Disk floor glow — pools beneath === */}
    <div className="absolute"
      style={{
        width: 680, height: 200,
        top: "50%", left: "50%",
        transform: "translate(-50%, 55%)",
        borderRadius: "50%",
        background: "radial-gradient(ellipse at 50% 0%, rgba(109,40,217,0.45) 0%, rgba(76,29,149,0.2) 45%, transparent 70%)",
        filter: "blur(24px)",
      }} />

    {/* === The void — black sphere === */}
    <div className="absolute rounded-full"
      style={{
        width: 220, height: 220,
        top: "50%", left: "50%",
        transform: "translate(-50%, 0%)",
        background: "radial-gradient(circle at 40% 38%, #0a0518 0%, #03010a 55%, #000005 100%)",
        boxShadow: "0 0 0 1px rgba(109,40,217,0.15), 0 0 40px 8px rgba(0,0,5,0.9), inset 0 0 30px rgba(0,0,10,1)",
      }} />

    {/* === Void inner rim glow === */}
    <div className="absolute rounded-full"
      style={{
        width: 220, height: 220,
        top: "50%", left: "50%",
        transform: "translate(-50%, 0%)",
        border: "1px solid rgba(139,92,246,0.18)",
        boxShadow: "0 0 20px 2px rgba(109,40,217,0.12)",
      }} />

    {/* === Upper lensing arc — light bending over the top === */}
    <div className="absolute overflow-hidden"
      style={{
        width: 280, height: 140,
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
      }}>
      <div style={{
        width: 280, height: 280,
        borderRadius: "50%",
        border: "1.5px solid rgba(167,139,250,0.22)",
        boxShadow: "0 0 12px rgba(139,92,246,0.18)",
        position: "absolute", top: 0, left: 0,
      }} />
    </div>

    {/* === Horizontal lens flare streak === */}
    <div className="absolute"
      style={{
        width: 700, height: 2,
        top: "50%", left: "50%",
        transform: "translate(-50%, 680%)",
        background: "linear-gradient(90deg, transparent 0%, rgba(139,92,246,0.0) 15%, rgba(167,139,250,0.6) 38%, rgba(245,243,255,0.9) 50%, rgba(167,139,250,0.6) 62%, rgba(139,92,246,0.0) 85%, transparent 100%)",
        filter: "blur(0.8px)",
      }} />

    {/* === Soft bloom above headline area === */}
    <div className="absolute"
      style={{
        width: 600, height: 300,
        top: "50%", left: "50%",
        transform: "translate(-50%, -90%)",
        background: "radial-gradient(ellipse at 50% 80%, rgba(109,40,217,0.12) 0%, transparent 65%)",
        filter: "blur(40px)",
      }} />
  </div>
);

// ─── Dashboard preview ────────────────────────────────────────────────────────
const Dashboard = () => {
  const [xpWidth, setXpWidth] = useState(79);
  useEffect(() => {
    const id = setInterval(() => setXpWidth(v => Math.min(v + 0.1, 100)), 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative w-full rounded-xl overflow-hidden"
      style={{
        background: "rgba(8,4,20,0.92)",
        border: "1px solid rgba(255,255,255,0.09)",
        boxShadow: "0 0 0 1px rgba(139,92,246,0.07), 0 32px 80px rgba(0,0,0,0.7), 0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
        backdropFilter: "blur(20px)",
      }}>

      {/* Chrome bar */}
      <div className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.06]"
        style={{ background: "rgba(5,2,14,0.8)" }}>
        {["#3a3a3a","#484848","#565656"].map(c => (
          <div key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />
        ))}
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-2 px-3 py-1 rounded-md text-[10px] font-mono"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", color: "#4B5563" }}>
            <motion.div className="w-1.5 h-1.5 rounded-full bg-emerald-500"
              animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} />
            kyzen.app / dashboard
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="hidden sm:flex w-44 shrink-0 flex-col p-3 gap-0.5 border-r border-white/[0.05]"
          style={{ background: "rgba(3,1,10,0.5)" }}>
          <div className="text-[9px] font-mono tracking-[0.2em] uppercase px-2 mb-3" style={{ color: "#374151" }}>
            Navigation
          </div>
          {[
            { icon: "⚡", label: "Dashboard", active: true  },
            { icon: "🏹", label: "Quests",    active: false },
            { icon: "🧠", label: "Skills",    active: false },
            { icon: "🔥", label: "Streaks",   active: false },
            { icon: "⚔",  label: "Guild",    active: false },
          ].map(item => (
            <div key={item.label}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11px] font-mono"
              style={{
                color:      item.active ? "#a78bfa" : "#374151",
                background: item.active ? "rgba(99,102,241,0.1)" : "transparent",
                border:     item.active ? "1px solid rgba(99,102,241,0.18)" : "1px solid transparent",
              }}>
              <span className="opacity-60 text-sm">{item.icon}</span>
              {item.label}
            </div>
          ))}

          {/* XP bar */}
          <div className="mt-auto pt-3 border-t border-white/[0.05]">
            <div className="p-2.5 rounded-lg" style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.1)" }}>
              <div className="flex justify-between text-[9px] font-mono mb-1.5" style={{ color: "#4B5563" }}>
                <span>LVL 42</span>
                <span style={{ color: "#818cf8" }}>{Math.round(xpWidth)}%</span>
              </div>
              <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                <motion.div className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg,#6366f1,#818cf8)", width: `${xpWidth}%` }}
                  transition={{ duration: 1, ease: "easeOut" }} />
              </div>
              <div className="text-[8px] font-mono mt-1" style={{ color: "#374151" }}>14,320 / 18,000 XP</div>
            </div>
          </div>
        </div>

        {/* Main panel */}
        <div className="flex-1 p-5 space-y-4 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm font-bold mb-0.5" style={{ color: "#F5F3FF", fontFamily: "'Syne',sans-serif" }}>
                Good morning, Dev.
              </div>
              <div className="text-[10px] font-mono" style={{ color: "#4B5563" }}>
                Quest board refreshed · 4 active today
              </div>
            </div>
            <motion.div
              animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 2.5, repeat: Infinity }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[9px] font-mono shrink-0"
              style={{ color: "#22c55e", background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.14)" }}>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              +<XpTicker /> XP live
            </motion.div>
          </div>

          {/* Stat chips */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Streak", value: "34 day",   color: "#f97316" },
              { label: "Done",   value: "12 / 16",  color: "#22c55e" },
              { label: "Rank",   value: "ARCH · III", color: "#818cf8" },
            ].map(s => (
              <div key={s.label} className="p-2.5 rounded-lg text-center"
                style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="text-[8px] font-mono tracking-widest uppercase mb-1" style={{ color: "#4B5563" }}>{s.label}</div>
                <div className="font-bold text-[11px]" style={{ color: s.color, fontFamily: "'Syne',sans-serif" }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Quest list */}
          <div>
            <div className="text-[8px] font-mono tracking-[0.2em] uppercase mb-2" style={{ color: "#374151" }}>
              Active Quests
            </div>
            <div className="space-y-1.5">
              {QUESTS.map((q, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0 + i * 0.08, duration: 0.4 }}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg"
                  style={{
                    background: q.done ? "rgba(34,197,94,0.04)" : "rgba(255,255,255,0.018)",
                    border:     q.done ? "1px solid rgba(34,197,94,0.1)" : "1px solid rgba(255,255,255,0.05)",
                  }}>
                  <div className="w-3.5 h-3.5 rounded shrink-0 flex items-center justify-center"
                    style={{ background: q.done ? "#22c55e" : "transparent", border: q.done ? "none" : "1px solid rgba(255,255,255,0.18)" }}>
                    {q.done && (
                      <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                        <path d="M1 3l2 2 4-4" stroke="#03010a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <span className="flex-1 text-[10px] font-mono truncate"
                    style={{ color: q.done ? "#374151" : "#A1A1AA", textDecoration: q.done ? "line-through" : "none" }}>
                    {q.title}
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded shrink-0"
                    style={{ color: "#818cf8", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.14)" }}>
                    {q.tag}
                  </span>
                  <span className="text-[9px] font-mono shrink-0 hidden md:block" style={{ color: "#374151" }}>
                    +{q.xp}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── HERO ─────────────────────────────────────────────────────────────────────
const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ background: "#05010A" }}>

      {/* ── Background layers ── */}

      {/* Base radial — deep indigo well */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(circle at 50% 42%, #12082e 0%, #07031a 35%, #05010a 70%)" }} />

      {/* Wide atmospheric bloom */}
      <div className="absolute inset-0 pointer-events-none flex justify-center"
        style={{ top: "0%" }}>
        <div style={{
          width: 1100, height: 600, borderRadius: "50%", marginTop: -80,
          background: "radial-gradient(ellipse at 50% 40%, rgba(88,28,235,0.2) 0%, rgba(67,20,180,0.08) 50%, transparent 72%)",
          filter: "blur(80px)",
        }} />
      </div>

      {/* Top vignette */}
      <div className="absolute inset-x-0 top-0 h-40 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, #05010a, transparent)" }} />

      {/* ── The Orb — center stage ── */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 0.3 }}
        className="absolute inset-x-0 pointer-events-none select-none"
        style={{ top: "52px", zIndex: 1 }}>

        {/* Outer wide haze */}
        <div className="absolute left-1/2 -translate-x-1/2 rounded-full"
          style={{
            width: 1000, height: 520, marginTop: 80,
            background: "radial-gradient(ellipse at 50% 38%, rgba(109,40,217,0.22) 0%, rgba(76,29,149,0.07) 55%, transparent 72%)",
            filter: "blur(70px)",
          }} />

        {/* Main accretion disk — wide purple sweep */}
        <div className="absolute left-1/2 -translate-x-1/2"
          style={{
            width: 760, height: 200, marginTop: 285,
            borderRadius: "50%",
            background: "radial-gradient(ellipse at 50% 38%, rgba(139,92,246,0.6) 0%, rgba(109,40,217,0.35) 38%, rgba(76,29,149,0.1) 65%, transparent 80%)",
            filter: "blur(22px)",
          }} />

        {/* Inner bright disk */}
        <div className="absolute left-1/2 -translate-x-1/2"
          style={{
            width: 480, height: 90, marginTop: 325,
            borderRadius: "50%",
            background: "radial-gradient(ellipse at 50% 50%, rgba(216,180,254,0.75) 0%, rgba(167,139,250,0.5) 40%, rgba(109,40,217,0.12) 70%, transparent 85%)",
            filter: "blur(8px)",
          }} />

        {/* Photon ring — bright arc */}
        <div className="absolute left-1/2 -translate-x-1/2"
          style={{
            width: 340, height: 48, marginTop: 345,
            borderRadius: "50%",
            border: "2px solid rgba(245,243,255,0.65)",
            boxShadow: "0 0 16px 6px rgba(192,132,252,0.7), 0 0 48px 12px rgba(139,92,246,0.35)",
            filter: "blur(0.4px)",
          }} />

        {/* Second ring */}
        <div className="absolute left-1/2 -translate-x-1/2"
          style={{
            width: 420, height: 62, marginTop: 330,
            borderRadius: "50%",
            border: "1px solid rgba(167,139,250,0.3)",
            boxShadow: "0 0 20px 2px rgba(139,92,246,0.2)",
            filter: "blur(0.8px)",
          }} />

        {/* Floor glow — light pooling downward */}
        <div className="absolute left-1/2 -translate-x-1/2"
          style={{
            width: 680, height: 280, marginTop: 360,
            borderRadius: "50%",
            background: "radial-gradient(ellipse at 50% 0%, rgba(109,40,217,0.5) 0%, rgba(76,29,149,0.22) 45%, transparent 70%)",
            filter: "blur(28px)",
          }} />

        {/* The void */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 rounded-full"
          style={{
            width: 210, height: 210, marginTop: 210,
            background: "radial-gradient(circle at 38% 36%, #06021a 0%, #02010a 60%, #000007 100%)",
            boxShadow: "0 0 0 1.5px rgba(109,40,217,0.12), 0 0 60px 16px rgba(0,0,8,0.95), inset 0 0 40px rgba(0,0,12,1)",
          }}
          animate={{ boxShadow: [
            "0 0 0 1.5px rgba(109,40,217,0.12), 0 0 60px 16px rgba(0,0,8,0.95), inset 0 0 40px rgba(0,0,12,1)",
            "0 0 0 1.5px rgba(139,92,246,0.18), 0 0 70px 18px rgba(0,0,8,0.95), inset 0 0 40px rgba(0,0,12,1)",
            "0 0 0 1.5px rgba(109,40,217,0.12), 0 0 60px 16px rgba(0,0,8,0.95), inset 0 0 40px rgba(0,0,12,1)",
          ]}}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Void rim glow */}
        <div className="absolute left-1/2 -translate-x-1/2 rounded-full"
          style={{
            width: 210, height: 210, marginTop: 210,
            border: "1px solid rgba(139,92,246,0.15)",
          }} />

        {/* Upper lensing arc — bends over the top */}
        <div className="absolute left-1/2 -translate-x-1/2 rounded-full overflow-hidden"
          style={{ width: 270, height: 135, marginTop: 210 }}>
          <div style={{
            width: 270, height: 270, borderRadius: "50%",
            border: "1.5px solid rgba(167,139,250,0.2)",
            boxShadow: "0 0 10px rgba(139,92,246,0.15)",
          }} />
        </div>

        {/* Horizon line */}
        <div className="absolute left-1/2 -translate-x-1/2"
          style={{
            width: 720, height: 1, marginTop: 370,
            background: "linear-gradient(90deg, transparent 0%, rgba(109,40,217,0) 12%, rgba(167,139,250,0.55) 35%, rgba(245,243,255,0.9) 50%, rgba(167,139,250,0.55) 65%, rgba(109,40,217,0) 88%, transparent 100%)",
          }} />

        {/* Horizon bloom */}
        <div className="absolute left-1/2 -translate-x-1/2"
          style={{
            width: 580, height: 36, marginTop: 354,
            borderRadius: "50%",
            background: "radial-gradient(ellipse at 50% 50%, rgba(167,139,250,0.22) 0%, transparent 70%)",
            filter: "blur(12px)",
          }} />
      </motion.div>

      {/* Bottom fade — pulls page into dashboard */}
      <div className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{ height: "45%", background: "linear-gradient(to top, #05010a 0%, transparent 100%)", zIndex: 2 }} />

      {/* ── CONTENT ── */}
      <div className="relative flex flex-col items-center text-center px-6 pt-28 pb-0 w-full" style={{ zIndex: 10 }}>

        {/* Badge */}
        <motion.div {...fadeUp(0.2)}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-mono tracking-[0.18em] uppercase mb-8"
            style={{ color: "#818cf8", background: "rgba(99,102,241,0.09)", border: "1px solid rgba(99,102,241,0.22)" }}>
            <motion.span className="w-1.5 h-1.5 rounded-full" style={{ background: "#6366f1" }}
              animate={{ opacity: [1, 0.25, 1] }} transition={{ duration: 2.2, repeat: Infinity }} />
            Season 01 · System Online
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1 {...fadeUp(0.32)}
          className="font-black tracking-tight leading-[1.03] mb-5 max-w-[680px]"
          style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(2.8rem, 6.5vw, 5rem)", color: "#F5F3FF", letterSpacing: "-0.02em" }}>
          Turn Your Life Into
          <br />a Game Engine.
        </motion.h1>

        {/* Subtext */}
        <motion.p {...fadeUp(0.44)}
          className="max-w-[400px] mx-auto mb-10 leading-relaxed"
          style={{ fontSize: "clamp(0.9rem, 2vw, 1rem)", color: "#A1A1AA", fontWeight: 400 }}>
          Accept quests, earn XP from every commit and focus session,
          level your skills, and forge a developer identity that compounds.
        </motion.p>

        {/* CTAs */}
        <motion.div {...fadeUp(0.54)} className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-5">
          <motion.button
            whileHover={{ scale: 1.04, filter: "brightness(1.15)" }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.16 }}
            className="px-8 py-3.5 rounded-lg font-semibold text-[12px] uppercase"
            style={{ background: "#6366f1", color: "#F5F3FF", letterSpacing: "0.1em" }}>
            Initialize Character
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02, borderColor: "rgba(255,255,255,0.2)" }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.16 }}
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-lg text-[12px] uppercase font-medium"
            style={{ color: "#A1A1AA", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", letterSpacing: "0.1em" }}>
            <span className="w-4 h-4 rounded-full border flex items-center justify-center shrink-0"
              style={{ borderColor: "rgba(255,255,255,0.25)" }}>
              <span style={{ width:0, height:0, marginLeft:1,
                borderTop:"3.5px solid transparent", borderBottom:"3.5px solid transparent",
                borderLeft:"5.5px solid rgba(255,255,255,0.5)" }} />
            </span>
            Watch Demo
          </motion.button>
        </motion.div>

        {/* Stat line */}
        <motion.p {...fadeUp(0.64)} className="text-[11px] font-mono mb-16" style={{ color: "#4B5563" }}>
          <span style={{ color: "#22c55e", fontWeight: 600 }}>+2,431 XP</span> earned today ·{" "}
          <span style={{ color: "#6B7280" }}>31,420 developers</span> online
        </motion.p>

        {/* Dashboard preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-4xl mx-auto"
          style={{ zIndex: 10 }}>

          {/* Glow above card */}
          <div className="absolute pointer-events-none"
            style={{
              inset: "-20px", top: "-32px",
              background: "radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.12) 0%, transparent 65%)",
              filter: "blur(16px)",
            }} />

          {/* Float */}
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
            <Dashboard />
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2" style={{ zIndex: 20 }}>
        <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full flex items-start justify-center pt-1.5"
          style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="w-1 h-2 rounded-full" style={{ background: "rgba(99,102,241,0.5)" }} />
        </motion.div>
      </motion.div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=JetBrains+Mono:wght@400;500&display=swap');
        * { font-family: 'JetBrains Mono', monospace; }
        h1 { font-family: 'Syne', sans-serif !important; }
      `}</style>
    </section>
  );
};

export default Hero;
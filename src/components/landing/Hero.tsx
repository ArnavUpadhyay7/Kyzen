import { useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Character1 from "../../assets/Character1.png";
import Character2 from "../../assets/Character2.png";
import Character3 from "../../assets/Character3.png";

interface CardData {
  id: number;
  image: string;
  level: string;
  class: string;
  icon: string;
  rank: string;
  xp: string;
  xpMax: string;
  xpPct: number;
}

const CARDS: CardData[] = [
  {
    id: 1,
    image: Character1,
    level: "03",
    class: "Developer",
    icon: "</>",
    rank: "RISING",
    xp: "1,250",
    xpMax: "2,000",
    xpPct: 62.5,
  },
  {
    id: 2,
    image: Character2,
    level: "07",
    class: "Architect",
    icon: "⬡",
    rank: "VETERAN",
    xp: "3,800",
    xpMax: "5,000",
    xpPct: 76,
  },
  {
    id: 3,
    image: Character3,
    level: "12",
    class: "Overlord",
    icon: "✦",
    rank: "ELITE",
    xp: "8,100",
    xpMax: "9,000",
    xpPct: 90,
  },
];

function Diamond({ style }: { style: React.CSSProperties }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        width: 10,
        height: 10,
        background: "rgba(139,92,246,0.5)",
        rotate: 45,
        ...style,
      }}
      animate={{ y: [0, -14, 0], opacity: [0.4, 0.85, 0.4] }}
      transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

const DIAMONDS = [
  { top: "28%", left: "42%", width: 8, height: 8 },
  { top: "55%", left: "38%", width: 12, height: 12 },
  { top: "70%", left: "52%", width: 7, height: 7 },
  { top: "40%", left: "62%", width: 10, height: 10 },
  { top: "62%", left: "70%", width: 8, height: 8 },
  { top: "32%", left: "74%", width: 6, height: 6 },
];

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const },
});

const CARD_HEIGHT = 500;
const PEEK = 60;

interface CharacterCardProps {
  card: CardData;
  stackIndex: number;
  onClick: () => void;
  totalCards: number;
}

function CharacterCard({ card, stackIndex, onClick, totalCards }: CharacterCardProps) {
  const isFront = stackIndex === 0;

  const yOffset = stackIndex * PEEK;
  const scale = 1 - stackIndex * 0.03;
  const brightness = 1 - stackIndex * 0.3;

  return (
    <motion.div
      layout
      onClick={onClick}
      initial={false}
      animate={{
        y: yOffset,
        scale,
        filter: `brightness(${brightness})`,
        zIndex: totalCards - stackIndex,
      }}
      transition={{
        type: "spring",
        stiffness: 320,
        damping: 34,
        mass: 1,
      }}
      className="absolute top-0 left-0 w-full"
      style={{
        cursor: "pointer",
        transformOrigin: "top center",
        height: CARD_HEIGHT,
      }}
    >
      {/* Card shell — fills the entire motion.div */}
      <div
        className="relative w-full h-full overflow-hidden"
        style={{
          borderRadius: 24,
          background: "linear-gradient(160deg,rgba(88,28,220,0.28) 0%,rgba(15,8,40,0.97) 50%)",
          border: isFront
            ? "1px solid rgba(139,92,246,0.45)"
            : "1px solid rgba(139,92,246,0.18)",
          boxShadow: isFront
            ? "0 0 0 1px rgba(139,92,246,0.12), 0 40px 80px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.07), 0 0 60px rgba(109,40,217,0.22)"
            : "0 12px 40px rgba(0,0,0,0.6)",
        }}
      >
        {/* Top shimmer */}
        <div
          className="absolute inset-x-0 top-0 h-px z-20 pointer-events-none"
          style={{
            background: isFront
              ? "linear-gradient(90deg,transparent 10%,rgba(167,139,250,0.65) 50%,transparent 90%)"
              : "linear-gradient(90deg,transparent 10%,rgba(167,139,250,0.2) 50%,transparent 90%)",
          }}
        />

        {/* Top meta row */}
        <div className="absolute top-5 left-5 right-5 flex justify-between items-start z-20">
          <div>
            <div
              className="text-[10px] font-medium tracking-widest uppercase mb-1"
              style={{ color: "rgba(167,139,250,0.55)", fontFamily: "'DM Sans',sans-serif" }}
            >
              LEVEL
            </div>
            <div
              className="font-black"
              style={{ fontSize: 52, lineHeight: 1, color: "white", fontFamily: "'Barlow',sans-serif" }}
            >
              {card.level}
            </div>
            <div
              className="mt-1 px-3 py-0.5 rounded-full font-semibold"
              style={{
                fontSize: 10,
                background: "rgba(109,40,217,0.55)",
                color: "#e9d5ff",
                border: "1px solid rgba(139,92,246,0.4)",
                letterSpacing: "0.08em",
                width: "fit-content",
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              {card.rank}
            </div>
          </div>

          <div className="text-right">
            <div
              className="text-[10px] font-medium tracking-widest uppercase mb-1"
              style={{ color: "rgba(167,139,250,0.55)", fontFamily: "'DM Sans',sans-serif" }}
            >
              CLASS
            </div>
            <div className="text-white font-semibold" style={{ fontSize: 15, fontFamily: "'DM Sans',sans-serif" }}>
              {card.class}
            </div>
            <div
              className="mt-2 w-9 h-9 rounded-xl flex items-center justify-center ml-auto text-[13px]"
              style={{
                background: "rgba(109,40,217,0.35)",
                border: "1px solid rgba(139,92,246,0.35)",
                color: "rgba(196,181,253,0.85)",
                fontFamily: "monospace",
              }}
            >
              {card.icon}
            </div>
          </div>
        </div>

        {/* Character image — covers the full card, anchored to bottom */}
        <img
          src={card.image}
          alt={`Character ${card.id}`}
          draggable={false}
          className="absolute inset-0 w-full h-full select-none z-10"
          style={{
            objectFit: "cover",
            objectPosition: "top center",
            pointerEvents: "none",
          }}
        />

        {/* Bottom gradient so XP bar stays readable over image */}
        <div
          className="absolute bottom-0 inset-x-0 z-10 pointer-events-none"
          style={{
            height: "45%",
            background: "linear-gradient(to top, rgba(6,3,20,0.98) 0%, rgba(6,3,20,0.7) 50%, transparent 100%)",
          }}
        />

        {/* XP Bar */}
        <div className="absolute bottom-5 left-5 right-5 z-20">
          <div className="flex justify-between items-center mb-1.5">
            <span
              className="text-[11px] font-semibold tracking-wider"
              style={{ color: "rgba(167,139,250,0.7)", fontFamily: "'DM Sans',sans-serif" }}
            >
              XP
            </span>
            <span className="text-[11px]" style={{ color: "rgba(167,139,250,0.5)", fontFamily: "'DM Sans',sans-serif" }}>
              {card.xp} / {card.xpMax}
            </span>
          </div>
          <div
            className="w-full rounded-full overflow-hidden"
            style={{
              height: 7,
              background: "rgba(109,40,217,0.2)",
              border: "1px solid rgba(139,92,246,0.15)",
            }}
          >
            <motion.div
              className="h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${card.xpPct}%` }}
              transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{
                background: "linear-gradient(90deg,#6d28d9,#a855f7)",
                boxShadow: "0 0 10px rgba(139,92,246,0.7)",
              }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const gx = useSpring(mouseX, { stiffness: 20, damping: 22 });
  const gy = useSpring(mouseY, { stiffness: 20, damping: 22 });
  const tiltX = useTransform(gy, [-10, 10], [2, -2]);
  const tiltY = useTransform(gx, [-10, 10], [-3, 3]);

  const handleMouse = useCallback(
    (e: React.MouseEvent) => {
      const r = sectionRef.current?.getBoundingClientRect();
      if (!r) return;
      mouseX.set((e.clientX - r.left - r.width / 2) * 0.012);
      mouseY.set((e.clientY - r.top - r.height / 2) * 0.008);
    },
    [mouseX, mouseY]
  );

  const handleCardClick = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % CARDS.length);
  }, []);

  const orderedCards = CARDS.map((_, i) => CARDS[(activeIndex + i) % CARDS.length]);
  const deckHeight = CARD_HEIGHT + PEEK * (CARDS.length - 1);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;700;800;900&family=DM+Sans:wght@300;400;500&display=swap');
        .hero-root { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <section
        ref={sectionRef}
        onMouseMove={handleMouse}
        className="hero-root relative w-full min-h-screen flex items-center overflow-hidden"
        style={{ background: "#080610" }}
      >
        {/* Background layers */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 100% 80% at 60% 40%, rgba(88,28,220,0.18) 0%, rgba(55,14,150,0.08) 45%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 55% 80% at 0% 50%, rgba(0,0,0,0.6) 0%, transparent 60%)",
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: 0, left: "30%", right: 0, height: "50%",
            background:
              "radial-gradient(ellipse 80% 60% at 60% 100%, rgba(88,28,220,0.22) 0%, transparent 65%)",
            filter: "blur(30px)",
          }}
        />

        {/* Mouse bloom */}
        <motion.div
          className="absolute pointer-events-none rounded-full"
          style={{
            width: 800, height: 500,
            top: "10%", left: "30%",
            background: "radial-gradient(ellipse at center, rgba(109,40,217,0.12) 0%, transparent 70%)",
            filter: "blur(50px)",
            x: gx, y: gy,
          }}
        />

        {DIAMONDS.map((d, i) => (
          <Diamond key={i} style={d} />
        ))}

        {/* Main layout */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-14 flex flex-col lg:flex-row items-center gap-12 lg:gap-0 py-20">

          {/* Left column */}
          <div className="flex-1 flex flex-col items-start max-w-xl">
            <motion.div
              {...fadeUp(0.08)}
              className="flex items-center gap-2 mb-7 px-4 py-2 rounded-full"
              style={{ background: "rgba(109,40,217,0.12)", border: "1px solid rgba(139,92,246,0.28)" }}
            >
              <span style={{ color: "#a78bfa", fontSize: 13 }}>✦</span>
              <span
                className="font-medium tracking-widest uppercase"
                style={{ fontSize: 11, color: "rgba(167,139,250,0.85)", letterSpacing: "0.14em" }}
              >
                Life RPG for Developers &amp; Ambitious People
              </span>
            </motion.div>

            <motion.h1 {...fadeUp(0.16)} style={{ lineHeight: 0.92, letterSpacing: "-0.01em" }} className="mb-6">
              <span
                className="block text-white font-black uppercase"
                style={{ fontSize: "clamp(3.6rem,8vw,6.4rem)", fontFamily: "'Barlow', sans-serif" }}
              >
                Earn Your
              </span>
              <span
                className="block font-black uppercase"
                style={{
                  fontSize: "clamp(3.6rem,8vw,6.4rem)",
                  fontFamily: "'Barlow', sans-serif",
                  background: "linear-gradient(135deg,#7c3aed 0%,#9333ea 40%,#a855f7 70%,#c084fc 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Progress
              </span>
            </motion.h1>

            <motion.p
              {...fadeUp(0.24)}
              className="mb-9 leading-relaxed"
              style={{ fontSize: "clamp(0.95rem,1.5vw,1.05rem)", color: "rgba(190,180,220,0.65)", maxWidth: 430 }}
            >
              Complete quests, gain XP, build streaks, and level up skills.
              Turn your daily actions into epic progress.
            </motion.p>

            <motion.div
              {...fadeUp(0.32)}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-10"
            >
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="relative flex items-center gap-2 px-7 py-3.5 rounded-xl text-white font-semibold overflow-hidden cursor-pointer"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 15,
                  background: "linear-gradient(135deg,#7c3aed 0%,#9333ea 60%,#a855f7 100%)",
                  boxShadow: "0 0 32px rgba(124,58,237,0.55), 0 4px 16px rgba(0,0,0,0.4)",
                  border: "1px solid rgba(167,139,250,0.2)",
                }}
              >
                <motion.span
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: "linear-gradient(110deg,transparent 30%,rgba(255,255,255,0.1) 50%,transparent 70%)",
                  }}
                  animate={{ x: ["-120%", "220%"] }}
                  transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 2.5, ease: "easeInOut" }}
                />
                Start Your Journey
                <span className="text-lg">→</span>
              </motion.button>

              <motion.button
                whileHover={{ background: "rgba(255,255,255,0.06)" }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-3 px-6 py-3.5 rounded-xl font-medium cursor-pointer transition-colors"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 15,
                  color: "rgba(210,198,255,0.75)",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)" }}
                >
                  <span
                    style={{
                      width: 0, height: 0, marginLeft: 2,
                      borderTop: "4px solid transparent",
                      borderBottom: "4px solid transparent",
                      borderLeft: "7px solid rgba(167,139,250,0.85)",
                      display: "inline-block",
                    }}
                  />
                </span>
                See How It Works
              </motion.button>
            </motion.div>

            <motion.div {...fadeUp(0.4)} className="flex items-center gap-3">
              <div className="flex">
                {["https://i.pravatar.cc/40?img=11","https://i.pravatar.cc/40?img=32","https://i.pravatar.cc/40?img=53","https://i.pravatar.cc/40?img=14"].map(
                  (src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt=""
                      className="w-8 h-8 rounded-full object-cover"
                      style={{ border: "2px solid #080610", marginLeft: i === 0 ? 0 : -10, zIndex: 4 - i, position: "relative" }}
                    />
                  )
                )}
              </div>
              <span style={{ fontSize: 13, color: "rgba(170,158,215,0.55)" }}>
                Join{" "}
                <span className="font-semibold" style={{ color: "#a78bfa" }}>12,847+</span>{" "}
                players leveling up their lives every day.
              </span>
            </motion.div>
          </div>

          {/* Right column — stacked card carousel */}
          <div className="flex-1 flex justify-center lg:justify-end items-start pt-10 lg:pt-0">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{ perspective: "1200px" }}
            >
              <motion.div style={{ rotateX: tiltX, rotateY: tiltY, transformStyle: "preserve-3d" }}>
                {/* Deck container */}
                <div
                  className="relative cursor-pointer"
                  style={{ width: "clamp(280px,34vw,400px)", height: deckHeight }}
                  onClick={handleCardClick}
                >
                  {/* Cards — rendered back-to-front so front sits on top in DOM stacking */}
                  {[...orderedCards].reverse().map((card, reversedIdx) => {
                    const stackIndex = CARDS.length - 1 - reversedIdx;
                    return (
                      <CharacterCard
                        key={card.id}
                        card={card}
                        stackIndex={stackIndex}
                        onClick={handleCardClick}
                        totalCards={CARDS.length}
                      />
                    );
                  })}

                  {/* Dot indicators */}
                  <div
                    className="absolute flex gap-2"
                    style={{ bottom: -28, left: "50%", transform: "translateX(-50%)" }}
                  >
                    {CARDS.map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          width: i === 0 ? 20 : 6,
                          background: i === 0 ? "rgba(167,139,250,0.9)" : "rgba(139,92,246,0.3)",
                        }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className="h-1.5 rounded-full"
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
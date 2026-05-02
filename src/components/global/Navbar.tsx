import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const NAV_LINKS = ["Hero", "About", "Features", "Pricing", "Changelog"];

export default function Navbar() {
  const [active, setActive] = useState("Hero");
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&display=swap');`}</style>

      {/* Desktop */}
      <div className="fixed inset-x-0 top-0 z-50 hidden md:flex justify-center pt-5"
        style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <nav
          className="flex items-center gap-1 px-2 py-2 rounded-full"
          style={{
            background: "rgba(18,10,40,0.52)",
            backdropFilter: "blur(22px)",
            WebkitBackdropFilter: "blur(22px)",
            border: "1px solid rgba(139,92,246,0.2)",
            boxShadow: "0 4px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.07)",
          }}
        >
          {NAV_LINKS.map((l) => (
            <a
              key={l}
              href="#"
              onClick={() => setActive(l)}
              className={`px-5 py-2 rounded-full text-[14px] transition-all duration-200 ${
                active === l
                  ? "bg-white/10 text-white/92 font-medium"
                  : "text-white/45 hover:text-white/75 hover:bg-white/[0.04] font-normal"
              }`}
            >
              {l}
            </a>
          ))}
        </nav>
      </div>

      {/* Mobile */}
      <div
        className="fixed inset-x-0 top-0 z-50 flex md:hidden items-center justify-between px-5 h-14"
        style={{
          fontFamily: "'DM Sans', sans-serif",
          background: "rgba(7,4,26,0.88)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(139,92,246,0.12)",
        }}
      >
        <span className="text-white/50 text-[13px] tracking-widest uppercase font-normal"></span>
        <button onClick={() => setMobileOpen((p) => !p)} className="flex flex-col gap-[5px] p-2" aria-label="Toggle menu">
          <span className="block w-[18px] h-px bg-white/50 rounded-full transition-all duration-200"
            style={{ transform: mobileOpen ? "rotate(45deg) translate(4px,4px)" : "none" }} />
          <span className="block w-[13px] h-px bg-white/50 rounded-full transition-all duration-200"
            style={{ opacity: mobileOpen ? 0 : 1 }} />
          <span className="block w-[18px] h-px bg-white/50 rounded-full transition-all duration-200"
            style={{ transform: mobileOpen ? "rotate(-45deg) translate(4px,-4px)" : "none" }} />
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-14 z-40 md:hidden flex flex-col px-5 py-4 gap-0.5"
            style={{ fontFamily: "'DM Sans', sans-serif", background: "rgba(7,4,26,0.97)", backdropFilter: "blur(24px)", borderBottom: "1px solid rgba(139,92,246,0.1)" }}
          >
            {NAV_LINKS.map((l, i) => (
              <motion.a
                key={l}
                href="#"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => { setActive(l); setMobileOpen(false); }}
                className={`py-3 text-[14px] border-b border-white/[0.04] last:border-0 transition-colors ${
                  active === l ? "text-white/85 font-medium" : "text-white/40 font-normal"
                }`}
              >
                {l}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
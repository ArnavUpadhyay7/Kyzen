import { useEffect, useState } from "react";
import { motion, useScroll, AnimatePresence } from "framer-motion";

const NAV_LINKS = ["Product", "Ranks", "Guilds", "Changelog"];

const Navbar = () => {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const unsub = scrollY.on("change", (v) => setScrolled(v > 50));
    return unsub;
  }, [scrollY]);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 inset-x-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? "rgba(3,2,14,0.88)" : "transparent",
          backdropFilter: scrolled ? "blur(28px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(139,92,246,0.1)" : "none",
          boxShadow: scrolled ? "0 1px 40px rgba(0,0,0,0.6)" : "none",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.04 }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center text-[10px]"
              style={{
                background: "linear-gradient(135deg,#7c3aed,#a855f7)",
                boxShadow: "0 0 16px rgba(168,85,247,0.5)",
              }}
            >
              ⚡
            </div>
            <span
              className="text-white font-black text-lg tracking-widest"
              style={{ fontFamily: "'Syne',sans-serif" }}
            >
              KYZEN<span className="text-purple-500">.</span>
            </span>
          </motion.div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <a
                key={l}
                href="#"
                className="relative text-white/40 text-[11px] font-mono tracking-widest uppercase hover:text-white/80 transition-colors group"
              >
                {l}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-purple-500 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button className="text-white/40 text-[11px] font-mono tracking-widest uppercase hover:text-white/80 transition-colors px-3 py-2">
              Login
            </button>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(168,85,247,0.5)" }}
              whileTap={{ scale: 0.96 }}
              className="px-5 py-2 rounded-lg text-white text-[11px] font-bold tracking-widest uppercase transition-all"
              style={{
                background: "linear-gradient(135deg,#7c3aed,#a855f7,#c026d3)",
                boxShadow: "0 0 20px rgba(168,85,247,0.3)",
              }}
            >
              Start Free
            </motion.button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((p) => !p)}
            className="md:hidden flex flex-col gap-1.5 p-2"
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                animate={
                  mobileOpen
                    ? i === 0
                      ? { rotate: 45, y: 7 }
                      : i === 1
                      ? { opacity: 0 }
                      : { rotate: -45, y: -7 }
                    : { rotate: 0, y: 0, opacity: 1 }
                }
                transition={{ duration: 0.25 }}
                className="block w-5 h-px bg-white/50"
              />
            ))}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 top-16 z-40 md:hidden border-b border-white/5"
            style={{
              background: "rgba(3,2,14,0.97)",
              backdropFilter: "blur(28px)",
            }}
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {NAV_LINKS.map((l, i) => (
                <motion.a
                  key={l}
                  href="#"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="text-white/50 text-sm font-mono tracking-widest uppercase hover:text-white transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {l}
                </motion.a>
              ))}
              <div className="flex gap-3 pt-2 border-t border-white/5">
                <button className="flex-1 py-2.5 border border-white/10 rounded-lg text-white/40 text-[11px] font-mono tracking-widest uppercase">
                  Login
                </button>
                <button
                  className="flex-1 py-2.5 rounded-lg text-white text-[11px] font-bold tracking-widest uppercase"
                  style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)" }}
                >
                  Start Free
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
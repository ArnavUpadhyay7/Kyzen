import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  User,
  Swords,
  Trophy,
  ScrollText,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";

/* ─── Types ─── */
type NavSection = { label: string; items: NavItem[] };
type NavItem = { icon: React.ReactNode; label: string; to: string; badge?: string | number };
interface SidebarProps { onClose?: () => void }

/* ─── Data ─── */
const NAV_SECTIONS: NavSection[] = [
  {
    label: "MAIN MENU",
    items: [
      { icon: <LayoutDashboard size={16} />, label: "Dashboard", to: "/dashboard" },
      { icon: <Swords size={16} />,          label: "Quests",    to: "/dashboard/quests",  badge: 3 },
      { icon: <ScrollText size={16} />,      label: "Journal",   to: "/dashboard/journal" },
    ],
  },
  {
    label: "PROGRESS",
    items: [
      { icon: <Trophy size={16} />, label: "Leaderboard", to: "/dashboard/leaderboard" },
      { icon: <User size={16} />,   label: "Profile",     to: "/dashboard/profile" },
    ],
  },
  {
    label: "SETTINGS",
    items: [
      { icon: <Settings size={16} />, label: "Settings", to: "/dashboard/settings" },
    ],
  },
];

/* ─── All nav items flat for mobile stagger ─── */
const ALL_NAV_ITEMS: (NavItem & { sectionLabel?: string; isFirstInSection?: boolean })[] = NAV_SECTIONS.flatMap((s) =>
  s.items.map((item, idx) => ({ ...item, sectionLabel: idx === 0 ? s.label : undefined, isFirstInSection: idx === 0 }))
);

/* ─── Desktop sidebar body ─── */
function SidebarBody({ onNavClick }: { onNavClick?: () => void }) {
  return (
    <>
      <div
        className="absolute top-0 left-0 w-40 h-40 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at top left, rgba(109,40,217,0.18) 0%, transparent 70%)" }}
      />

      <Link to="/" className="px-4 pt-5 pb-4 block">
        <div
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer"
          style={{ border: "1px solid rgba(139,92,246,0.15)", background: "rgba(109,40,217,0.08)" }}
        >
          <LogoIcon />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-100 truncate" style={{ fontFamily: "'Barlow', sans-serif", letterSpacing: "0.04em" }}>KYZEN</p>
            <p className="text-[10px] text-violet-400/60 truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>Free Plan</p>
          </div>
          <ChevronDown size={13} className="text-slate-500 shrink-0" />
        </div>
      </Link>

      <div className="px-4 mb-5">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl cursor-text"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <SearchSVG />
          <span className="text-slate-500 text-xs flex-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>Search</span>
          <kbd className="text-[9px] px-1.5 py-0.5 rounded"
            style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.2)", color: "rgba(167,139,250,0.6)", fontFamily: "monospace" }}>
            ⌘K
          </kbd>
        </div>
      </div>

      <nav className="flex-1 px-3 flex flex-col gap-5">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <p className="text-[9px] font-semibold tracking-widest mb-2 px-3"
              style={{ color: "rgba(139,92,246,0.4)", fontFamily: "'DM Sans', sans-serif" }}>
              {section.label}
            </p>
            <div className="flex flex-col gap-0.5">
              {section.items.map((item) => (
                <DesktopNavLink key={item.to} item={item} onClick={onNavClick} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="mx-4 my-3" style={{ height: 1, background: "rgba(139,92,246,0.1)" }} />

      <div className="px-4 pb-5">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer group hover:bg-white/4 transition-colors"
          style={{ border: "1px solid rgba(255,255,255,0.05)" }}>
          <UserAvatar />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-200 truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>Ethan Reynolds</p>
            <p className="text-[10px] text-slate-500 truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>ethan@kyzen.gg</p>
          </div>
          <LogOut size={13} className="text-slate-600 group-hover:text-violet-400 transition-colors shrink-0" />
        </div>
      </div>
    </>
  );
}

function DesktopNavLink({ item, onClick }: { item: NavItem; onClick?: () => void }) {
  return (
    <NavLink
      to={item.to}
      end={item.to === "/dashboard"}
      onClick={onClick}
      className={({ isActive }) =>
        `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative ${
          isActive
            ? "bg-violet-600/20 text-violet-200 border border-violet-500/30"
            : "text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.div layoutId="sidebar-active" className="absolute inset-0 rounded-xl"
              style={{ background: "linear-gradient(135deg, rgba(109,40,217,0.18) 0%, rgba(139,92,246,0.08) 100%)", boxShadow: "inset 0 0 20px rgba(139,92,246,0.06)" }}
              transition={{ type: "spring", stiffness: 380, damping: 36 }} />
          )}
          <span className={`relative z-10 transition-colors ${isActive ? "text-violet-400" : "text-slate-500 group-hover:text-slate-300"}`}>
            {item.icon}
          </span>
          <span className="relative z-10 flex-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>{item.label}</span>
          {item.badge && (
            <span className="relative z-10 text-[10px] font-bold px-1.5 py-0.5 rounded-md"
              style={{ background: "rgba(139,92,246,0.25)", color: "#c4b5fd", border: "1px solid rgba(139,92,246,0.35)" }}>
              {item.badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}

/* ─── Main export ─── */
export default function Sidebar({ onClose: _externalClose }: SidebarProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const closeDrawer = () => {
    setOpen(false);
    _externalClose?.();
  };

  // Build flat list with section labels for mobile rendering
  let flatIdx = 0;
  const mobileItems: { item: NavItem; sectionLabel?: string; staggerIdx: number }[] = [];
  NAV_SECTIONS.forEach((section) => {
    section.items.forEach((item, i) => {
      mobileItems.push({
        item,
        sectionLabel: i === 0 ? section.label : undefined,
        staggerIdx: flatIdx++,
      });
    });
  });
  // +1 for user footer
  const userFooterIdx = flatIdx;

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Barlow:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');`}</style>

      {/* ══════ DESKTOP sidebar ══════ */}
      <aside
        className="hidden md:flex flex-col w-[230px] shrink-0 h-screen overflow-y-auto overflow-x-hidden relative"
        style={{
          background: "linear-gradient(180deg, rgba(10,7,28,0.98) 0%, rgba(8,5,22,0.99) 100%)",
          borderRight: "1px solid rgba(139,92,246,0.12)",
        }}
      >
        <SidebarBody />
      </aside>

      {/* ══════ MOBILE top bar ══════ */}
      <div
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-5 h-14 md:hidden"
        style={{
          background: "rgba(8,5,22,0.88)",
          borderBottom: "1px solid rgba(139,92,246,0.13)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
        }}
      >
        {/* Left: logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, rgba(109,40,217,0.7), rgba(139,92,246,0.4))",
              border: "1px solid rgba(139,92,246,0.45)",
              boxShadow: "0 0 10px rgba(139,92,246,0.28)",
            }}
          >
            <KyzenMark />
          </div>
          <span className="text-sm font-bold text-slate-100" style={{ fontFamily: "'Barlow', sans-serif", letterSpacing: "0.06em" }}>
            KYZEN
          </span>
        </Link>

        {/* Right: hamburger — same style as Navbar */}
        <button
          onClick={() => setOpen((p) => !p)}
          className="relative flex flex-col gap-[5px] p-2"
          aria-label="Toggle menu"
        >
          <span
            className="block w-[18px] h-px bg-white/50 rounded-full transition-all duration-200"
            style={{ transform: open ? "rotate(45deg) translate(4px,4px)" : "none" }}
          />
          <span
            className="block w-[13px] h-px bg-white/50 rounded-full transition-all duration-200"
            style={{ opacity: open ? 0 : 1 }}
          />
          <span
            className="block w-[18px] h-px bg-white/50 rounded-full transition-all duration-200"
            style={{ transform: open ? "rotate(-45deg) translate(4px,-4px)" : "none" }}
          />
          {/* Quest notification dot */}
          {!open && (
            <span
              className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full"
              style={{ background: "#a855f7", border: "1.5px solid rgba(8,5,22,0.99)", boxShadow: "0 0 6px rgba(168,85,247,0.65)" }}
            />
          )}
        </button>
      </div>

      {/* Spacer so page content clears the fixed top bar */}
      <div className="block md:hidden h-14 shrink-0" />

      {/* ══════ MOBILE dropdown menu (same style as Navbar) ══════ */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mob-menu"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-x-0 top-14 z-40 md:hidden flex flex-col pb-4"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              background: "rgba(7,4,26,0.97)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              borderBottom: "1px solid rgba(139,92,246,0.1)",
            }}
          >
            {/* Nav sections */}
            {mobileItems.map(({ item, sectionLabel, staggerIdx }) => (
              <div key={item.to}>
                {/* Section label */}
                {sectionLabel && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.06 + staggerIdx * 0.038, duration: 0.25 }}
                    className="text-[9px] font-semibold tracking-widest px-5 pt-4 pb-1"
                    style={{ color: "rgba(139,92,246,0.4)" }}
                  >
                    {sectionLabel}
                  </motion.p>
                )}

                {/* Nav item */}
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.07 + staggerIdx * 0.045, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <NavLink
                    to={item.to}
                    end={item.to === "/dashboard"}
                    onClick={closeDrawer}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-5 py-3 text-[14px] border-b border-white/[0.04] transition-colors ${
                        isActive
                          ? "text-violet-300 font-medium"
                          : "text-white/40 font-normal hover:text-white/70"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span className={`transition-colors ${isActive ? "text-violet-400" : "text-white/25"}`}>
                          {item.icon}
                        </span>
                        <span className="flex-1">{item.label}</span>
                        {item.badge && (
                          <span
                            className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                            style={{ background: "rgba(139,92,246,0.25)", color: "#c4b5fd", border: "1px solid rgba(139,92,246,0.35)" }}
                          >
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                </motion.div>
              </div>
            ))}

            {/* Divider */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.06 + userFooterIdx * 0.045, duration: 0.25 }}
              className="mx-5 my-3"
              style={{ height: 1, background: "rgba(139,92,246,0.1)" }}
            />

            {/* User footer */}
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 + userFooterIdx * 0.045, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="mx-4"
            >
              <div
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer group hover:bg-white/5 transition-colors"
                style={{ border: "1px solid rgba(255,255,255,0.05)" }}
              >
                <UserAvatar />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-200 truncate">Ethan Reynolds</p>
                  <p className="text-[10px] text-slate-500 truncate">ethan@kyzen.gg</p>
                </div>
                <LogOut size={13} className="text-slate-600 group-hover:text-violet-400 transition-colors shrink-0" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── Atoms ─── */
function KyzenMark() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M3 3L8 8L3 13" stroke="#c4b5fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 3L13 8L8 13" stroke="#c4b5fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
    </svg>
  );
}

function LogoIcon() {
  return (
    <div
      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
      style={{ background: "linear-gradient(135deg, rgba(109,40,217,0.6), rgba(139,92,246,0.3))", border: "1px solid rgba(139,92,246,0.4)", boxShadow: "0 0 12px rgba(139,92,246,0.3)" }}
    >
      <KyzenMark />
    </div>
  );
}

function SearchSVG() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" className="text-slate-500 shrink-0">
      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function UserAvatar() {
  return (
    <div className="relative">
      <img src="https://i.pravatar.cc/36?u=kyzen" alt="avatar"
        className="w-8 h-8 rounded-full object-cover"
        style={{ border: "2px solid rgba(139,92,246,0.4)" }} />
      <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full"
        style={{ background: "#22c55e", border: "1.5px solid rgba(8,5,22,0.99)" }} />
    </div>
  );
}
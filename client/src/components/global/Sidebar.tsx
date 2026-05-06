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
  Search,
  Terminal,
  Lock,
} from "lucide-react";
import { useTokens } from "../../context/ThemeContext";
import { useDevMode } from "../../context/DevModeContext";
import DevModeModal from "./DevModeModal";

type NavSection = { label: string; items: NavItem[] };
type NavItem = {
  icon: React.ReactNode;
  label: string;
  to: string;
  badge?: string | number;
  devGated?: boolean;
};
interface SidebarProps { onClose?: () => void }

function showToast(msg: string) {
  const ev = new CustomEvent("kyzen-toast", { detail: { message: msg, type: "success" } });
  window.dispatchEvent(ev);
}

const NAV_SECTIONS: NavSection[] = [
  {
    label: "Main Menu",
    items: [
      { icon: <LayoutDashboard size={15} />, label: "Dashboard",   to: "/dashboard" },
      { icon: <Swords size={15} />,          label: "Quests",      to: "/dashboard/quests",  badge: 3 },
      { icon: <ScrollText size={15} />,      label: "Journal",     to: "/dashboard/journal" },
      { icon: <Terminal size={15} />,        label: "Dev Mode",    to: "/dashboard/dev",     devGated: true },
    ],
  },
  {
    label: "Progress",
    items: [
      { icon: <Trophy size={15} />, label: "Leaderboard", to: "/dashboard/leaderboard" },
      { icon: <User   size={15} />, label: "Profile",     to: "/dashboard/profile" },
    ],
  },
  {
    label: "Settings",
    items: [
      { icon: <Settings size={15} />, label: "Settings", to: "/dashboard/settings" },
    ],
  },
];

function DesktopNavLink({ item, onLockedClick }: { item: NavItem; onLockedClick: () => void }) {
  const t = useTokens();
  const { isUnlocked } = useDevMode();
  const locked = item.devGated && !isUnlocked;

  if (locked) {
    return (
      <button
        onClick={onLockedClick}
        className="group w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium transition-colors duration-150"
        style={{ fontFamily: "'DM Sans', sans-serif", color: t.textFaint }}
        onMouseEnter={(e) => (e.currentTarget.style.background = t.mutedBtn)}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        <span style={{ color: t.textFaint }}>{item.icon}</span>
        <span className="flex-1 text-left">{item.label}</span>
        <Lock size={10} style={{ color: t.textFaint, opacity: 0.55 }} className="shrink-0" />
      </button>
    );
  }

  return (
    <NavLink
      to={item.to}
      end={item.to === "/dashboard"}
      className="group flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium transition-colors duration-150"
      style={({ isActive }) => ({
        fontFamily: "'DM Sans', sans-serif",
        background: isActive ? t.mutedBtn : "transparent",
        color: isActive ? t.textPrimary : t.textMuted,
      })}
    >
      {({ isActive }) => (
        <>
          <span style={{ color: isActive ? t.violet : t.textFaint, transition: "color 0.15s" }}>
            {item.icon}
          </span>
          <span className="flex-1">{item.label}</span>
          {item.devGated && (
            <span
              className="text-[9px] font-semibold px-1.5 py-0.5 rounded tracking-wide"
              style={{ background: t.accentSoft, color: t.accent, fontFamily: "'DM Mono', monospace", border: `1px solid ${t.accentBorder}` }}
            >
              DEV
            </span>
          )}
          {item.badge && !item.devGated && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ background: t.accentSoft, color: t.violet }}>
              {item.badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}

function SidebarBody({ onLockedDevClick }: { onLockedDevClick: () => void }) {
  const t = useTokens();
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-5 pb-3">
        <Link to="/">
          <div
            className="flex items-center gap-2.5 px-2.5 py-2 rounded-md cursor-pointer transition-colors"
            onMouseEnter={(e) => (e.currentTarget.style.background = t.mutedBtn)}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0" style={{ background: t.cardAlt, border: `1px solid ${t.accentBorder}` }}>
              <KyzenMark violet={t.violet} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold tracking-wide" style={{ color: t.textPrimary, fontFamily: "'DM Mono', monospace" }}>Kyzen</p>
              <p className="text-[10px]" style={{ color: t.textMuted, fontFamily: "'DM Sans', sans-serif" }}>Free Plan</p>
            </div>
            <ChevronDown size={12} style={{ color: t.textFaint }} className="shrink-0" />
          </div>
        </Link>
      </div>

      <div className="px-4 mb-4">
        <div className="flex items-center gap-2 px-2.5 py-2 rounded-md cursor-text" style={{ background: t.inputBg, border: `1px solid ${t.inputBorder}` }}>
          <Search size={12} style={{ color: t.textFaint }} className="shrink-0" />
          <span className="text-[12px] flex-1" style={{ color: t.textFaint, fontFamily: "'DM Sans', sans-serif" }}>Search</span>
          <kbd className="text-[9px] px-1 py-0.5 rounded" style={{ background: t.mutedBtn, color: t.textMuted, fontFamily: "'DM Mono', monospace" }}>⌘K</kbd>
        </div>
      </div>

      <nav className="flex-1 px-3 flex flex-col gap-5 overflow-y-auto">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <p className="text-[10px] font-medium tracking-wider mb-1.5 px-3 uppercase" style={{ color: t.textFaint, fontFamily: "'DM Sans', sans-serif" }}>{section.label}</p>
            <div className="flex flex-col gap-0.5">
              {section.items.map((item) => (
                <DesktopNavLink key={item.to} item={item} onLockedClick={onLockedDevClick} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="mx-4 my-3" style={{ height: 1, background: t.border }} />

      <div className="px-4 pb-4">
        <div
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-md cursor-pointer transition-colors"
          onMouseEnter={(e) => (e.currentTarget.style.background = t.mutedBtn)}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <div className="relative shrink-0">
            <img src="https://i.pravatar.cc/36?u=kyzen" alt="avatar" className="w-7 h-7 rounded-full object-cover" style={{ border: `1px solid ${t.borderMed}` }} />
            <span className="absolute bottom-0 right-0 w-1.5 h-1.5 rounded-full" style={{ background: t.success, border: `1.5px solid ${t.sidebar}` }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-medium truncate" style={{ color: t.textSecondary, fontFamily: "'DM Sans', sans-serif" }}>Ethan Reynolds</p>
            <p className="text-[10px] truncate" style={{ color: t.textMuted, fontFamily: "'DM Sans', sans-serif" }}>ethan@kyzen.gg</p>
          </div>
          <LogOut size={13} style={{ color: t.textFaint }} className="shrink-0" />
        </div>
      </div>
    </div>
  );
}

export default function Sidebar({ onClose: _externalClose }: SidebarProps) {
  const t = useTokens();
  const { isUnlocked } = useDevMode();
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const closeDrawer = () => { setOpen(false); _externalClose?.(); };

  function handleLockedDevClick() { setModalOpen(true); }
  function handleModalUnlocked() { showToast("Developer Mode unlocked 🚀"); }

  let flatIdx = 0;
  const mobileItems: { item: NavItem; sectionLabel?: string; staggerIdx: number }[] = [];
  NAV_SECTIONS.forEach((section) => {
    section.items.forEach((item, i) => {
      mobileItems.push({ item, sectionLabel: i === 0 ? section.label : undefined, staggerIdx: flatIdx++ });
    });
  });
  const userFooterIdx = flatIdx;

  return (
    <>
      <aside className="hidden md:flex flex-col w-55 shrink-0 h-screen transition-colors duration-300" style={{ background: t.sidebar, borderRight: `1px solid ${t.sidebarBorder}` }}>
        <SidebarBody onLockedDevClick={handleLockedDevClick} />
      </aside>

      <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-5 h-14 md:hidden transition-colors duration-300" style={{ background: t.topbar, borderBottom: `1px solid ${t.border}`, backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}>
        <Link to="/" className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: t.cardAlt, border: `1px solid ${t.accentBorder}` }}>
            <KyzenMark violet={t.violet} />
          </div>
          <span className="text-3.25 font-semibold tracking-wide" style={{ color: t.textPrimary, fontFamily: "'DM Mono', monospace" }}>KYZEN</span>
        </Link>
        <button onClick={() => setOpen((p) => !p)} className="relative flex flex-col gap-1.25 p-2" aria-label="Toggle menu">
          <span className="block w-4.5 h-px rounded-full transition-all duration-200" style={{ background: t.textSecondary, transform: open ? "rotate(45deg) translate(4px,4px)" : "none" }} />
          <span className="block w-3.25 h-px rounded-full transition-all duration-200" style={{ background: t.textSecondary, opacity: open ? 0 : 1 }} />
          <span className="block w-4.5 h-px rounded-full transition-all duration-200" style={{ background: t.textSecondary, transform: open ? "rotate(-45deg) translate(4px,-4px)" : "none" }} />
          {!open && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full" style={{ background: t.violet, border: `1.5px solid ${t.sidebar}` }} />}
        </button>
      </div>

      <div className="block md:hidden h-14 shrink-0" />

      <AnimatePresence>
        {open && (
          <motion.div key="mob-menu" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15, ease: "easeOut" }}
            className="fixed inset-x-0 top-14 z-40 md:hidden flex flex-col pb-4 transition-colors duration-300"
            style={{ fontFamily: "'DM Sans', sans-serif", background: t.topbar, backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: `1px solid ${t.border}` }}
          >
            {mobileItems.map(({ item, sectionLabel, staggerIdx }) => {
              const locked = item.devGated && !isUnlocked;
              return (
                <div key={item.to}>
                  {sectionLabel && <p className="text-[10px] font-medium tracking-wider uppercase px-5 pt-4 pb-1" style={{ color: t.textFaint }}>{sectionLabel}</p>}
                  <motion.div initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 + staggerIdx * 0.04, duration: 0.25, ease: [0.16, 1, 0.3, 1] }}>
                    {locked ? (
                      <button onClick={() => { closeDrawer(); handleLockedDevClick(); }} className="w-full flex items-center gap-3 px-5 py-3 text-[13px] transition-colors" style={{ color: t.textFaint, borderBottom: `1px solid ${t.border}` }}>
                        <span style={{ color: t.textFaint }}>{item.icon}</span>
                        <span className="flex-1 text-left">{item.label}</span>
                        <Lock size={10} style={{ color: t.textFaint, opacity: 0.5 }} />
                      </button>
                    ) : (
                      <NavLink to={item.to} end={item.to === "/dashboard"} onClick={closeDrawer}
                        className="flex items-center gap-3 px-5 py-3 text-[13px] transition-colors"
                        style={({ isActive }) => ({ color: isActive ? t.textPrimary : t.textMuted, fontWeight: isActive ? 500 : 400, borderBottom: `1px solid ${t.border}` })}
                      >
                        {({ isActive }) => (
                          <>
                            <span style={{ color: isActive ? t.violet : t.textFaint }}>{item.icon}</span>
                            <span className="flex-1">{item.label}</span>
                            {item.badge && <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ background: t.accentSoft, color: t.violet }}>{item.badge}</span>}
                          </>
                        )}
                      </NavLink>
                    )}
                  </motion.div>
                </div>
              );
            })}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.04 + userFooterIdx * 0.04 }} className="mx-5 my-3" style={{ height: 1, background: t.border }} />
            <motion.div initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.06 + userFooterIdx * 0.04, duration: 0.25, ease: [0.16, 1, 0.3, 1] }} className="mx-4">
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors" onMouseEnter={(e) => (e.currentTarget.style.background = t.mutedBtn)} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                <div className="relative">
                  <img src="https://i.pravatar.cc/36?u=kyzen" alt="avatar" className="w-7 h-7 rounded-full object-cover" style={{ border: `1px solid ${t.borderMed}` }} />
                  <span className="absolute bottom-0 right-0 w-1.5 h-1.5 rounded-full" style={{ background: t.success, border: `1.5px solid ${t.sidebar}` }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-medium truncate" style={{ color: t.textSecondary }}>Ethan Reynolds</p>
                  <p className="text-[10px] truncate" style={{ color: t.textMuted }}>ethan@kyzen.gg</p>
                </div>
                <LogOut size={13} style={{ color: t.textFaint }} className="shrink-0" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <DevModeModal open={modalOpen} onClose={() => setModalOpen(false)} onUnlocked={handleModalUnlocked} />
    </>
  );
}

function KyzenMark({ violet }: { violet: string }) {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
      <path d="M3 3L8 8L3 13" stroke={violet} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 3L13 8L8 13" stroke={violet} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
    </svg>
  );
}
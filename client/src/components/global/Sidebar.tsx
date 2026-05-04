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
} from "lucide-react";

type NavSection = { label: string; items: NavItem[] };
type NavItem = { icon: React.ReactNode; label: string; to: string; badge?: string | number };
interface SidebarProps { onClose?: () => void }

const NAV_SECTIONS: NavSection[] = [
  {
    label: "Main Menu",
    items: [
      { icon: <LayoutDashboard size={15} />, label: "Dashboard", to: "/dashboard" },
      { icon: <Swords size={15} />, label: "Quests", to: "/dashboard/quests", badge: 3 },
      { icon: <ScrollText size={15} />, label: "Journal", to: "/dashboard/journal" },
    ],
  },
  {
    label: "Progress",
    items: [
      { icon: <Trophy size={15} />, label: "Leaderboard", to: "/dashboard/leaderboard" },
      { icon: <User size={15} />, label: "Profile", to: "/dashboard/profile" },
    ],
  },
  {
    label: "Settings",
    items: [
      { icon: <Settings size={15} />, label: "Settings", to: "/dashboard/settings" },
    ],
  },
];

function DesktopNavLink({ item }: { item: NavItem }) {
  return (
    <NavLink
      to={item.to}
      end={item.to === "/dashboard"}
      className={({ isActive }) =>
        `group flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium transition-colors duration-150 relative ${
          isActive
            ? "bg-white/6 text-white"
            : "text-[#666] hover:text-[#aaa] hover:bg-white/3"
        }`
      }
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {({ isActive }) => (
        <>
          <span className={isActive ? "text-[#8b5cf6]" : "text-[#444] group-hover:text-[#666] transition-colors"}>
            {item.icon}
          </span>
          <span className="flex-1">{item.label}</span>
          {item.badge && (
            <span
              className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
              style={{ background: "rgba(139,92,246,0.12)", color: "#8b5cf6" }}
            >
              {item.badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}

function SidebarBody() {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 pt-5 pb-3">
        <Link to="/">
          <div
            className="flex items-center gap-2.5 px-2.5 py-2 rounded-md cursor-pointer hover:bg-white/3 transition-colors"
          >
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
              style={{ background: "#1a1a24", border: "1px solid rgba(139,92,246,0.25)" }}
            >
              <KyzenMark />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-white tracking-wide" style={{ fontFamily: "'DM Mono', monospace" }}>KYZEN</p>
              <p className="text-[10px] text-[#444]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Free Plan</p>
            </div>
            <ChevronDown size={12} className="text-[#333] shrink-0" />
          </div>
        </Link>
      </div>

      {/* Search */}
      <div className="px-4 mb-4">
        <div
          className="flex items-center gap-2 px-2.5 py-2 rounded-md cursor-text"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <Search size={12} className="text-[#444] shrink-0" />
          <span className="text-[12px] text-[#333] flex-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>Search</span>
          <kbd
            className="text-[9px] px-1 py-0.5 rounded"
            style={{ background: "rgba(255,255,255,0.04)", color: "#444", fontFamily: "'DM Mono', monospace" }}
          >
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 flex flex-col gap-5 overflow-y-auto">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <p
              className="text-[10px] font-medium tracking-wider mb-1.5 px-3 uppercase"
              style={{ color: "#333", fontFamily: "'DM Sans', sans-serif" }}
            >
              {section.label}
            </p>
            <div className="flex flex-col gap-0.5">
              {section.items.map((item) => (
                <DesktopNavLink key={item.to} item={item} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Divider */}
      <div className="mx-4 my-3" style={{ height: 1, background: "rgba(255,255,255,0.05)" }} />

      {/* User */}
      <div className="px-4 pb-4">
        <div
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-md cursor-pointer group hover:bg-white/3 transition-colors"
        >
          <div className="relative shrink-0">
            <img
              src="https://i.pravatar.cc/36?u=kyzen"
              alt="avatar"
              className="w-7 h-7 rounded-full object-cover"
              style={{ border: "1px solid rgba(255,255,255,0.08)" }}
            />
            <span
              className="absolute bottom-0 right-0 w-1.5 h-1.5 rounded-full"
              style={{ background: "#22c55e", border: "1.5px solid #0B0B0F" }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-medium text-[#ccc] truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>Ethan Reynolds</p>
            <p className="text-[10px] text-[#444] truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>ethan@kyzen.gg</p>
          </div>
          <LogOut size={13} className="text-[#333] group-hover:text-[#666] transition-colors shrink-0" />
        </div>
      </div>
    </div>
  );
}

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
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex flex-col w-55 shrink-0 h-screen"
        style={{
          background: "#0e0e12",
          borderRight: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <SidebarBody />
      </aside>

      {/* Mobile top bar */}
      <div
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-5 h-14 md:hidden"
        style={{
          background: "rgba(11,11,15,0.95)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        <Link to="/" className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center"
            style={{ background: "#1a1a24", border: "1px solid rgba(139,92,246,0.25)" }}
          >
            <KyzenMark />
          </div>
          <span className="text-3.25 font-semibold text-white tracking-wide" style={{ fontFamily: "'DM Mono', monospace" }}>KYZEN</span>
        </Link>

        <button onClick={() => setOpen((p) => !p)} className="relative flex flex-col gap-1.25 p-2" aria-label="Toggle menu">
          <span className="block w-4.5 h-px bg-white/40 rounded-full transition-all duration-200"
            style={{ transform: open ? "rotate(45deg) translate(4px,4px)" : "none" }} />
          <span className="block w-3.25 h-px bg-white/40 rounded-full transition-all duration-200"
            style={{ opacity: open ? 0 : 1 }} />
          <span className="block w-4.5 h-px bg-white/40 rounded-full transition-all duration-200"
            style={{ transform: open ? "rotate(-45deg) translate(4px,-4px)" : "none" }} />
          {!open && (
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
              style={{ background: "#8b5cf6", border: "1.5px solid #0B0B0F" }} />
          )}
        </button>
      </div>

      <div className="block md:hidden h-14 shrink-0" />

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mob-menu"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="fixed inset-x-0 top-14 z-40 md:hidden flex flex-col pb-4"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              background: "rgba(11,11,15,0.98)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {mobileItems.map(({ item, sectionLabel, staggerIdx }) => (
              <div key={item.to}>
                {sectionLabel && (
                  <p className="text-[10px] font-medium tracking-wider uppercase px-5 pt-4 pb-1"
                    style={{ color: "#333" }}>
                    {sectionLabel}
                  </p>
                )}
                <motion.div
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 + staggerIdx * 0.04, duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                >
                  <NavLink
                    to={item.to}
                    end={item.to === "/dashboard"}
                    onClick={closeDrawer}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-5 py-3 text-[13px] border-b border-white/4 transition-colors ${
                        isActive ? "text-white font-medium" : "text-[#555] font-normal hover:text-[#888]"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span className={isActive ? "text-[#8b5cf6]" : "text-[#333]"}>{item.icon}</span>
                        <span className="flex-1">{item.label}</span>
                        {item.badge && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                            style={{ background: "rgba(139,92,246,0.12)", color: "#8b5cf6" }}>
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                </motion.div>
              </div>
            ))}

            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.04 + userFooterIdx * 0.04 }}
              className="mx-5 my-3"
              style={{ height: 1, background: "rgba(255,255,255,0.05)" }}
            />

            <motion.div
              initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.06 + userFooterIdx * 0.04, duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="mx-4"
            >
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-md group hover:bg-white/3 transition-colors">
                <div className="relative">
                  <img src="https://i.pravatar.cc/36?u=kyzen" alt="avatar"
                    className="w-7 h-7 rounded-full object-cover"
                    style={{ border: "1px solid rgba(255,255,255,0.08)" }} />
                  <span className="absolute bottom-0 right-0 w-1.5 h-1.5 rounded-full"
                    style={{ background: "#22c55e", border: "1.5px solid #0B0B0F" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-medium text-[#ccc] truncate">Ethan Reynolds</p>
                  <p className="text-[10px] text-[#444] truncate">ethan@kyzen.gg</p>
                </div>
                <LogOut size={13} className="text-[#333] group-hover:text-[#666] transition-colors shrink-0" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function KyzenMark() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
      <path d="M3 3L8 8L3 13" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 3L13 8L8 13" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
    </svg>
  );
}
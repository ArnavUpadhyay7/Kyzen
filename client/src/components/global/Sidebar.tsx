import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  User,
  Trophy,
  ScrollText,
  Settings,
  LogOut,
  ChevronDown,
  Search,
  Terminal,
  Lock,
} from "lucide-react";
import { useDevMode } from "../../state/devmode/DevModeContext";
import DevModeModal from "../dashboard/DevModeModal";
import { DashboardBadge } from "../dashboard/ui";
import { cn } from "../../lib/utils";

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
      { icon: <ScrollText size={15} />,      label: "Workspace",   to: "/dashboard/workspace" },
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

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "group flex items-center gap-2.5 rounded-lg border px-3 py-2 text-[13px] font-medium font-dash-sans transition-all duration-150",
    isActive
      ? "border-dash-nav-active-border bg-dash-nav-active text-dash-nav-active-text"
      : "border-transparent text-dash-muted hover:bg-dash-muted-btn",
  );

function DesktopNavLink({ item, onLockedClick }: { item: NavItem; onLockedClick: () => void }) {
  const { isUnlocked } = useDevMode();
  const locked = item.devGated && !isUnlocked;

  if (locked) {
    return (
      <button
        type="button"
        onClick={onLockedClick}
        className="group flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium font-dash-sans text-dash-faint transition-all duration-150 hover:bg-dash-muted-btn"
      >
        <span className="text-dash-faint">{item.icon}</span>
        <span className="flex-1 text-left">{item.label}</span>
        <Lock size={10} className="shrink-0 text-dash-faint opacity-55" />
      </button>
    );
  }

  return (
    <NavLink to={item.to} end={item.to === "/dashboard"} className={navLinkClass}>
      {({ isActive }) => (
        <>
          <span
            className={cn(
              "transition-colors duration-150",
              isActive ? "text-dash-nav-active-icon" : "text-dash-faint group-hover:text-dash-muted",
            )}
          >
            {item.icon}
          </span>
          <span className="flex-1">{item.label}</span>
          {item.devGated && <DashboardBadge variant="accent">DEV</DashboardBadge>}
          {item.badge && !item.devGated && (
            <span
              className={cn(
                "min-w-4.5 rounded-full px-1.5 py-0.5 text-center text-[10px] font-semibold font-dash-mono text-dash-violet",
                isActive ? "bg-dash-nav-badge" : "bg-dash-accent-soft",
              )}
            >
              {item.badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}

function SidebarBody({ onLockedDevClick }: { onLockedDevClick: () => void }) {
  return (
    <div className="relative flex h-full flex-col">

      <div className="relative z-10 px-4 pt-5 pb-3">
        <Link to="/">
          <div className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 transition-all duration-150 hover:bg-dash-muted-btn">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-bold text-white shadow-[0_0_16px_rgba(99,102,241,0.4)]">
              K
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-bold tracking-[0.06em] text-dash-primary font-dash-mono">
                Kyzen
              </p>
              <p className="text-[10px] text-dash-muted font-dash-sans">
                RPG for Developers
              </p>
            </div>
            <ChevronDown size={12} className="shrink-0 text-dash-faint" />
          </div>
        </Link>
      </div>

      <div className="relative z-10 mb-4 px-4">
        <div className="flex cursor-text items-center gap-2 rounded-lg border border-dash-input-border bg-dash-input px-2.5 py-2">
          <Search size={12} className="shrink-0 text-dash-faint" />
          <span className="flex-1 text-[12px] text-dash-faint font-dash-sans">Search</span>
          <kbd className="rounded bg-dash-muted-btn px-1 py-0.5 text-[9px] text-dash-muted font-dash-mono">
            ⌘K
          </kbd>
        </div>
      </div>

      <nav className="relative z-10 flex flex-1 flex-col gap-5 overflow-y-auto px-3">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <p className="mb-2 px-3 text-[10px] font-semibold tracking-[0.1em] text-dash-faint uppercase font-dash-sans">
              {section.label}
            </p>
            <div className="flex flex-col gap-0.5">
              {section.items.map((item) => (
                <DesktopNavLink key={item.to} item={item} onLockedClick={onLockedDevClick} />
              ))}
            </div>
          </div>
        ))}
      </nav>

    </div>
  );
}

export default function Sidebar({ onClose: _externalClose }: SidebarProps) {
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
      <aside className="hidden h-screen w-56 shrink-0 flex-col border-r border-dash-sidebar-border bg-dash-sidebar transition-colors duration-300 md:flex">
        <SidebarBody onLockedDevClick={handleLockedDevClick} />
      </aside>

      <div className="fixed top-0 right-0 left-0 z-40 flex h-14 items-center justify-between border-b border-dash-border bg-dash-topbar/95 px-5 backdrop-blur-md transition-colors duration-300 md:hidden">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 text-xs font-bold text-white">
            K
          </div>
          <span className="text-[14px] font-bold tracking-widest text-dash-primary font-dash-mono">
            KYZEN
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen((p) => !p)}
          className="relative flex flex-col gap-1.5 p-2"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span
            className={cn(
              "block h-px w-5 rounded-full bg-dash-secondary transition-all duration-200",
              open && "translate-x-1 translate-y-1.5 rotate-45",
            )}
          />
          <span
            className={cn(
              "block h-px w-3.5 rounded-full bg-dash-secondary transition-all duration-200",
              open && "opacity-0",
            )}
          />
          <span
            className={cn(
              "block h-px w-5 rounded-full bg-dash-secondary transition-all duration-200",
              open && "-translate-y-1.5 translate-x-1 -rotate-45",
            )}
          />
          {!open && (
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full border-[1.5px] border-dash-sidebar bg-dash-violet" />
          )}
        </button>
      </div>

      <div className="block h-14 shrink-0 md:hidden" />

      <AnimatePresence>
        {open && (
          <motion.div
            key="mob-menu"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="fixed inset-x-0 top-14 z-40 flex flex-col border-b border-dash-border bg-dash-topbar/95 pb-4 font-dash-sans backdrop-blur-xl transition-colors duration-300 md:hidden"
          >
            {mobileItems.map(({ item, sectionLabel, staggerIdx }) => {
              const locked = item.devGated && !isUnlocked;
              return (
                <div key={item.to}>
                  {sectionLabel && (
                    <p className="px-5 pt-4 pb-1 text-[10px] font-medium tracking-wider text-dash-faint uppercase">
                      {sectionLabel}
                    </p>
                  )}
                  <motion.div
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 + staggerIdx * 0.04, duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {locked ? (
                      <button
                        type="button"
                        onClick={() => { closeDrawer(); handleLockedDevClick(); }}
                        className="flex w-full items-center gap-3 border-b border-dash-border px-5 py-3 text-[13px] text-dash-faint transition-colors"
                      >
                        <span className="text-dash-faint">{item.icon}</span>
                        <span className="flex-1 text-left">{item.label}</span>
                        <Lock size={10} className="text-dash-faint opacity-50" />
                      </button>
                    ) : (
                      <NavLink
                        to={item.to}
                        end={item.to === "/dashboard"}
                        onClick={closeDrawer}
                        className={({ isActive }) =>
                          cn(
                            "flex items-center gap-3 border-b border-dash-border px-5 py-3 text-[13px] transition-colors",
                            isActive
                              ? "bg-dash-nav-active/60 font-medium text-dash-nav-active-text"
                              : "font-normal text-dash-muted",
                          )
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <span className={isActive ? "text-dash-violet" : "text-dash-faint"}>
                              {item.icon}
                            </span>
                            <span className="flex-1">{item.label}</span>
                            {item.badge && (
                              <DashboardBadge variant="violet">{item.badge}</DashboardBadge>
                            )}
                          </>
                        )}
                      </NavLink>
                    )}
                  </motion.div>
                </div>
              );
            })}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.04 + userFooterIdx * 0.04 }}
              className="mx-5 my-3 h-px bg-dash-border"
            />
            <motion.div
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.06 + userFooterIdx * 0.04, duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="mx-4"
            >
              <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-dash-muted-btn">
                <div className="relative">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border border-dash-border-med bg-gradient-to-br from-indigo-500 to-violet-500 text-xs font-bold text-white">
                    ER
                  </div>
                  <span className="absolute right-0 bottom-0 h-1.5 w-1.5 rounded-full border-[1.5px] border-dash-sidebar bg-dash-success" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12px] font-medium text-dash-secondary">Ethan Reynolds</p>
                  <p className="truncate text-[10px] text-dash-muted">ethan@kyzen.gg</p>
                </div>
                <LogOut size={13} className="shrink-0 text-dash-faint" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <DevModeModal open={modalOpen} onClose={() => setModalOpen(false)} onUnlocked={handleModalUnlocked} />
    </>
  );
}

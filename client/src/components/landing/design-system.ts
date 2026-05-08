// ─── PALETTE ──────────────────────────────────────────────────────────────────
export const palette = {
  // Core canvas — ONE background across the whole app
  canvas: "#080612",          // single dark bg, every section sits on this
  canvasMid: "#0a0818",       // subtle elevation — cards, panels
  canvasHigh: "#0e0c1e",      // floating elements, modals

  // Purple spectrum — the single accent ramp
  violet50:  "#f3f0ff",
  violet100: "#e5deff",
  violet200: "#c8b8ff",
  violet400: "#9d7ef5",
  violet500: "#8b5cf6",       // primary interactive
  violet600: "#7c3aed",       // CTA buttons
  violet700: "#6d28d9",       // deep glow
  violet800: "#4c1d95",
  violet900: "#2e1065",

  // Secondary tints — used sparingly
  indigo400: "#818cf8",
  fuchsia400: "#e879f9",
  sky300:    "#7dd3fc",

  // Neutral text scale
  white:     "#ffffff",
  text90:    "rgba(255,255,255,0.90)",
  text70:    "rgba(255,255,255,0.70)",
  text50:    "rgba(255,255,255,0.50)",
  text35:    "rgba(255,255,255,0.35)",
  text20:    "rgba(255,255,255,0.20)",
  text08:    "rgba(255,255,255,0.08)",
  text04:    "rgba(255,255,255,0.04)",
} as const;

// ─── GRADIENTS ────────────────────────────────────────────────────────────────
export const gradients = {
  // The app's signature purple gradient — used consistently for text, buttons
  purpleText: "linear-gradient(135deg,#7c3aed 0%,#9333ea 40%,#a855f7 70%,#c084fc 100%)",

  // Button fill
  buttonFill: "linear-gradient(135deg,#7c3aed 0%,#9333ea 60%,#a855f7 100%)",

  // Card/panel top-edge shimmer — consistent across ALL cards
  cardEdgeShimmer: "linear-gradient(90deg, transparent 10%, rgba(139,92,246,0.25) 50%, transparent 90%)",
  cardEdgeShimmerFeatured: "linear-gradient(90deg, transparent 5%, rgba(139,92,246,0.65) 50%, transparent 95%)",

  // Ambient scene glows — composited in Landing, not per-section
  sceneCenter: "radial-gradient(ellipse 90% 50% at 50% 30%, rgba(88,28,220,0.14) 0%, transparent 65%)",
  sceneLeft:   "radial-gradient(ellipse 50% 80% at 0% 50%, rgba(0,0,0,0.5) 0%, transparent 60%)",
  sceneBottom: "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(88,28,220,0.18) 0%, transparent 65%)",
} as const;

// ─── SHADOWS ─────────────────────────────────────────────────────────────────
export const shadows = {
  card:    "0 4px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)",
  cardFeatured: "0 0 40px rgba(109,40,217,0.2), 0 4px 24px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.07)",
  button:  "0 0 32px rgba(124,58,237,0.5), 0 4px 16px rgba(0,0,0,0.4)",
  glow:    "0 0 60px rgba(109,40,217,0.22)",
} as const;

// ─── BORDERS ─────────────────────────────────────────────────────────────────
export const borders = {
  subtle:   "1px solid rgba(255,255,255,0.06)",
  medium:   "1px solid rgba(255,255,255,0.10)",
  accent:   "1px solid rgba(139,92,246,0.28)",
  featured: "1px solid rgba(139,92,246,0.45)",
} as const;

// ─── TYPOGRAPHY ──────────────────────────────────────────────────────────────
export const typography = {
  display: "'Barlow', sans-serif",  // headings, big numbers
  body:    "'DM Sans', sans-serif", // UI text, labels, descriptions
  mono:    "ui-monospace, 'JetBrains Mono', monospace", // code, tags
} as const;

// ─── SPACING ─────────────────────────────────────────────────────────────────
// Sections use consistent vertical rhythm — no arbitrary py values
export const spacing = {
  sectionY: "py-28",     // all section vertical padding — SAME
  contentX: "px-4 sm:px-6",
  maxWidth:  "max-w-6xl mx-auto",
} as const;

// ─── ANIMATION PRESETS ────────────────────────────────────────────────────────
export const anim = {
  fadeUp: (delay = 0) => ({
    initial: { opacity: 0, y: 36 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.72, delay, ease: [0.22, 1, 0.36, 1] as any },
  }),
  fadeIn: (delay = 0) => ({
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true },
    transition: { duration: 0.6, delay },
  }),
} as const;
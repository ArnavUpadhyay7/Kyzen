// ─── PALETTE ──────────────────────────────────────────────────────────────────
export const palette = {
  // Core canvas — pure black base
  canvas:    "#080808",         // single dark bg, every section sits on this
  canvasMid: "#0d0d0d",         // subtle elevation — cards, panels
  canvasHigh: "#141414",        // floating elements, modals

  // White/grey spectrum — the single accent ramp (replaces purple)
  white:     "#ffffff",
  grey50:    "#f9f9f9",
  grey100:   "#e8e8e8",
  grey200:   "#cccccc",
  grey300:   "#aaaaaa",
  grey400:   "#888888",
  grey500:   "#666666",
  grey600:   "#444444",
  grey700:   "#2a2a2a",
  grey800:   "#1a1a1a",
  grey900:   "#111111",

  // Neutral text scale
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
  // White-to-grey text gradient for headings
  whiteText: "linear-gradient(135deg, #ffffff 0%, #e0e0e0 60%, #b8b8b8 100%)",

  // Button fill — solid white for primary CTA
  buttonFill: "#ffffff",

  // Card/panel top-edge shimmer — white toned
  cardEdgeShimmer: "linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.12) 50%, transparent 90%)",
  cardEdgeShimmerFeatured: "linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.30) 50%, transparent 95%)",

  // Ambient scene glows — white/grey spotlight from top center (matches Vantrix)
  sceneCenter: "radial-gradient(ellipse 80% 55% at 50% 0%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 40%, transparent 70%)",
  sceneLeft:   "radial-gradient(ellipse 50% 80% at 0% 50%, rgba(0,0,0,0.5) 0%, transparent 60%)",
  sceneBottom: "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(20,20,20,0.95) 0%, transparent 65%)",
} as const;

// ─── SHADOWS ─────────────────────────────────────────────────────────────────
export const shadows = {
  card:         "0 4px 24px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
  cardFeatured: "0 0 40px rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.10)",
  button:       "0 0 24px rgba(255,255,255,0.18), 0 4px 16px rgba(0,0,0,0.5)",
  glow:         "0 0 60px rgba(255,255,255,0.08)",
} as const;

// ─── BORDERS ─────────────────────────────────────────────────────────────────
export const borders = {
  subtle:   "1px solid rgba(255,255,255,0.06)",
  medium:   "1px solid rgba(255,255,255,0.12)",
  accent:   "1px solid rgba(255,255,255,0.22)",
  featured: "1px solid rgba(255,255,255,0.40)",
} as const;

// ─── TYPOGRAPHY ──────────────────────────────────────────────────────────────
export const typography = {
  display: "'Barlow', sans-serif",  // headings, big numbers
  body:    "'DM Sans', sans-serif", // UI text, labels, descriptions
  mono:    "ui-monospace, 'JetBrains Mono', monospace", // code, tags
} as const;

// ─── SPACING ─────────────────────────────────────────────────────────────────
export const spacing = {
  sectionY: "py-28",
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
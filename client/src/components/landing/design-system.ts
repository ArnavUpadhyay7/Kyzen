// ─── PALETTE ──────────────────────────────────────────────────────────────────
export const palette = {
  canvas:      "#02040A",
  canvasMid:   "#050816",
  canvasHigh:  "#0A0F1E",

  white:       "#ffffff",
  text90:      "rgba(245,247,255,0.90)",
  text70:      "rgba(245,247,255,0.70)",
  text62:      "rgba(255,255,255,0.62)",
  text35:      "rgba(255,255,255,0.35)",
  text20:      "rgba(255,255,255,0.20)",
  text08:      "rgba(255,255,255,0.08)",

  blue:        "#4D7CFF",
  blueMid:     "#6EA8FF",
  blueDeep:    "#5B7FFF",
  purple:      "#7C4DFF",
} as const;

// ─── GRADIENTS ────────────────────────────────────────────────────────────────
export const gradients = {
  headingWhite: "linear-gradient(180deg, #F5F7FF 0%, #C8CFEE 100%)",
  headingGrey:  "linear-gradient(180deg, #E0E8FF 0%, #A8B8EE 100%)",

  // Hero headline accent — blue → violet (used on "PROGRESS")
  progressWord: "linear-gradient(135deg, #B7CCFF 0%, #7AA2FF 45%, #5B7FFF 100%)",

  // Section heading accent — purple/violet (used by SectionHeading)
  // Kept as a separate key so section headings can stay purple-toned
  // while the hero "PROGRESS" word stays blue-toned
  purpleText: "linear-gradient(135deg, #a78bfa 0%, #7C4DFF 55%, #6D28D9 100%)",

  gridLines:    "rgba(88,120,255,0.08)",

  spotlightInner: "rgba(77,124,255,0.42)",
  spotlightMid:   "rgba(59,130,246,0.24)",

  ctaGlow:    "rgba(110,168,255,0.55)",
  dashBorder: "rgba(122,162,255,0.42)",
  dashGlow:   "rgba(76,110,245,0.35)",
} as const;

// ─── BORDERS ─────────────────────────────────────────────────────────────────
// Used by SectionBadge and any card/panel components
export const borders = {
  subtle:   "1px solid rgba(255,255,255,0.06)",
  medium:   "1px solid rgba(255,255,255,0.11)",
  accent:   "1px solid rgba(109,40,217,0.35)",   // purple accent — SectionBadge
  blue:     "1px solid rgba(77,124,255,0.28)",
  blueMid:  "1px solid rgba(110,168,255,0.42)",
  featured: "1px solid rgba(255,255,255,0.22)",
} as const;

// ─── TYPOGRAPHY ──────────────────────────────────────────────────────────────
export const typography = {
  // Barlow Condensed for hero/display headings (ultra-bold condensed)
  // Components should import weight 700/800/900 from Google Fonts:
  // "Barlow+Condensed:wght@700;800;900"
  display: "'Barlow Condensed', 'Barlow', sans-serif",

  // DM Sans for body copy, labels, subtitles
  body:    "'DM Sans', 'Inter', sans-serif",

  // Monospace for stats, code, tags
  mono:    "ui-monospace, 'JetBrains Mono', monospace",
} as const;

// ─── SHADOWS ─────────────────────────────────────────────────────────────────
export const shadows = {
  card:         "0 4px 24px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05)",
  cardFeatured: "0 0 40px rgba(77,124,255,0.08), 0 4px 24px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.08)",
  button:       "0 6px 28px rgba(110,168,255,0.40), 0 0 44px rgba(110,168,255,0.22)",
  glow:         "0 0 60px rgba(77,124,255,0.10)",
} as const;

// ─── SPACING ─────────────────────────────────────────────────────────────────
export const spacing = {
  sectionY: "py-28",
  contentX: "px-4 sm:px-6",
  maxWidth:  "max-w-6xl mx-auto",
} as const;

// ─── ANIMATION PRESETS ───────────────────────────────────────────────────────
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
import { borders, typography } from "../../design-system";

export const SectionBadge = ({ text }: { text: string }) => (
  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5"
    style={{ background: "rgba(109,40,217,0.12)", border: borders.accent }}>
    <span style={{ color: "#a78bfa", fontSize: 12 }}>✦</span>
    <span className="font-medium tracking-widest uppercase"
      style={{ fontSize: 10, color: "rgba(167,139,250,0.85)", letterSpacing: "0.14em", fontFamily: typography.body }}>
      {text}
    </span>
  </div>
);
import { gradients, typography } from "../../design-system";

export const SectionHeading = ({ white, purple, sub }: { white: string; purple: string; sub: string }) => (
  <>
    <h2 className="font-black uppercase text-white leading-none mb-4"
      style={{ fontSize: "clamp(2.4rem,5.5vw,4.2rem)", fontFamily: typography.display, letterSpacing: "-0.02em" }}>
      {white}{" "}
      <span style={{ background: gradients.purpleText, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
        {purple}
      </span>
    </h2>
    <p className="max-w-lg mx-auto text-center leading-relaxed"
      style={{ fontSize: "clamp(0.85rem,1.3vw,0.95rem)", color: "rgba(190,175,230,0.45)", fontFamily: typography.body }}>
      {sub}
    </p>
  </>
);
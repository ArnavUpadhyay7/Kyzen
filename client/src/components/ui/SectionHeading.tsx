export const SectionHeading = ({
  white,
  purple,
  sub,
}: {
  white: string;
  purple: string;
  sub: string;
}) => (
  <>
    <h2 className="font-landing-display font-black uppercase text-landing-white leading-none mb-4 text-[clamp(2.4rem,5.5vw,4.2rem)] tracking-[-0.02em]">
      {white}{" "}
      <span className="text-gradient-landing-purple">{purple}</span>
    </h2>
    <p className="max-w-lg mx-auto text-center leading-relaxed font-landing-body text-[clamp(0.85rem,1.3vw,0.95rem)] text-[rgba(190,175,230,0.45)]">
      {sub}
    </p>
  </>
);

export const SectionBadge = ({ text }: { text: string }) => (
  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 bg-landing-badge-purple-bg border border-landing-border-purple">
    <span className="text-[#a78bfa] text-xs">✦</span>
    <span className="font-landing-body font-medium tracking-[0.14em] uppercase text-[10px] text-[rgba(167,139,250,0.85)]">
      {text}
    </span>
  </div>
);

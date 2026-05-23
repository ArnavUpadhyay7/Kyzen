export default function HeroScene() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-landing-surface">
      <div className="absolute inset-0 pointer-events-none bg-landing-hero-grid landing-hero-grid-breathe z-[1]" />

      <div className="absolute top-0 left-0 w-[72vw] h-[85vh] pointer-events-none bg-landing-spotlight-outer blur-[80px] origin-top-left spotlight-breathe z-[3]" />
      <div className="absolute top-0 left-0 w-[48vw] h-[65vh] pointer-events-none bg-landing-spotlight-mid blur-[55px] spotlight-breathe-delay-1 z-[4]" />
      <div className="absolute -top-10 -left-10 w-80 h-80 pointer-events-none bg-landing-spotlight-core blur-[38px] spotlight-breathe-delay-05 z-[5]" />

      <div className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none bg-landing-vignette-bottom z-[6]" />
    </div>
  );
}

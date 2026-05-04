import { borders, gradients, shadows, anim } from "../../design-system";
import {motion} from "framer-motion";
const { fadeUp } = anim;

type CardProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  featured?: boolean;
  accentColor?: string;
  hover?: boolean;
};

export const Card = ({ children, className = "", delay = 0, featured = false, accentColor, hover = true }: CardProps) => (
  <motion.div
    {...fadeUp(delay)}
    whileHover={hover ? { y: -4, scale: 1.008 } : undefined}
    transition={{ type: "spring", stiffness: 280, damping: 28 }}
    className={`relative rounded-2xl overflow-hidden ${className}`}
    style={{
      background: featured ? "rgba(14,6,38,0.85)" : "rgba(10,5,28,0.65)",
      border: featured ? borders.featured : borders.subtle,
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      boxShadow: featured ? shadows.cardFeatured : shadows.card,
    }}
  >
    <div className="absolute inset-x-0 top-0 h-px pointer-events-none z-10"
      style={{ background: featured ? gradients.cardEdgeShimmerFeatured : gradients.cardEdgeShimmer }} />
    {accentColor && (
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-400"
        style={{ background: `radial-gradient(ellipse at 50% 0%, ${accentColor}18, transparent 55%)` }} />
    )}
    {children}
  </motion.div>
);
import { anim } from "../landing/design-system";
import { motion } from "framer-motion";

const { fadeUp } = anim;

type CardProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  featured?: boolean;
  hover?: boolean;
};

export const Card = ({
  children,
  className = "",
  delay = 0,
  featured = false,
  hover = true,
}: CardProps) => (
  <motion.div
    {...fadeUp(delay)}
    whileHover={hover ? { y: -4, scale: 1.008 } : undefined}
    transition={{ type: "spring", stiffness: 280, damping: 28 }}
    className={[
      "relative rounded-2xl overflow-hidden backdrop-blur-[20px]",
      featured
        ? "bg-landing-card-featured border border-landing-border-featured shadow-landing-card-featured"
        : "bg-landing-card-default border border-landing-border-subtle shadow-landing-card",
      className,
    ].join(" ")}
  >
    <div
      className={[
        "absolute inset-x-0 top-0 h-px pointer-events-none z-10",
        featured ? "bg-landing-edge-blue-bright" : "bg-landing-edge-blue",
      ].join(" ")}
    />
    {children}
  </motion.div>
);

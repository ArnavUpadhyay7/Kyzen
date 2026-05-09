import { motion } from "framer-motion";
import { palette } from "./design-system";
import backgroundImage from "../../assets/background_image.png";

export default function HeroScene() {
  return (
    <div
      className="absolute inset-0 z-0 overflow-hidden"
      style={{ backgroundColor: palette.canvas }}
    >
      {/* Background image — slow breathe */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center 22%",
          backgroundRepeat: "no-repeat",
          transformOrigin: "center 30%",
        }}
        animate={{ opacity: [0.92, 1, 0.92], scale: [1, 1.025, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Top-to-bottom scrim — keeps headline zone dark */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, rgba(6,4,14,0.58) 0%, rgba(6,4,14,0.12) 28%, transparent 52%, rgba(6,4,14,0.55) 100%)",
        }}
      />

      {/* Mid atmospheric haze band */}
      <motion.div
        className="absolute inset-x-0 pointer-events-none"
        style={{
          top: "38%",
          height: "28%",
          background: "radial-gradient(ellipse 90% 100% at 50% 50%, rgba(60,20,110,0.1) 0%, transparent 70%)",
          filter: "blur(32px)",
        }}
        animate={{ opacity: [0.55, 0.72, 0.55], y: [0, -8, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Edge vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 95% 90% at 50% 50%, transparent 42%, rgba(6,4,14,0.62) 100%)",
        }}
      />
    </div>
  );
}
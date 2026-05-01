import { useRef } from "react";
import {motion, useScroll, useTransform} from "framer-motion";

const Footer = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end","end start"] });
  const scale = useTransform(scrollYProgress, [0.1,0.5], [0.92,1]);
  const opacity = useTransform(scrollYProgress, [0.1,0.4], [0,1]);

  const GlowOrb = ({ className }: { className: string }) => (
  <div className={`absolute rounded-full blur-[120px] pointer-events-none select-none ${className}`} />
  );
  
  const Starfield = ({ count = 60 }: { count?: number }) => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div key={i} className="absolute rounded-full bg-white"
          style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, width: Math.random() > 0.9 ? 2 : 1, height: Math.random() > 0.9 ? 2 : 1, opacity: Math.random() * 0.35 + 0.05 }}
          animate={{ opacity: [null as any, 0.04, 0.45] }}
          transition={{ duration: 2 + Math.random() * 5, repeat: Infinity, repeatType: "reverse", delay: Math.random() * 6 }}
        />
      ))}
    </div>
  );

  return (
    <footer ref={sectionRef} className="relative min-h-screen flex flex-col items-center justify-center py-40 overflow-hidden bg-[#02020c]">
      <Starfield count={70} />
      <GlowOrb className="w-225 h-150 bg-purple-900/25 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      <motion.div style={{ scale, opacity }} className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <div className="text-purple-400/60 text-[11px] font-mono tracking-[0.3em] uppercase mb-6">Your Journey Begins</div>
        <h2 className="text-6xl md:text-[6rem] font-black text-white leading-none mb-8" style={{ fontFamily:"'Syne',sans-serif" }}>
          Ready to<br/>
          <span className="bg-linear-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">level up?</span>
        </h2>
        <p className="text-white/30 text-lg mb-12 max-w-lg mx-auto">Join thousands of developers who transformed their daily grind into a legendary quest.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <motion.button whileHover={{scale:1.07,boxShadow:"0 0 70px rgba(168,85,247,0.55)"}} whileTap={{scale:0.96}}
            className="px-12 py-5 rounded-xl font-black text-white text-[11px] tracking-widest uppercase transition-all"
            style={{background:"linear-gradient(135deg,#7c3aed,#a855f7,#c026d3)",boxShadow:"0 0 50px rgba(168,85,247,0.4)"}}>
            Create Your Character
          </motion.button>
          <button className="text-white/30 text-[11px] font-mono tracking-widest uppercase hover:text-white/60 transition-colors">Browse Guilds →</button>
        </div>
        <div className="text-white/20 text-[11px] font-mono tracking-widest">Free to start · No credit card required · Season 01 live now</div>
      </motion.div>
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 mt-32 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md flex items-center justify-center text-[9px]"
            style={{background:"linear-gradient(135deg,#7c3aed,#a855f7)",boxShadow:"0 0 12px rgba(168,85,247,0.4)"}}>⚡</div>
          <span className="text-white font-black text-lg tracking-widest" style={{fontFamily:"'Syne',sans-serif"}}>KYZEN<span className="text-purple-500">.</span></span>
        </div>
        <div className="flex gap-8">
          {["Privacy","Terms","Status","GitHub"].map(l=>(
            <a key={l} href="#" className="text-white/20 text-[11px] font-mono tracking-wider hover:text-white/50 transition-colors">{l}</a>
          ))}
        </div>
        <div className="text-white/15 text-[11px] font-mono">© 2024 KYZEN SYSTEMS</div>
      </div>
    </footer>
  );
};

export default Footer;
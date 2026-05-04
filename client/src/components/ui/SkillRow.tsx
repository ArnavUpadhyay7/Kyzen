import { useRef } from "react";
import { palette } from "../../design-system";
import {motion, useInView} from "framer-motion";

type SkillItem = { name: string; level: number; max: number; color: string };

export const SkillRow = ({ skill, delay }: { skill: SkillItem; delay: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="flex items-center gap-3">
      <span className="text-[11px] font-mono tracking-wide w-28 truncate" style={{ color: palette.text35 }}>{skill.name}</span>
      <div className="flex gap-0.75 flex-1">
        {Array.from({ length: skill.max }).map((_, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, scaleY: 0.3 }}
            animate={inView ? { opacity: 1, scaleY: 1 } : {}}
            transition={{ delay: delay + i * 0.05, duration: 0.3 }}
            className="flex-1 h-1.5 rounded-xs"
            style={{
              background: i < skill.level
                ? `linear-gradient(90deg,${skill.color}88,${skill.color})`
                : "rgba(255,255,255,0.05)",
              boxShadow: i < skill.level ? `0 0 6px ${skill.color}55` : "none",
            }}
          />
        ))}
      </div>
      <span className="text-[11px] font-mono w-4 text-right" style={{ color: skill.color }}>{skill.level}</span>
    </div>
  );
};
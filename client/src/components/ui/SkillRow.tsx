import { useRef } from "react";
import { motion, useInView } from "framer-motion";

type SkillItem = { name: string; level: number; max: number; color: string };

const SKILL_COLOR_CLASS: Record<string, string> = {
  "#6EA8FF": "text-landing-blue-mid [--bar-from:#6EA8FF88] [--bar-to:#6EA8FF] [--bar-glow:#6EA8FF55]",
  "#4D7CFF": "text-landing-blue [--bar-from:#4D7CFF88] [--bar-to:#4D7CFF] [--bar-glow:#4D7CFF55]",
  "#93C5FD": "text-landing-blue-light [--bar-from:#93C5FD88] [--bar-to:#93C5FD] [--bar-glow:#93C5FD55]",
  "#7C4DFF": "text-landing-purple [--bar-from:#7C4DFF88] [--bar-to:#7C4DFF] [--bar-glow:#7C4DFF55]",
};

const DEFAULT_SKILL_CLASS =
  "text-landing-blue-mid [--bar-from:#6EA8FF88] [--bar-to:#6EA8FF] [--bar-glow:#6EA8FF55]";

export const SkillRow = ({
  skill,
  delay,
}: {
  skill: SkillItem;
  delay: number;
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const colorClass = SKILL_COLOR_CLASS[skill.color] ?? DEFAULT_SKILL_CLASS;

  return (
    <div ref={ref} className={`flex items-center gap-3 ${colorClass}`}>
      <span className="text-[11px] font-landing-mono tracking-wide w-28 truncate text-landing-text-35">
        {skill.name}
      </span>

      <div className="flex gap-0.75 flex-1">
        {Array.from({ length: skill.max }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scaleY: 0.3 }}
            animate={inView ? { opacity: 1, scaleY: 1 } : {}}
            transition={{ delay: delay + i * 0.05, duration: 0.3 }}
            className={[
              "flex-1 h-1.5 rounded-xs",
              i < skill.level
                ? "bg-[linear-gradient(90deg,var(--bar-from),var(--bar-to))] shadow-[0_0_6px_var(--bar-glow)]"
                : "bg-landing-text-08",
            ].join(" ")}
          />
        ))}
      </div>

      <span className="text-[11px] font-landing-mono w-4 text-right">{skill.level}</span>
    </div>
  );
};

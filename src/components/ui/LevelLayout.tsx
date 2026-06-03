import { motion } from "framer-motion";
import { WORLD_THEMES } from "../../lib/constants";
import { ZoneBadge, GlowDivider } from "./GameUI";

interface Props {
  level: number;
  title: string;
  subtitle: string;
  progress?: string;
  onBack: () => void;
  children: React.ReactNode;
  wide?: boolean;
}

export function LevelLayout({ level, title, subtitle, progress, onBack, children, wide }: Props) {
  const theme = WORLD_THEMES[level];

  return (
    <div
      className="min-h-screen relative"
      style={{
        paddingTop: "96px",
        background: `radial-gradient(ellipse 70% 40% at 50% 0%, ${theme.color}08 0%, transparent 60%), #060912`,
      }}
    >
      {/* Top accent line */}
      <div className="fixed top-0 left-0 right-0 h-px z-40"
        style={{ background: `linear-gradient(90deg, transparent 0%, ${theme.color}80 30%, ${theme.color}80 70%, transparent 100%)` }} />

      <div className={`mx-auto px-5 pb-20 ${wide ? "max-w-5xl" : "max-w-3xl"}`}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          {/* Back */}
          <motion.button
            onClick={onBack}
            whileHover={{ x: -3 }}
            transition={{ type: "spring", stiffness: 400 }}
            className="flex items-center gap-2 text-zinc-500 hover:text-zinc-200 transition-colors text-sm mb-6 group"
          >
            ← <span className="group-hover:underline">World Map</span>
          </motion.button>

          {/* Zone + progress */}
          <div className="flex items-center flex-wrap gap-3 mb-4">
            <ZoneBadge zone={level} color={theme.color} />
            {progress && (
              <span className="text-zinc-500 text-sm font-mono">{progress}</span>
            )}
          </div>

          <h1
            className="text-5xl font-black tracking-tight mb-3"
            style={{
              background: `linear-gradient(135deg, #ffffff 40%, ${theme.color})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {title}
          </h1>
          <p className="text-zinc-400 text-base leading-relaxed max-w-xl">{subtitle}</p>

          <GlowDivider color={theme.color} />
        </motion.div>

        {/* Content */}
        {children}
      </div>
    </div>
  );
}

import { forwardRef } from "react";
import * as RadixProgress from "@radix-ui/react-progress";
import * as Tooltip from "@radix-ui/react-tooltip";
import { motion } from "framer-motion";
import { cn } from "../../lib/ui";

// ── GlassCard ─────────────────────────────────────────────────
interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: string;   // hex color
  hover?: boolean;
  active?: boolean;
  accentColor?: string;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, glow, hover, active, accentColor, children, style, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "glass rounded-2xl relative overflow-hidden transition-all duration-200",
        hover && "card-hover cursor-pointer",
        active && "glass-strong",
        className
      )}
      style={{
        boxShadow: glow ? `0 0 30px ${glow}22, 0 0 60px ${glow}0a, inset 0 1px 0 rgba(255,255,255,0.06)` : "inset 0 1px 0 rgba(255,255,255,0.04)",
        borderColor: accentColor ? accentColor + "30" : undefined,
        ...style,
      }}
      {...props}
    >
      {/* Top shimmer line */}
      {accentColor && (
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${accentColor}60, transparent)` }} />
      )}
      {children}
    </div>
  )
);
GlassCard.displayName = "GlassCard";

// ── GlowButton ────────────────────────────────────────────────
interface GlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: string;
  variant?: "solid" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function GlowButton({
  color = "#3B82F6",
  variant = "solid",
  size = "md",
  className,
  children,
  disabled,
  ...props
}: GlowButtonProps) {
  const sizes = { sm: "px-4 py-2 text-sm", md: "px-6 py-3 text-sm", lg: "px-8 py-4 text-base" };

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.03, y: -1 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      disabled={disabled}
      className={cn(
        "relative rounded-xl font-semibold transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed",
        sizes[size],
        variant === "solid" && "text-white",
        variant === "outline" && "bg-transparent",
        variant === "ghost" && "bg-transparent border-0",
        className
      )}
      style={{
        background: variant === "solid" ? `linear-gradient(135deg, ${color}dd, ${color})` : "transparent",
        border: variant !== "ghost" ? `1px solid ${color}${variant === "solid" ? "60" : "50"}` : undefined,
        boxShadow: variant === "solid" && !disabled ? `0 4px 20px ${color}30, 0 0 0 0 ${color}00` : undefined,
        color: variant !== "solid" ? color : undefined,
      }}
      {...(props as React.ComponentProps<typeof motion.button>)}
    >
      {/* Inner shine */}
      {variant === "solid" && (
        <span className="absolute inset-0 rounded-xl"
          style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 60%)" }} />
      )}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

// ── XP Badge ──────────────────────────────────────────────────
export function XPBadge({ xp, color = "#10B981" }: { xp: number; color?: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-mono font-bold text-xs"
      style={{ background: color + "18", border: `1px solid ${color}35`, color }}
    >
      +{xp} XP
    </span>
  );
}

// ── Zone Badge ────────────────────────────────────────────────
export function ZoneBadge({ zone, color, label }: { zone: number; color: string; label?: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono font-semibold text-xs"
      style={{ background: color + "15", border: `1px solid ${color}40`, color }}
    >
      <span className="w-1.5 h-1.5 rounded-full pulse-glow" style={{ background: color }} />
      {label ?? `ZONE ${String(zone).padStart(2, "0")}`}
    </span>
  );
}

// ── Status Badge ──────────────────────────────────────────────
const STATUS_MAP = {
  complete:    { color: "#10B981", label: "✓ Complete" },
  "in-progress": { color: "#F59E0B", label: "In Progress" },
  unexplored:  { color: "#52525b", label: "Unexplored" },
  locked:      { color: "#3f3f46", label: "🔒 Locked" },
} as const;

export function StatusBadge({ status }: { status: keyof typeof STATUS_MAP }) {
  const { color, label } = STATUS_MAP[status];
  return (
    <span
      className="inline-flex items-center px-3 py-1 rounded-full font-semibold text-xs"
      style={{ background: color + "15", border: `1px solid ${color}35`, color }}
    >
      {label}
    </span>
  );
}

// ── Radix Progress Bar ────────────────────────────────────────
interface ProgressBarProps {
  value: number;   // 0–100
  color?: string;
  height?: number;
  showLabel?: boolean;
  animated?: boolean;
}

export function ProgressBar({ value, color = "#3B82F6", height = 8, showLabel, animated }: ProgressBarProps) {
  return (
    <div className="space-y-1">
      <RadixProgress.Root
        value={value}
        className="relative overflow-hidden rounded-full"
        style={{ height, background: "rgba(255,255,255,0.06)" }}
      >
        <RadixProgress.Indicator
          className="h-full rounded-full"
          style={{
            width: `${value}%`,
            background: `linear-gradient(90deg, ${color}88, ${color})`,
            boxShadow: animated ? `0 0 8px ${color}80` : undefined,
            transition: "width 600ms cubic-bezier(0.65,0,0.35,1)",
          }}
        />
      </RadixProgress.Root>
      {showLabel && (
        <p className="text-xs font-mono text-right" style={{ color: color + "aa" }}>
          {Math.round(value)}%
        </p>
      )}
    </div>
  );
}

// ── Tooltip wrapper ───────────────────────────────────────────
export function GameTooltip({ children, content }: { children: React.ReactNode; content: string }) {
  return (
    <Tooltip.Provider delayDuration={300}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="glass px-3 py-2 rounded-lg text-xs text-zinc-300 font-mono z-[500]"
            style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}
            sideOffset={6}
          >
            {content}
            <Tooltip.Arrow className="fill-zinc-800" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}

// ── Stat pill ─────────────────────────────────────────────────
export function StatPill({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="glass rounded-xl px-4 py-3 text-center"
      style={{ borderColor: color ? color + "20" : undefined }}>
      <p className="font-mono font-bold text-base" style={{ color: color ?? "#F1F5F9" }}>
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      <p className="text-zinc-500 text-xs mt-0.5">{label}</p>
    </div>
  );
}

// ── Section divider ───────────────────────────────────────────
export function GlowDivider({ color }: { color: string }) {
  return (
    <div className="h-px my-6"
      style={{ background: `linear-gradient(90deg, transparent, ${color}50, transparent)` }} />
  );
}

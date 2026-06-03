import confetti from "canvas-confetti";

export function burstConfetti(color: string) {
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: [color, "#ffffff", color + "aa"],
    scalar: 1.1,
  });
}

export function bossDefeatExplosion(color: string) {
  const fire = (angle: number, spread: number) =>
    confetti({
      particleCount: 40,
      angle,
      spread,
      origin: { x: 0.5, y: 0.5 },
      colors: [color, "#ef4444", "#f97316", "#ffffff"],
      scalar: 1.3,
      gravity: 0.8,
    });
  fire(60, 55);
  fire(120, 55);
  setTimeout(() => fire(90, 100), 150);
}

export function xpMilestone() {
  confetti({
    particleCount: 120,
    spread: 100,
    origin: { y: 0.5 },
    colors: ["#10B981", "#3B82F6", "#8B5CF6", "#F59E0B"],
    startVelocity: 30,
  });
}

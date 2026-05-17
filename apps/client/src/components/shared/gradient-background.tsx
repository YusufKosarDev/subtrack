import { motion } from "framer-motion";

interface OrbConfig {
  className: string;
  animate: { x?: number[]; y?: number[]; scale?: number[] };
  duration: number;
}

const ORBS: OrbConfig[] = [
  {
    className:
      "absolute top-[10%] left-[20%] h-[600px] w-[600px] rounded-full bg-primary/30 blur-[120px]",
    animate: { y: [0, -40, 0], x: [0, 30, 0] },
    duration: 28,
  },
  {
    className:
      "absolute bottom-[20%] right-[10%] h-[500px] w-[500px] rounded-full bg-accent/30 blur-[100px]",
    animate: { x: [0, -50, 0], y: [0, 30, 0] },
    duration: 24,
  },
  {
    className:
      "absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary/20 blur-[80px]",
    animate: { scale: [1, 1.15, 1] },
    duration: 20,
  },
  {
    className:
      "absolute bottom-0 left-[30%] h-[350px] w-[350px] rounded-full bg-primary/20 blur-[90px]",
    animate: { y: [0, -30, 0], x: [0, 20, 0] },
    duration: 26,
  },
];

export function GradientBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden opacity-70 dark:opacity-80"
    >
      <div className="bg-gradient-radial absolute inset-0" />
      {ORBS.map((orb, idx) => (
        <motion.div
          key={idx}
          className={orb.className}
          animate={orb.animate}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.015]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="gradient-bg-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#gradient-bg-noise)" />
      </svg>
    </div>
  );
}

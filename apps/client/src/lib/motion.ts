import type { Transition, Variants } from "framer-motion";

export const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

export const staggerContainer: Variants = {
  animate: {
    transition: { staggerChildren: 0.05 },
  },
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};

export const defaultTransition: Transition = {
  duration: 0.4,
  ease: [0.16, 1, 0.3, 1],
};

export const quickTransition: Transition = {
  duration: 0.2,
  ease: [0.16, 1, 0.3, 1],
};

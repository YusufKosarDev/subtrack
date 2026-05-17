import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { defaultTransition, fadeUp } from "@/lib/motion";

export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={fadeUp.initial}
      animate={fadeUp.animate}
      transition={defaultTransition}
    >
      {children}
    </motion.div>
  );
}

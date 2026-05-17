import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-card/20 px-6 py-16 text-center",
        className
      )}
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.6, bounce: 0.45 }}
        className="mb-5 flex items-center justify-center rounded-full bg-gradient-to-br from-muted/60 to-muted/20 p-6"
      >
        <Icon className="h-12 w-12 text-muted-foreground" />
      </motion.div>
      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

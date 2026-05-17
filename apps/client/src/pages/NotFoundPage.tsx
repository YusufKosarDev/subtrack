import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GradientBackground } from "@/components/shared/gradient-background";
import { defaultTransition } from "@/lib/motion";

export function NotFoundPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <GradientBackground />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={defaultTransition}
        className="flex flex-col items-center gap-4"
      >
        <h1 className="bg-gradient-to-br from-primary via-primary/80 to-primary/50 bg-clip-text text-9xl font-bold tracking-tighter text-transparent">
          404
        </h1>
        <h2 className="text-2xl font-semibold tracking-tight">
          Page not found
        </h2>
        <p className="max-w-md text-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Button asChild size="lg" className="mt-4">
          <Link to="/dashboard">
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}

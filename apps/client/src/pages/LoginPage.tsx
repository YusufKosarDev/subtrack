import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-background text-foreground">
      <h1 className="text-4xl font-bold tracking-tight">Login</h1>
      <p className="text-muted-foreground">SubTrack — sign in to continue</p>
      <Button onClick={() => toast.success("Working!")}>Test toast</Button>
    </div>
  );
}

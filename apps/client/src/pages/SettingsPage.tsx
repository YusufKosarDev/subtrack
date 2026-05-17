import { Sparkles } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

export function SettingsPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your profile, preferences and account.
        </p>
      </header>

      <EmptyState
        icon={Sparkles}
        title="Coming soon"
        description="Profile, notifications, billing and security settings are on the way."
      />
    </div>
  );
}

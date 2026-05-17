import { LogOut, Mail, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuthStore } from "@/store/auth.store";
import { useLogout } from "@/features/auth/use-auth";

function DisabledHint({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-block">{children}</span>
        </TooltipTrigger>
        <TooltipContent>Coming in v2</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function SettingsPage() {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your profile, preferences and account.
        </p>
      </header>

      <Card className="space-y-4 p-6">
        <div>
          <h2 className="text-base font-semibold tracking-tight">Profile</h2>
          <p className="text-sm text-muted-foreground">
            Personal details visible inside the app.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="profile-name">Name</Label>
            <div className="relative">
              <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="profile-name"
                value={user?.name ?? ""}
                readOnly
                disabled
                placeholder="No name set"
                className="pl-9"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-email">Email</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="profile-email"
                value={user?.email ?? ""}
                readOnly
                disabled
                className="pl-9"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <DisabledHint>
            <Button variant="outline" disabled>
              Edit profile
            </Button>
          </DisabledHint>
        </div>
      </Card>

      <Card className="space-y-4 p-6">
        <div>
          <h2 className="text-base font-semibold tracking-tight">
            Preferences
          </h2>
          <p className="text-sm text-muted-foreground">
            App-wide preferences. Theme can be changed from the top bar.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Theme</Label>
            <Input value="Use the toggle in the top bar" readOnly disabled />
          </div>
          <div className="space-y-2">
            <Label>Default currency</Label>
            <DisabledHint>
              <Input value="TRY" readOnly disabled />
            </DisabledHint>
          </div>
        </div>
      </Card>

      <Card className="space-y-4 p-6">
        <div>
          <h2 className="text-base font-semibold tracking-tight">Account</h2>
          <p className="text-sm text-muted-foreground">
            Sign out or manage your session.
          </p>
        </div>
        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={logout}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </Card>
    </div>
  );
}

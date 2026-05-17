import type { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <Sidebar className="hidden md:flex" />
      <div className="md:ml-64">
        <Topbar />
        <main className="p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

"use client";

import { usePathname } from "next/navigation";
import { Menu, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "./sidebar-context";

const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/students": "Manage Patients",
  "/programs": "Manage Doctors",
  "/enrollments": "Manage Appointments",
};

function getTitle(pathname: string) {
  for (const [key, val] of Object.entries(titles)) {
    if (pathname === key || pathname.startsWith(key + "/")) return val;
  }
  return "Smart Clinic Portal";
}

export function Header() {
  const pathname = usePathname();
  const title = getTitle(pathname);
  const { toggle } = useSidebar();
  const dateLabel = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <header className="sticky top-0 z-40 border-b border-white/50 bg-white/70 px-4 py-3 shadow-sm backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={toggle}
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Clinic Control</p>
            <h1 className="font-display text-xl font-semibold tracking-tight text-slate-900">{title}</h1>
          </div>
        </div>
        <div className="hidden items-center gap-2 rounded-full border border-cyan-200/60 bg-cyan-50 px-3 py-1.5 text-xs font-medium text-cyan-800 sm:flex">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Live Workspace</span>
          <span className="text-cyan-500">|</span>
          <span>{dateLabel}</span>
        </div>
      </div>
    </header>
  );
}

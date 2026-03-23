"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  CalendarDays,
  Activity,
} from "lucide-react";
import { useSidebar } from "./sidebar-context";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Patients", href: "/students", icon: Users },
  { label: "Doctors", href: "/programs", icon: Stethoscope },
  { label: "Appointments", href: "/enrollments", icon: CalendarDays },
];

export function Sidebar() {
  const pathname = usePathname();
  const { open, close } = useSidebar();

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={close}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 border-r border-cyan-200/15 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 shadow-2xl shadow-slate-950/30 backdrop-blur transition-transform duration-300",
          "lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand */}
        <div className="border-b border-white/10 px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-sky-600 text-slate-950 shadow-lg shadow-cyan-600/35">
              <Activity className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <p className="font-semibold tracking-tight">Smart Clinic</p>
              <p className="text-xs text-slate-400">Operations Console</p>
            </div>
          </div>
          <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-slate-300">
            Real-time patient, doctor, and appointment flow in one place.
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 px-4 py-5">
          {navItems.map(({ label, href, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                onClick={close}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-cyan-500/15 text-cyan-200 ring-1 ring-cyan-300/30"
                    : "text-slate-300 hover:bg-white/8 hover:text-white"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    active ? "text-cyan-300" : "text-slate-400 group-hover:text-slate-100"
                  )}
                />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-white/10 px-6 py-4 text-xs text-slate-500">
          <p>Smart Clinic Suite</p>
          <p className="mt-1 text-slate-400">Built for faster clinic workflows</p>
        </div>
      </aside>
    </>
  );
}

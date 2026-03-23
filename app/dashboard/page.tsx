"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Stethoscope,
  CalendarDays,
  ArrowRight,
  Activity,
  CalendarClock,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { studentApi, programApi, enrollmentApi } from "@/lib/api";
import type { Program, Enrollment } from "@/types";

interface Stats {
  patients: number;
  doctors: number;
  appointments: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentEnrollments, setRecentEnrollments] = useState<Enrollment[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [students, progs, enrollments] = await Promise.all([
          studentApi.getAll(),
          programApi.getAll(),
          enrollmentApi.getAll(),
        ]);
        setStats({
          patients: students.length,
          doctors: progs.length,
          appointments: enrollments.length,
        });
        setRecentEnrollments(enrollments.slice(-5).reverse());
        setPrograms(progs);
      } catch {
        // silently handle – services may not be running locally
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const statCards = [
    {
      label: "Total Patients",
      value: stats?.patients ?? 0,
      icon: Users,
      color: "text-sky-700",
      bg: "bg-sky-100/70",
      href: "/students",
    },
    {
      label: "Total Doctors",
      value: stats?.doctors ?? 0,
      icon: Stethoscope,
      color: "text-emerald-700",
      bg: "bg-emerald-100/70",
      href: "/programs",
    },
    {
      label: "Total Appointments",
      value: stats?.appointments ?? 0,
      icon: CalendarDays,
      color: "text-amber-700",
      bg: "bg-amber-100/75",
      href: "/enrollments",
    },
  ];

  return (
    <div className="space-y-6 lg:space-y-7">
      <Card className="overflow-hidden border-cyan-100/80 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 text-white shadow-xl shadow-slate-900/20">
        <CardContent className="relative p-6 sm:p-7 lg:p-8">
          <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-1/3 h-24 w-24 rounded-full bg-emerald-300/20 blur-2xl" />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <Badge className="w-fit border border-cyan-300/20 bg-cyan-400/15 text-cyan-100 hover:bg-cyan-400/15">
                <Activity className="mr-1.5 h-3.5 w-3.5" />
                Clinic Status: Active
              </Badge>
              <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                Operations at a glance
              </h2>
              <p className="max-w-xl text-sm text-slate-300 sm:text-base">
                Track patient activity, doctor slots, and appointments from one streamlined dashboard.
              </p>
            </div>
            <Link href="/enrollments?action=new">
              <Button className="gap-2 bg-cyan-500 text-slate-950 hover:bg-cyan-400">
                <CalendarClock className="h-4 w-4" />
                New Appointment
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 lg:grid-cols-3">
        {statCards.map(({ label, value, icon: Icon, color, bg, href }) => (
          <Link key={label} href={href}>
            <Card className="cursor-pointer border-slate-200/80 bg-white/90 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">{label}</p>
                    {loading ? (
                      <Skeleton className="h-8 w-16 mt-1" />
                    ) : (
                      <p className="mt-1 text-3xl font-bold text-slate-900">
                        {value}
                      </p>
                    )}
                  </div>
                  <div className={`${bg} rounded-2xl p-3`}>
                    <Icon className={`h-6 w-6 ${color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Appointments */}
        <Card className="border-slate-200/90 bg-white/90">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="font-display text-base font-semibold">
              Recent Appointments
            </CardTitle>
            <Link href="/enrollments">
              <Button variant="ghost" size="sm" className="gap-1 text-sky-700 hover:text-sky-800">
                View all <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))
            ) : recentEnrollments.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4">
                No appointments yet
              </p>
            ) : (
              recentEnrollments.map((e) => (
                <div
                  key={e.id}
                  className="flex items-center justify-between rounded-xl border border-slate-200/90 bg-white p-3"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {e.patient?.name ?? e.patientId}
                    </p>
                    <p className="text-xs text-slate-500">
                      Doctor Slot: {e.doctorSlotId}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="text-xs">
                      #{e.id}
                    </Badge>
                    <p className="text-xs text-slate-400 mt-1">{e.date}</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Doctors Overview */}
        <Card className="border-slate-200/90 bg-white/90">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="font-display text-base font-semibold">
              Doctors Overview
            </CardTitle>
            <Link href="/programs">
              <Button variant="ghost" size="sm" className="gap-1 text-sky-700 hover:text-sky-800">
                Manage <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))
            ) : programs.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4">
                No doctors yet
              </p>
            ) : (
              programs.slice(0, 5).map((p) => (
                <div
                  key={p.doctorSlotId}
                  className="flex items-center justify-between rounded-xl border border-slate-200/90 bg-white p-3"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {p.description}
                    </p>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                    {p.doctorSlotId}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-slate-200/90 bg-white/90">
        <CardHeader>
          <CardTitle className="font-display text-base font-semibold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Link href="/students?action=new">
              <Button
                variant="outline"
                className="h-12 w-full justify-start gap-2 border-sky-200 bg-sky-50/60 hover:bg-sky-100/80"
              >
                <Users className="h-4 w-4 text-sky-700" />
                Add New Patient
              </Button>
            </Link>
            <Link href="/programs?action=new">
              <Button
                variant="outline"
                className="h-12 w-full justify-start gap-2 border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100/80"
              >
                <Stethoscope className="h-4 w-4 text-emerald-700" />
                Add Doctor Slot
              </Button>
            </Link>
            <Link href="/enrollments?action=new">
              <Button
                variant="outline"
                className="h-12 w-full justify-start gap-2 border-amber-200 bg-amber-50/70 hover:bg-amber-100/85"
              >
                <CalendarDays className="h-4 w-4 text-amber-700" />
                New Appointment
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-2xl border border-slate-200/90 bg-white/70 p-4 text-sm text-slate-600">
        Keep services running to view live counts. Dashboard gracefully falls back even when APIs are offline.
      </div>
    </div>
  );
}

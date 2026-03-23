import type { Metadata } from "next";
import { Manrope, Sora } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { SidebarProvider } from "@/components/layout/sidebar-context";
import { Toaster } from "@/components/ui/sonner";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora" });

export const metadata: Metadata = {
  title: "Smart Clinic Portal",
  description: "Cloud-native clinic patient, doctor, and appointment management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${sora.variable} bg-background font-sans text-foreground antialiased`}>
        <div className="relative min-h-screen overflow-x-hidden">
          <div className="pointer-events-none fixed inset-0 -z-10">
            <div className="absolute -left-28 top-8 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
            <div className="absolute -right-24 top-24 h-80 w-80 rounded-full bg-sky-400/20 blur-3xl" />
            <div className="absolute bottom-10 left-1/3 h-64 w-64 rounded-full bg-emerald-300/15 blur-3xl" />
          </div>
          <SidebarProvider>
            <Sidebar />
            <div className="flex min-h-screen flex-col lg:ml-72">
              <Header />
              <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
            </div>
          </SidebarProvider>
        </div>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}

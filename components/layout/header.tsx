"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP_NAME, APP_SUBTITLE } from "@/lib/config/app";
import { FileSearch, Shield, Info, Home } from "lucide-react";

export function Header() {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Analyzer", href: "/analyze", icon: FileSearch },
    { label: "Privacy", href: "/privacy", icon: Shield },
    { label: "About", href: "/about", icon: Info },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-md bg-slate-900 flex items-center justify-center text-white font-bold text-xs shadow-xs group-hover:bg-slate-800 transition-colors font-mono">
            JDA
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-tight text-slate-900 group-hover:text-slate-700 transition-colors">
              {APP_NAME}
            </span>
            <span className="text-[11px] font-mono text-slate-500 border-l border-slate-200 pl-2 hidden sm:inline">
              Engine v1.0
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-slate-100 text-slate-900 font-semibold border border-slate-200"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-slate-900" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <Link
            href="/analyze"
            className="ml-2 btn-primary"
          >
            <FileSearch className="w-3.5 h-3.5" />
            <span>Analyze Resume</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

import Link from "next/link";
import { APP_NAME, APP_SUBTITLE } from "@/lib/config/app";
import { ShieldCheck, Database, Server, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white py-12 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-slate-900 flex items-center justify-center text-white font-bold text-xs shadow-xs font-mono">
                JDA
              </div>
              <span className="font-bold text-sm text-slate-900">{APP_NAME}</span>
            </div>

            <p className="text-xs text-slate-600 max-w-md leading-relaxed">
              {APP_SUBTITLE}. Privacy-conscious, 100% explainable match scoring engine designed for modern candidate and talent workflows.
            </p>
            <div className="flex flex-wrap gap-2 pt-1 text-xs">
              <span className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md text-slate-700 font-mono text-[11px]">
                <Database className="w-3.5 h-3.5 text-slate-500" />
                Zero DB Storage
              </span>
              <span className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md text-slate-700 font-mono text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
                PII Redacted
              </span>
              <span className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md text-slate-700 font-mono text-[11px]">
                <Server className="w-3.5 h-3.5 text-slate-600" />
                Stateless Engine
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-slate-900 transition-colors">
                  Home Landing
                </Link>
              </li>
              <li>
                <Link href="/analyze" className="hover:text-slate-900 transition-colors">
                  Resume Analyzer
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-slate-900 transition-colors">
                  Privacy Policy & Ethics
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-slate-900 transition-colors">
                  Architecture & Design
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">
              Guarantees & Compliance
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              {APP_NAME} provides resume alignment guidance. It does not predict or guarantee hiring outcomes. Never fabricate experience or credentials.
            </p>
          </div>

        </div>

        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
          <p className="font-mono text-[11px]">
            Stateless Architecture • Privacy First
          </p>
        </div>
      </div>
    </footer>
  );
}

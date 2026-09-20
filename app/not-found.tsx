import Link from "next/link";
import { FileSearch, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="py-24 max-w-lg mx-auto px-4 text-center space-y-6">
      <div className="w-12 h-12 rounded-md bg-slate-900 border border-slate-900 flex items-center justify-center mx-auto text-white font-bold text-sm font-mono shadow-xs">
        404
      </div>
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-1.5">Page Not Found</h1>
        <p className="text-sm text-slate-600">
          The page or analysis route you were looking for does not exist.
        </p>
      </div>
      <div className="flex justify-center gap-3">
        <Link
          href="/"
          className="btn-secondary inline-flex text-xs py-2.5 px-4"
        >
          <Home className="w-3.5 h-3.5 text-slate-500" /> Go Home
        </Link>
        <Link
          href="/analyze"
          className="btn-primary inline-flex text-xs py-2.5 px-4"
        >
          <FileSearch className="w-3.5 h-3.5" /> Resume Analyzer
        </Link>
      </div>
    </div>
  );
}


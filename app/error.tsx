"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Uncaught runtime error:", error);
  }, [error]);

  return (
    <div className="py-24 max-w-lg mx-auto px-4 text-center space-y-6">
      <div className="w-12 h-12 rounded-md bg-red-50 border border-red-200 flex items-center justify-center mx-auto text-red-600 shadow-xs">
        <AlertCircle className="w-6 h-6" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-1.5">Something Went Wrong</h1>
        <p className="text-sm text-slate-600">
          {error.message || "An unexpected application error occurred."}
        </p>
      </div>
      <div className="flex justify-center gap-3">
        <button
          onClick={() => reset()}
          className="btn-primary inline-flex text-xs py-2.5 px-4"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Try Again
        </button>
        <Link
          href="/"
          className="btn-secondary inline-flex text-xs py-2.5 px-4"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}


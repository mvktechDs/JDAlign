import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="py-32 flex flex-col items-center justify-center space-y-4">
      <Loader2 className="w-7 h-7 text-slate-900 animate-spin" />
      <p className="text-xs font-mono text-slate-500">Loading JDAlign...</p>

    </div>
  );
}


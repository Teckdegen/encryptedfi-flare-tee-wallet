"use client";
import { Clock } from "lucide-react";

export function Activity() {
  return (
    <div className="space-y-6">
      <div className="glass rounded-3xl p-6">
        <div className="text-xs uppercase tracking-widest text-muted mb-1">Activity</div>
        <h2 className="text-2xl font-bold mb-6">History</h2>

        <div className="glass-strong rounded-2xl p-8 text-center">
          <Clock size={32} strokeWidth={1.5} className="mx-auto mb-3 text-muted" />
          <div className="text-sm font-bold tracking-widest uppercase mb-1">No activity yet</div>
          <div className="text-xs text-muted">Your wraps, transfers, and swaps will appear here.</div>
        </div>
      </div>
    </div>
  );
}

"use client";
import { TrendingUp } from "lucide-react";
import { CTOKENS } from "../lib/contracts";

export function Earn() {
  return (
    <div className="space-y-4">
      <div className="glass rounded-3xl p-6">
        <div className="text-xs uppercase tracking-widest text-muted mb-1">Earn</div>
        <h2 className="text-2xl font-bold mb-6">Private lending</h2>

        <div className="space-y-3">
          {CTOKENS.map((c) => (
            <div key={c.symbol} className="glass-strong rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                  <TrendingUp size={18} className="text-success" />
                </div>
                <div>
                  <div className="font-bold">{c.symbol}</div>
                  <div className="text-xs text-muted">underlying {c.underlying}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-sm text-success">{(c.apr / 100).toFixed(2)}% APR</div>
                <div className="text-[10px] text-muted uppercase tracking-widest mt-1">TEE pending</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";
import { TOKENS, Token } from "../lib/contracts";
import { Search, X } from "lucide-react";
import { useState } from "react";

const COLOR_MAP: Record<string, string> = {
  GHST: "from-slate-400 to-slate-600",
  CIPH: "from-cyan-400 to-blue-600",
  VEIL: "from-purple-400 to-fuchsia-600",
  NOIR: "from-zinc-700 to-zinc-900",
  PHTM: "from-indigo-400 to-violet-600",
  MASK: "from-rose-400 to-pink-600",
  SHDE: "from-neutral-500 to-neutral-700",
  NULL: "from-amber-400 to-orange-600",
  MRKL: "from-emerald-400 to-teal-600",
  ENIG: "from-lime-400 to-green-600",
};

const FAKE_PRICES: Record<string, number> = {
  GHST: 1.09, CIPH: 2.45, VEIL: 0.62, NOIR: 105.56, PHTM: 3.20,
  MASK: 0.14, SHDE: 0.08, NULL: 1.00, MRKL: 12.4, ENIG: 0.45,
};

export function TokenPicker({
  current,
  onPick,
  onClose,
  label,
  encrypted,
}: {
  current: Token;
  onPick: (t: Token) => void;
  onClose: () => void;
  label?: string;
  encrypted?: boolean;
}) {
  const [q, setQ] = useState("");
  const filtered = TOKENS.filter(
    (t) => t.symbol.toLowerCase().includes(q.toLowerCase()) || t.name.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/20 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="glass-strong rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[80vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center pt-3 pb-2">
          <div className="w-12 h-1 rounded-full bg-black/15" />
        </div>

        <div className="px-5 pb-3 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted">{label ?? "Select token"}</div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full glass flex items-center justify-center"
            aria-label="close"
          >
            <X size={16} className="text-ink" />
          </button>
        </div>

        <div className="px-5 pb-3">
          <div className="glass rounded-full pl-4 pr-2 py-2 flex items-center gap-2">
            <Search size={14} className="text-muted" />
            <input
              type="text"
              placeholder="Search token"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="bg-transparent flex-1 text-sm focus:outline-none min-w-0"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto hide-scrollbar px-3 pb-6 space-y-1">
          {filtered.map((t) => {
            const sym = encrypted ? `e${t.symbol}` : t.symbol;
            const name = encrypted ? `Encrypted ${t.name}` : t.name;
            const price = FAKE_PRICES[t.symbol] ?? 1;
            const isCurrent = current.symbol === t.symbol;
            return (
              <button
                key={t.symbol}
                onClick={() => { onPick(t); onClose(); }}
                className={`w-full flex items-center gap-3 p-3 rounded-2xl transition ${
                  isCurrent ? "bg-white/40" : "hover:bg-white/25"
                }`}
              >
                <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${COLOR_MAP[t.symbol] ?? "from-gray-500 to-gray-700"} flex items-center justify-center text-sm font-bold text-white shadow-inner`}>
                  {sym.charAt(0)}
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm font-bold">{sym}</div>
                  <div className="text-xs text-muted">{name}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-mono font-bold">${price.toFixed(2)}</div>
                  <div className="text-[10px] text-muted uppercase tracking-widest">{encrypted ? "Note" : "Token"}</div>
                </div>
              </button>
            );
          })}
          {filtered.length === 0 && (
            <div className="text-center text-sm text-muted py-8">No tokens match</div>
          )}
        </div>
      </div>
    </div>
  );
}

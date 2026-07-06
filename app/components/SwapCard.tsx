"use client";
import { TOKENS, Token } from "../lib/contracts";
import { ChevronDown, ArrowUpDown, Settings2 } from "lucide-react";
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

function TokenBadge({ token, onSelect }: { token: Token; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      className="flex items-center gap-2 glass-strong rounded-full pl-1 pr-3 py-1 hover:bg-white/40 transition"
    >
      <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${COLOR_MAP[token.symbol] ?? "from-gray-500 to-gray-700"} flex items-center justify-center text-[10px] font-bold text-white`}>
        {token.symbol.charAt(0)}
      </div>
      <span className="text-sm font-bold">{token.symbol}</span>
      <ChevronDown size={14} className="text-muted" />
    </button>
  );
}

function TokenPicker({
  current,
  onPick,
  onClose,
}: {
  current: Token;
  onPick: (t: Token) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center p-4" onClick={onClose}>
      <div
        className="glass-strong rounded-3xl p-4 w-full max-w-md max-h-[70vh] overflow-y-auto hide-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-xs uppercase tracking-widest text-muted mb-3 px-2">Select token</div>
        <div className="space-y-1">
          {TOKENS.map((t) => (
            <button
              key={t.symbol}
              onClick={() => { onPick(t); onClose(); }}
              className={`w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-white/40 transition ${current.symbol === t.symbol ? "bg-white/30" : ""}`}
            >
              <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${COLOR_MAP[t.symbol] ?? "from-gray-500 to-gray-700"} flex items-center justify-center text-sm font-bold text-white`}>
                {t.symbol.charAt(0)}
              </div>
              <div className="flex-1 text-left">
                <div className="text-sm font-bold">{t.symbol}</div>
                <div className="text-xs text-muted">{t.name}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SwapCard({
  title,
  fromLabel,
  toLabel,
  submitLabel,
  onSubmit,
  hint,
}: {
  title: string;
  fromLabel: string;
  toLabel: string;
  submitLabel: string;
  onSubmit?: (from: Token, to: Token, amount: string) => void;
  hint?: string;
}) {
  const [fromToken, setFromToken] = useState<Token>(TOKENS[0]);
  const [toToken, setToToken] = useState<Token>(TOKENS[1]);
  const [amount, setAmount] = useState("0");
  const [picking, setPicking] = useState<"from" | "to" | null>(null);

  const outAmount = amount && Number(amount) > 0 ? (Number(amount) * 0.995).toFixed(4) : "0";

  function swapTokens() {
    setFromToken(toToken);
    setToToken(fromToken);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between mb-1">
        <div className="text-lg font-bold">{title}</div>
        <button className="glass w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/40 transition">
          <Settings2 size={16} className="text-muted" />
        </button>
      </div>

      <div className="glass rounded-3xl p-5">
        <div className="text-xs text-muted uppercase tracking-widest mb-3">{fromLabel}</div>
        <div className="flex items-center justify-between gap-3">
          <input
            type="number"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-transparent text-4xl font-bold tracking-tight w-full focus:outline-none min-w-0"
            placeholder="0"
          />
          <TokenBadge token={fromToken} onSelect={() => setPicking("from")} />
        </div>
      </div>

      <div className="flex justify-center -my-2">
        <button
          onClick={swapTokens}
          className="glass-strong w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/50 transition z-10"
        >
          <ArrowUpDown size={16} className="text-ink" />
        </button>
      </div>

      <div className="glass rounded-3xl p-5">
        <div className="text-xs text-muted uppercase tracking-widest mb-3">{toLabel}</div>
        <div className="flex items-center justify-between gap-3">
          <div className="text-4xl font-bold tracking-tight text-muted">
            {outAmount}
          </div>
          <TokenBadge token={toToken} onSelect={() => setPicking("to")} />
        </div>
      </div>

      <button
        onClick={() => onSubmit?.(fromToken, toToken, amount)}
        disabled={!amount || Number(amount) === 0}
        className="glass-btn w-full py-4 rounded-2xl text-sm font-bold tracking-widest uppercase mt-3"
      >
        {submitLabel}
      </button>

      {hint && (
        <div className="text-xs text-muted text-center mt-1">{hint}</div>
      )}

      {picking && (
        <TokenPicker
          current={picking === "from" ? fromToken : toToken}
          onPick={(t) => (picking === "from" ? setFromToken(t) : setToToken(t))}
          onClose={() => setPicking(null)}
        />
      )}
    </div>
  );
}

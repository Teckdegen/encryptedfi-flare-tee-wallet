"use client";
import { ArrowUpDown } from "lucide-react";
import { TOKENS, Token } from "../lib/contracts";
import { useState } from "react";

export function Swap() {
  const [from, setFrom] = useState<Token>(TOKENS[0]);
  const [to, setTo] = useState<Token>(TOKENS[1]);
  const [amount, setAmount] = useState("");

  return (
    <div className="space-y-4">
      <div className="glass rounded-3xl p-6">
        <div className="glass-strong rounded-2xl p-4 mb-2">
          <div className="text-xs text-muted uppercase tracking-widest mb-2">From</div>
          <div className="flex items-center gap-2">
            <select
              value={from.symbol}
              onChange={(e) => setFrom(TOKENS.find((t) => t.symbol === e.target.value)!)}
              disabled
              className="bg-transparent border border-white/10 rounded-xl px-3 py-2 text-sm font-mono opacity-40"
            >
              {TOKENS.map((t) => (
                <option key={t.symbol} value={t.symbol} className="bg-bg">{t.symbol}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled
              className="bg-transparent border border-white/10 rounded-xl px-3 py-2 text-sm flex-1 font-mono opacity-40"
            />
          </div>
        </div>

        <div className="flex justify-center py-1">
          <div className="glass w-10 h-10 rounded-full flex items-center justify-center">
            <ArrowUpDown size={16} className="text-muted" />
          </div>
        </div>

        <div className="glass-strong rounded-2xl p-4 mb-4">
          <div className="text-xs text-muted uppercase tracking-widest mb-2">To</div>
          <div className="flex items-center gap-2">
            <select
              value={to.symbol}
              onChange={(e) => setTo(TOKENS.find((t) => t.symbol === e.target.value)!)}
              disabled
              className="bg-transparent border border-white/10 rounded-xl px-3 py-2 text-sm font-mono opacity-40"
            >
              {TOKENS.map((t) => (
                <option key={t.symbol} value={t.symbol} className="bg-bg">{t.symbol}</option>
              ))}
            </select>
            <div className="bg-transparent border border-white/10 rounded-xl px-3 py-2 text-sm flex-1 font-mono opacity-40">0.00</div>
          </div>
        </div>

        <button
          disabled
          className="glass-btn w-full py-4 rounded-2xl text-sm font-bold tracking-widest uppercase flex items-center justify-center gap-2"
        >
          <ArrowUpDown size={16} />
          Coming soon (TEE required)
        </button>
      </div>

      <div className="glass rounded-3xl p-5 text-xs text-muted leading-relaxed">
        Private swaps route encrypted notes through SparkDEX. Amounts and routes stay private. Activates when FCC registration completes.
      </div>
    </div>
  );
}

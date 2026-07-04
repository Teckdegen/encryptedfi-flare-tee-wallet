"use client";
import { TOKENS } from "../lib/contracts";
import { useState } from "react";

export function Unshield() {
  const [token, setToken] = useState(TOKENS[0]);
  const [amount, setAmount] = useState("");

  return (
    <div className="space-y-6">
      <div className="glass rounded-3xl p-6">
        <div className="text-xs uppercase tracking-widest text-muted mb-1">Unshield</div>
        <h2 className="text-2xl font-bold mb-1">Private → Public</h2>
        <p className="text-sm text-muted mb-6">Turn encrypted notes back into tokens. 0.5% fee.</p>

        <div className="glass-strong rounded-2xl p-4 mb-3">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-muted">From encrypted notes</span>
            <span className="text-xs text-muted">·· ·· ··</span>
          </div>
          <div className="flex gap-2">
            <select
              value={token.symbol}
              onChange={(e) => setToken(TOKENS.find((t) => t.symbol === e.target.value)!)}
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

        <button
          disabled
          className="glass-btn w-full py-4 rounded-2xl text-sm font-bold tracking-widest uppercase"
        >
          Coming soon (TEE required)
        </button>
      </div>

      <div className="glass rounded-3xl p-5 text-xs text-muted leading-relaxed">
        Unshielding requires the TEE relayer to sign the burn instruction. Activates when FCC registration completes.
      </div>
    </div>
  );
}

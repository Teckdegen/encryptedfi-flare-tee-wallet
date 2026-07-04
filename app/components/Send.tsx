"use client";
import { ArrowUp } from "lucide-react";
import { TOKENS } from "../lib/contracts";
import { useState } from "react";

export function Send() {
  const [token, setToken] = useState(TOKENS[0]);
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  return (
    <div className="space-y-4">
      <div className="glass rounded-3xl p-6">
        <div className="glass-strong rounded-2xl p-4 mb-3">
          <div className="text-xs text-muted uppercase tracking-widest mb-2">To</div>
          <input
            type="text"
            placeholder="0x..."
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            disabled
            className="bg-transparent border border-white/10 rounded-xl px-3 py-2 text-sm w-full font-mono focus:outline-none focus:border-white/30 disabled:opacity-40"
          />
        </div>

        <div className="glass-strong rounded-2xl p-4 mb-4">
          <div className="text-xs text-muted uppercase tracking-widest mb-2">Amount</div>
          <div className="flex items-center gap-2">
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
          className="glass-btn w-full py-4 rounded-2xl text-sm font-bold tracking-widest uppercase flex items-center justify-center gap-2"
        >
          <ArrowUp size={16} />
          Coming soon (TEE required)
        </button>
      </div>

      <div className="glass rounded-3xl p-5 text-xs text-muted leading-relaxed">
        Private transfer routes through the TEE relayer. Your address never appears in the transfer transaction. Activates when FCC registration completes.
      </div>
    </div>
  );
}

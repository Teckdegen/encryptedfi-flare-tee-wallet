"use client";
import { useAccount } from "wagmi";
import { ChevronDown, Delete } from "lucide-react";
import { useState } from "react";
import { TOKENS, Token } from "../lib/contracts";

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

export function Send() {
  const { address } = useAccount();
  const [recipient, setRecipient] = useState(address ?? "");
  const [amount, setAmount] = useState("0");
  const [token, setToken] = useState<Token>(TOKENS[0]);
  const [picking, setPicking] = useState(false);

  function press(k: string) {
    setAmount((cur) => {
      if (k === "back") return cur.length <= 1 ? "0" : cur.slice(0, -1);
      if (k === ".") return cur.includes(".") ? cur : cur + ".";
      if (cur === "0") return k;
      return cur + k;
    });
  }

  const shortRecipient = recipient
    ? `${recipient.slice(0, 6)}...${recipient.slice(-4)}`
    : "0x...";

  return (
    <div className="flex flex-col gap-3">
      <div className="glass rounded-2xl px-4 py-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 via-amber-300 to-rose-400" />
        <input
          type="text"
          placeholder="0x... recipient address"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="bg-transparent text-sm font-mono flex-1 focus:outline-none min-w-0"
        />
      </div>

      <div className="glass rounded-3xl p-5 flex flex-col items-center gap-3">
        <div className="text-5xl font-bold tracking-tight">
          {amount}
        </div>
        <button
          onClick={() => setPicking(true)}
          className="glass-strong rounded-full pl-1 pr-3 py-1 flex items-center gap-2 hover:bg-white/40 transition"
        >
          <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${COLOR_MAP[token.symbol] ?? "from-gray-500 to-gray-700"} flex items-center justify-center text-[10px] font-bold text-white`}>
            {token.symbol.charAt(0)}
          </div>
          <span className="text-sm font-bold">{token.symbol}</span>
          <ChevronDown size={14} className="text-muted" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[25, 50, 100].map((p) => (
          <button
            key={p}
            onClick={() => setAmount(String(p))}
            className="glass rounded-full py-2 text-xs font-bold tracking-wide hover:bg-white/40 transition"
          >
            {p}%
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {["1","2","3","4","5","6","7","8","9",".","0","back"].map((k) => (
          <button
            key={k}
            onClick={() => press(k)}
            className="glass rounded-2xl py-4 text-lg font-bold hover:bg-white/40 transition flex items-center justify-center"
          >
            {k === "back" ? <Delete size={18} className="text-ink" /> : k}
          </button>
        ))}
      </div>

      <div className="text-xs text-muted text-center pt-1">
        Sending to <span className="font-mono">{shortRecipient}</span>. TEE required.
      </div>

      {picking && (
        <div className="fixed inset-0 z-30 flex items-end justify-center p-4" onClick={() => setPicking(false)}>
          <div
            className="glass-strong rounded-3xl p-4 w-full max-w-md max-h-[70vh] overflow-y-auto hide-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-xs uppercase tracking-widest text-muted mb-3 px-2">Select token</div>
            <div className="space-y-1">
              {TOKENS.map((t) => (
                <button
                  key={t.symbol}
                  onClick={() => { setToken(t); setPicking(false); }}
                  className={`w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-white/40 transition ${token.symbol === t.symbol ? "bg-white/30" : ""}`}
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
      )}
    </div>
  );
}

"use client";
import { useAccount } from "wagmi";
import { X, Plus, Search, ScanLine, ChevronLeft, ChevronDown, Delete } from "lucide-react";
import { useState, useEffect } from "react";
import { TOKENS, Token } from "../lib/contracts";
import { TokenPicker } from "./TokenPicker";

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

const RECENTS_KEY = "encryptedfi.send.recents";

type Screen = "recipients" | "compose" | "review";

function loadRecents(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(RECENTS_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.slice(0, 20) : [];
  } catch {
    return [];
  }
}

function saveRecent(addr: string) {
  if (typeof window === "undefined") return;
  const existing = loadRecents().filter((a) => a.toLowerCase() !== addr.toLowerCase());
  const next = [addr, ...existing].slice(0, 20);
  localStorage.setItem(RECENTS_KEY, JSON.stringify(next));
}

function shortAddr(a: string): string {
  if (!a) return "";
  return `${a.slice(0, 6)}...${a.slice(-5)}`;
}

export function Send({ onBack }: { onBack: () => void }) {
  const { address } = useAccount();
  const [screen, setScreen] = useState<Screen>("recipients");
  const [recipient, setRecipient] = useState("");
  const [search, setSearch] = useState("");
  const [amount, setAmount] = useState("0");
  const [token, setToken] = useState<Token>(TOKENS[0]);
  const [picking, setPicking] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [recents, setRecents] = useState<string[]>([]);

  useEffect(() => setRecents(loadRecents()), []);

  function press(k: string) {
    setAmount((cur) => {
      if (k === "back") return cur.length <= 1 ? "0" : cur.slice(0, -1);
      if (k === ".") return cur.includes(".") ? cur : cur + ".";
      if (cur === "0") return k;
      return cur + k;
    });
  }

  function pickRecipient(a: string) {
    setRecipient(a);
    setScreen("compose");
  }

  const hasAmount = amount !== "0" && amount !== "0." && amount !== "";
  const numAmount = Number(amount) || 0;
  const price = FAKE_PRICES[token.symbol] ?? 1;
  const usdAmount = (numAmount * price).toFixed(2);
  const tokenAmount = numAmount.toFixed(5);

  async function confirm() {
    setConfirming(true);
    setTimeout(() => {
      setConfirming(false);
      const fake = "0x" + Math.random().toString(16).slice(2, 10) + Math.random().toString(16).slice(2, 6) + "...";
      setTxHash(fake);
      if (recipient) saveRecent(recipient);
      setTimeout(() => onBack(), 1500);
    }, 1200);
  }

  const filteredRecents = search.trim()
    ? recents.filter((a) => a.toLowerCase().includes(search.toLowerCase()))
    : recents;

  if (screen === "recipients") {
    const canProceedTyped = search.startsWith("0x") && search.length >= 6;
    return (
      <div className="fixed inset-0 z-30 bg-bg flex flex-col">
        <div className="flex items-center justify-between px-5 pt-6 pb-4">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="glass w-10 h-10 rounded-full flex items-center justify-center">
              <X size={18} className="text-ink" />
            </button>
            <div className="text-lg font-bold">Send</div>
          </div>
          <button
            onClick={() => canProceedTyped && pickRecipient(search)}
            disabled={!canProceedTyped}
            className="w-10 h-10 rounded-full glass flex items-center justify-center disabled:opacity-30"
            aria-label="add"
          >
            <Plus size={16} className="text-ink" />
          </button>
        </div>

        <div className="px-5 pb-3 flex items-center gap-2 text-sm font-bold text-ink">
          Recents
        </div>

        <div className="flex-1 overflow-y-auto hide-scrollbar px-3 pb-4">
          {filteredRecents.length === 0 ? (
            <div className="text-center text-sm text-muted py-10">
              No recent addresses yet
            </div>
          ) : (
            filteredRecents.map((a) => (
              <button
                key={a}
                onClick={() => pickRecipient(a)}
                className="w-full flex items-center gap-3 px-2 py-3 rounded-2xl hover:bg-white/40 transition"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 via-amber-300 to-rose-400" />
                <div className="text-sm font-mono">{shortAddr(a)}</div>
              </button>
            ))
          )}
        </div>

        <div className="px-4 pb-6">
          <div className="glass rounded-full pl-4 pr-2 py-2 flex items-center gap-3">
            <Search size={16} className="text-muted" />
            <input
              type="text"
              placeholder="0x wallet address"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent flex-1 text-sm focus:outline-none min-w-0"
            />
            <button className="w-9 h-9 rounded-full glass-strong flex items-center justify-center">
              <ScanLine size={16} className="text-ink" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === "review") {
    return (
      <div className="fixed inset-0 z-30 bg-bg flex flex-col">
        <div className="flex items-center gap-4 px-5 pt-6 pb-4">
          <button onClick={() => setScreen("compose")} className="glass w-10 h-10 rounded-full flex items-center justify-center">
            <ChevronLeft size={18} className="text-ink" />
          </button>
          <div className="text-lg font-bold">Review Send</div>
        </div>

        <div className="flex-1 flex flex-col px-6 pt-4 overflow-hidden">
          <div className="text-6xl sm:text-7xl font-bold tracking-tight mb-8">
            ${usdAmount}
          </div>

          <div className="mt-auto space-y-4">
            <div className="flex items-start justify-between border-b border-black/10 pb-4">
              <div>
                <div className="text-xs text-muted uppercase tracking-widest mb-1">Recipient</div>
                <div className="font-mono">{shortAddr(recipient)}</div>
              </div>
              <ChevronDown size={18} className="text-muted mt-4" />
            </div>

            <div className="flex items-start justify-between border-b border-black/10 pb-4">
              <div>
                <div className="text-xs text-muted uppercase tracking-widest mb-1">Expected Delivery</div>
                <div>Average <span className="text-muted">· 30s</span></div>
              </div>
              <ChevronDown size={18} className="text-muted mt-4" />
            </div>

            <div className="flex items-start justify-between border-b border-black/10 pb-4">
              <div>
                <div className="text-xs text-muted uppercase tracking-widest mb-1">Payment</div>
                <div>{token.symbol} <span className="text-muted">· Up to $0.0074 fee</span></div>
              </div>
              <ChevronDown size={18} className="text-muted mt-4" />
            </div>

            <div className="pb-4">
              <div className="text-xs text-muted uppercase tracking-widest mb-1">Sending</div>
              <div className="font-mono">{tokenAmount} {token.symbol}</div>
            </div>

            {txHash && (
              <div className="text-xs text-success font-mono text-center pb-2 break-all">
                Sent · {txHash}
              </div>
            )}
          </div>
        </div>

        <div className="px-6 pb-8 pt-2">
          <button
            onClick={confirm}
            disabled={confirming || !!txHash}
            className="glass-btn w-full py-4 rounded-full text-base font-bold"
          >
            {txHash ? "Sent" : confirming ? "Confirming..." : "Confirm"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-30 bg-bg flex flex-col">
      <div className="flex items-center px-5 pt-6 pb-4">
        <button onClick={() => setScreen("recipients")} className="glass w-10 h-10 rounded-full flex items-center justify-center">
          <ChevronLeft size={18} className="text-ink" />
        </button>
        <div className="ml-4">
          <div className="text-lg font-bold leading-tight">Send</div>
          <div className="text-xs font-mono text-muted">{shortAddr(recipient)}</div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6">
        <div className="text-6xl sm:text-8xl font-bold tracking-tight text-ink mb-8 leading-none">
          {hasAmount ? <>${usdAmount}</> : <span className="text-muted">$0</span>}
        </div>
      </div>

      <div className="px-6 pb-2">
        <button
          onClick={() => setPicking(true)}
          className="flex items-center justify-between w-full py-2 mb-4"
        >
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${COLOR_MAP[token.symbol] ?? "from-gray-500 to-gray-700"} flex items-center justify-center text-[10px] font-bold text-white`}>
              {token.symbol.charAt(0)}
            </div>
            <span className="text-sm font-bold uppercase tracking-wide">e{token.symbol}</span>
            <span className="text-sm text-muted">· ${price.toFixed(2)}</span>
          </div>
          <ChevronDown size={18} className="text-muted" />
        </button>

        {!hasAmount ? (
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[25, 50, 100].map((p) => (
              <button
                key={p}
                onClick={() => setAmount(String(p))}
                className="glass rounded-full py-3 text-sm font-bold tracking-wide text-muted hover:text-ink transition"
              >
                {p}%
              </button>
            ))}
          </div>
        ) : (
          <button
            onClick={() => setScreen("review")}
            className="glass-btn w-full py-4 rounded-full text-base font-bold mb-4"
          >
            Continue
          </button>
        )}
      </div>

      <div className="px-6 pb-8">
        <div className="grid grid-cols-3 gap-y-3 gap-x-2 text-center">
          {["1","2","3","4","5","6","7","8","9",".","0","back"].map((k) => (
            <button
              key={k}
              onClick={() => press(k)}
              className="text-2xl sm:text-3xl font-medium py-2 hover:opacity-60 transition text-ink flex items-center justify-center"
            >
              {k === "back" ? <Delete size={22} strokeWidth={1.5} /> : k}
            </button>
          ))}
        </div>
      </div>

      {picking && (
        <TokenPicker
          current={token}
          onPick={setToken}
          onClose={() => setPicking(false)}
          label="Private balance"
          encrypted
        />
      )}
    </div>
  );
}

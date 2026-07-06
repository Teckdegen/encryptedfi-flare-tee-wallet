"use client";
import { ChevronDown, Wallet } from "lucide-react";
import { useState } from "react";
import { useAccount, useBalance } from "wagmi";
import { formatEther } from "viem";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export type Mode = "public" | "private";

const FLR_USD = 0.0068;

export function BalanceCard({ mode }: { mode: Mode }) {
  const { address, isConnected } = useAccount();
  const { data: nativeBal } = useBalance({ address, query: { enabled: !!address } });
  const [expanded, setExpanded] = useState(false);

  if (!isConnected) {
    return (
      <div className="glass rounded-3xl p-6 mb-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-400 via-amber-300 to-rose-400 opacity-70" />
        <div className="text-xs text-muted mb-3 uppercase tracking-widest">Balance</div>
        <ConnectButton.Custom>
          {({ openConnectModal, mounted }) => {
            if (!mounted) return null;
            return (
              <button
                onClick={openConnectModal}
                className="glass-btn w-full py-4 rounded-2xl text-sm font-bold tracking-widest uppercase flex items-center justify-center gap-2"
              >
                <Wallet size={16} />
                Connect Wallet
              </button>
            );
          }}
        </ConnectButton.Custom>
      </div>
    );
  }

  const flr = nativeBal ? Number(formatEther(nativeBal.value)) : 0;
  const publicUsd = flr * FLR_USD;
  const privateUsd = 0;

  const total = mode === "private" ? privateUsd : publicUsd;
  const display = `$${total.toFixed(2)}`;
  const [dollars, cents] = display.split(".");

  return (
    <div className="glass rounded-3xl p-6 mb-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-400 via-amber-300 to-rose-400 opacity-70" />
      <div className="flex items-center gap-2 text-sm text-muted mb-2">
        <span>Syncing</span>
        <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
      </div>
      <div className="flex items-end justify-between">
        <div className="text-5xl font-bold tracking-tight">
          <span>{dollars}</span>
          {cents !== undefined && <span className="text-muted">.{cents}</span>}
        </div>
        <button
          onClick={() => setExpanded((e) => !e)}
          className="w-9 h-9 rounded-full bg-black/5 flex items-center justify-center hover:bg-black/10 transition"
        >
          <ChevronDown size={16} className={`text-muted transition ${expanded ? "rotate-180" : ""}`} />
        </button>
      </div>
      {mode === "public" && (
        <div className="text-xs text-muted mt-1">1 FLR = ${FLR_USD.toFixed(4)}</div>
      )}
      {expanded && mode === "public" && (
        <div className="mt-4 pt-4 border-t border-black/5 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted">C2FLR</span>
            <span className="font-mono">{flr.toFixed(4)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

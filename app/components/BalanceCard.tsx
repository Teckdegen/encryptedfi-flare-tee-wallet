"use client";
import { ChevronDown, Wallet } from "lucide-react";
import { useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function BalanceCard({
  syncing,
  hidden,
  publicUsd,
  privateUsd,
}: {
  syncing: boolean;
  hidden: boolean;
  publicUsd: number;
  privateUsd: number;
}) {
  const { isConnected } = useAccount();
  const [expanded, setExpanded] = useState(false);
  const total = publicUsd + privateUsd;

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
        <div className="text-xs text-muted mt-4 text-center">
          Connect an EVM wallet on Coston2 to begin.
        </div>
      </div>
    );
  }

  const display = hidden ? "•••••" : `$${total.toFixed(2)}`;
  const [dollars, cents] = display.split(".");

  return (
    <div className="glass rounded-3xl p-6 mb-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-400 via-amber-300 to-rose-400 opacity-70" />
      <div className="flex items-center gap-2 text-sm text-muted mb-2">
        <span>{syncing ? "Syncing" : "Balance"}</span>
        {syncing && (
          <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
        )}
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
      {expanded && (
        <div className="mt-4 pt-4 border-t border-black/5 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted">Public</span>
            <span className="font-mono">{hidden ? "•••" : `$${publicUsd.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Private</span>
            <span className="font-mono">{hidden ? "•••" : `$${privateUsd.toFixed(2)}`}</span>
          </div>
        </div>
      )}
    </div>
  );
}

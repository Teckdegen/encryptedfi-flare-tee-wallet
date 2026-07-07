"use client";
import { Clock, ExternalLink } from "lucide-react";
import { useAccount } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { fetchAddressTransactions } from "../lib/explorer";

export function Activity() {
  const { address, isConnected } = useAccount();

  const { data, isLoading } = useQuery({
    queryKey: ["address-txs", address],
    queryFn: () => fetchAddressTransactions(address!),
    enabled: !!address,
    refetchInterval: 20000,
  });

  const txs = data ?? [];

  if (!isConnected) {
    return (
      <div className="glass rounded-3xl p-6">
        <div className="glass-strong rounded-2xl p-8 text-center">
          <Clock size={28} strokeWidth={1.5} className="mx-auto mb-3 text-muted" />
          <div className="text-sm font-bold uppercase tracking-widest mb-1">Connect wallet</div>
          <div className="text-xs text-muted">See your transactions here</div>
        </div>
      </div>
    );
  }

  if (isLoading && txs.length === 0) {
    return (
      <div className="glass rounded-3xl p-6">
        <div className="text-center text-sm text-muted animate-pulse py-6">Loading activity...</div>
      </div>
    );
  }

  if (txs.length === 0) {
    return (
      <div className="glass rounded-3xl p-6">
        <div className="glass-strong rounded-2xl p-8 text-center">
          <Clock size={28} strokeWidth={1.5} className="mx-auto mb-3 text-muted" />
          <div className="text-sm font-bold uppercase tracking-widest mb-1">No activity yet</div>
          <div className="text-xs text-muted">Wraps, transfers, and swaps show here</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {txs.slice(0, 30).map((tx) => {
        const outgoing = address && tx.from.hash.toLowerCase() === address.toLowerCase();
        const counter = outgoing ? tx.to?.hash : tx.from.hash;
        const short = counter ? `${counter.slice(0, 6)}...${counter.slice(-4)}` : "contract";
        const when = tx.timestamp ? new Date(tx.timestamp).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "";
        return (
          <a
            key={tx.hash}
            href={`https://coston2-explorer.flare.network/tx/${tx.hash}`}
            target="_blank"
            rel="noreferrer"
            className="glass rounded-2xl px-4 py-3 flex items-center justify-between hover:bg-white/40 transition"
          >
            <div>
              <div className="text-sm font-bold">{outgoing ? "Sent" : "Received"} {tx.method ? `· ${tx.method}` : ""}</div>
              <div className="text-xs text-muted font-mono">{outgoing ? "→" : "←"} {short}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted">{when}</div>
              <div className="text-[10px] text-muted flex items-center justify-end gap-1 mt-1">
                <ExternalLink size={10} />
                <span>#{tx.block}</span>
              </div>
            </div>
          </a>
        );
      })}
    </div>
  );
}

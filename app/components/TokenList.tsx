"use client";
import { useAccount } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { Mode } from "./BalanceCard";
import { fetchTokenBalances, formatBalance, symbolInitial, tokenGradient } from "../lib/explorer";

export function TokenList({ mode }: { mode: Mode }) {
  const { address, isConnected } = useAccount();

  const { data, isLoading } = useQuery({
    queryKey: ["token-balances", address],
    queryFn: () => fetchTokenBalances(address!),
    enabled: !!address && mode === "public",
    refetchInterval: 15000,
    staleTime: 10000,
  });

  const balances = data ?? [];

  if (!isConnected) {
    return (
      <div className="space-y-2">
        <div className="glass rounded-2xl px-4 py-8 text-center text-sm text-muted">
          Connect wallet to see balances
        </div>
      </div>
    );
  }

  if (mode === "private") {
    return (
      <div className="space-y-2">
        <div className="glass rounded-2xl px-4 py-8 text-center text-sm text-muted">
          No private notes yet · Shield a token to begin
        </div>
      </div>
    );
  }

  if (isLoading && balances.length === 0) {
    return (
      <div className="space-y-2">
        <div className="glass rounded-2xl px-4 py-8 text-center text-sm text-muted animate-pulse">
          Loading balances...
        </div>
      </div>
    );
  }

  if (balances.length === 0) {
    return (
      <div className="space-y-2">
        <div className="glass rounded-2xl px-4 py-8 text-center text-sm text-muted">
          No tokens held on this address
        </div>
      </div>
    );
  }

  const sorted = [...balances].sort((a, b) => {
    const na = formatBalance(a.value, a.token.decimals);
    const nb = formatBalance(b.value, b.token.decimals);
    return nb - na;
  });

  return (
    <div className="space-y-2">
      {sorted.map((b) => {
        const num = formatBalance(b.value, b.token.decimals);
        const display = num.toLocaleString(undefined, { maximumFractionDigits: 4 });
        const sym = b.token.symbol ?? "TOKEN";
        const name = b.token.name ?? "Unknown";
        const rate = b.token.exchange_rate ? Number(b.token.exchange_rate) : null;
        const usd = rate ? num * rate : null;
        return (
          <div key={b.token.address} className="glass rounded-2xl px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {b.token.icon_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={b.token.icon_url} alt={sym} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${tokenGradient(sym)} flex items-center justify-center text-sm font-bold text-white`}>
                  {symbolInitial(sym)}
                </div>
              )}
              <div>
                <div className="text-sm font-bold">{sym}</div>
                <div className="text-xs text-muted">{name}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-mono font-bold">{display}</div>
              {usd !== null && (
                <div className="text-[10px] text-muted">${usd.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

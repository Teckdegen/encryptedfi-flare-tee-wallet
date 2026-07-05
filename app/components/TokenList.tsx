"use client";
import { useAccount, useReadContracts } from "wagmi";
import { TOKENS, ERC20_ABI } from "../lib/contracts";
import { formatUnits } from "viem";
import { Filter } from "./FilterTabs";

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

export function TokenList({ filter, hidden }: { filter: Filter; hidden: boolean }) {
  const { address, isConnected } = useAccount();
  const { data: balances } = useReadContracts({
    contracts: TOKENS.map((t) => ({
      address: t.address as `0x${string}`,
      abi: ERC20_ABI,
      functionName: "balanceOf" as const,
      args: address ? [address] : undefined,
    })),
    query: { enabled: !!address, refetchInterval: 5000 },
  });

  return (
    <div className="space-y-2">
      {TOKENS.map((t, i) => {
        const bal = balances?.[i]?.result as bigint | undefined;
        const publicFmt = bal !== undefined ? formatUnits(bal, t.decimals) : "0";
        const publicNum = Number(publicFmt);

        let mainDisplay = "";
        if (!isConnected) mainDisplay = "—";
        else if (hidden) mainDisplay = "•••";
        else if (filter === "public") mainDisplay = publicNum.toLocaleString(undefined, { maximumFractionDigits: 4 });
        else if (filter === "private") mainDisplay = "···";
        else mainDisplay = publicNum.toLocaleString(undefined, { maximumFractionDigits: 4 });

        return (
          <div key={t.symbol} className="glass rounded-2xl px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${COLOR_MAP[t.symbol] ?? "from-gray-500 to-gray-700"} flex items-center justify-center text-sm font-bold text-white`}>
                {t.symbol.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-bold">{t.symbol}</div>
                <div className="text-xs text-muted">{t.name}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-mono font-bold">{mainDisplay}</div>
              <div className="text-[10px] text-muted uppercase tracking-widest">{filter}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

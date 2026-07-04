"use client";
import { useAccount } from "wagmi";
import { Eye, EyeOff, RefreshCw } from "lucide-react";

export function Header({
  hidden,
  onToggleHidden,
  onRefresh,
}: {
  hidden: boolean;
  onToggleHidden: () => void;
  onRefresh: () => void;
}) {
  const { address } = useAccount();
  const short = address ? `${address.slice(2, 6).toUpperCase()}` : "";

  return (
    <div className="flex items-center justify-between px-1 mb-4">
      <div className="glass rounded-full pl-1 pr-4 py-1 flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 via-amber-300 to-rose-400" />
        <span className="text-xs font-bold tracking-widest">ACCOUNT {short || "1"}</span>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={onToggleHidden} className="glass w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition">
          {hidden ? <EyeOff size={16} className="text-muted" /> : <Eye size={16} className="text-ink" />}
        </button>
        <button onClick={onRefresh} className="glass w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition">
          <RefreshCw size={16} className="text-ink" />
        </button>
      </div>
    </div>
  );
}

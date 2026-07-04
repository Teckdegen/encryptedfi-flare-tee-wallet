"use client";
import { useAccount, useDisconnect, useChainId, useBalance } from "wagmi";
import { PROTOCOL, VAULT, RELAYER } from "../lib/contracts";
import { formatEther } from "viem";
import { Copy, LogOut, ExternalLink } from "lucide-react";
import { useState } from "react";

export function Settings() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { data: nativeBal } = useBalance({ address });
  const [copied, setCopied] = useState<string | null>(null);

  const short = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";
  const bal = nativeBal ? formatEther(nativeBal.value) : "0";

  function copy(v: string, k: string) {
    navigator.clipboard.writeText(v);
    setCopied(k);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div className="space-y-4">
      <div className="glass rounded-3xl p-6">
        <div className="text-xs uppercase tracking-widest text-muted mb-4">Wallet</div>

        <div className="glass-strong rounded-2xl p-4 mb-3">
          <div className="text-xs text-muted uppercase tracking-widest mb-1">Address</div>
          <button onClick={() => copy(address ?? "", "addr")} className="text-sm font-mono w-full text-left break-all flex items-center justify-between gap-2">
            <span>{short}</span>
            <Copy size={14} className={copied === "addr" ? "text-success" : "text-muted"} />
          </button>
        </div>

        <div className="glass-strong rounded-2xl p-4 mb-3">
          <div className="text-xs text-muted uppercase tracking-widest mb-1">Native balance</div>
          <div className="text-sm font-mono">{Number(bal).toFixed(4)} C2FLR</div>
        </div>

        <div className="glass-strong rounded-2xl p-4">
          <div className="text-xs text-muted uppercase tracking-widest mb-1">Network</div>
          <div className="text-sm font-mono flex items-center gap-2">
            {chainId === 114 ? (
              <>
                <span className="w-2 h-2 rounded-full bg-success" />
                Flare Coston2
              </>
            ) : `Chain ${chainId}`}
          </div>
        </div>
      </div>

      <div className="glass rounded-3xl p-6">
        <div className="text-xs uppercase tracking-widest text-muted mb-4">Contracts</div>
        <div className="space-y-3 text-xs">
          {[
            { label: "Protocol", addr: PROTOCOL },
            { label: "Vault", addr: VAULT },
            { label: "Relayer", addr: RELAYER },
          ].map(({ label, addr }) => (
            <div key={label}>
              <div className="text-muted uppercase tracking-widest mb-1">{label}</div>
              <button onClick={() => copy(addr, label)} className="font-mono break-all text-left w-full hover:text-success transition flex items-center justify-between gap-2">
                <span className="flex-1">{addr}</span>
                <Copy size={12} className={copied === label ? "text-success" : "text-muted"} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-3xl p-6">
        <div className="text-xs uppercase tracking-widest text-muted mb-4">Links</div>
        <a href="https://coston2-explorer.flare.network" target="_blank" rel="noreferrer" className="glass-strong rounded-2xl p-4 flex items-center justify-between hover:bg-white/10 transition mb-2">
          <span className="text-sm">Coston2 Explorer</span>
          <ExternalLink size={14} className="text-muted" />
        </a>
        <a href="https://github.com/encryptedfinance/encryptedfinance-flare" target="_blank" rel="noreferrer" className="glass-strong rounded-2xl p-4 flex items-center justify-between hover:bg-white/10 transition">
          <span className="text-sm">GitHub</span>
          <ExternalLink size={14} className="text-muted" />
        </a>
      </div>

      <button
        onClick={() => disconnect()}
        className="w-full py-4 rounded-2xl text-sm font-bold tracking-widest uppercase bg-danger/10 border border-danger/30 text-danger hover:bg-danger/20 transition flex items-center justify-center gap-2"
      >
        <LogOut size={16} />
        Disconnect wallet
      </button>

      <div className="text-center text-[10px] text-muted uppercase tracking-widest pt-4 pb-4">
        Encrypted Finance · v0.1.0 · Coston2 Beta
      </div>
    </div>
  );
}

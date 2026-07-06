"use client";
import { useAccount, useDisconnect } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { LogOut, Wallet, ExternalLink } from "lucide-react";

export function Settings() {
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <div className="space-y-4">
      <div className="glass rounded-3xl p-6">
        <div className="text-xs uppercase tracking-widest text-muted mb-4">Wallet</div>
        {!isConnected ? (
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
        ) : (
          <button
            onClick={() => disconnect()}
            className="w-full py-4 rounded-2xl text-sm font-bold tracking-widest uppercase bg-danger/10 border border-danger/30 text-danger hover:bg-danger/20 transition flex items-center justify-center gap-2"
          >
            <LogOut size={16} />
            Disconnect wallet
          </button>
        )}
      </div>

      <div className="glass rounded-3xl p-6">
        <div className="text-xs uppercase tracking-widest text-muted mb-4">Links</div>
        <a href="https://coston2-explorer.flare.network" target="_blank" rel="noreferrer" className="glass-strong rounded-2xl p-4 flex items-center justify-between hover:bg-white/40 transition mb-2">
          <span className="text-sm">Coston2 Explorer</span>
          <ExternalLink size={14} className="text-muted" />
        </a>
        <a href="https://github.com/encryptedfinance/encryptedfinance-flare" target="_blank" rel="noreferrer" className="glass-strong rounded-2xl p-4 flex items-center justify-between hover:bg-white/40 transition">
          <span className="text-sm">GitHub</span>
          <ExternalLink size={14} className="text-muted" />
        </a>
      </div>

      <div className="text-center text-[10px] text-muted uppercase tracking-widest pt-4 pb-4">
        Encrypted Finance · v0.1.0 · Coston2 Beta
      </div>
    </div>
  );
}

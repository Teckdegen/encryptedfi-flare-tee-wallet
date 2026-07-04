"use client";
import { useState } from "react";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { Welcome } from "./components/Welcome";
import { Nav, Page } from "./components/Nav";
import { Home } from "./components/Home";
import { SubHeader } from "./components/SubHeader";
import { Shield } from "./components/Shield";
import { Send } from "./components/Send";
import { Receive } from "./components/Receive";
import { Swap } from "./components/Swap";
import { Earn } from "./components/Earn";
import { Activity } from "./components/Activity";
import { Settings } from "./components/Settings";
import { AlertTriangle } from "lucide-react";

export default function Index() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [page, setPage] = useState<Page>("home");

  if (!isConnected) return <Welcome />;

  if (chainId !== 114) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 relative z-10">
        <div className="glass rounded-3xl p-8 max-w-md w-full text-center">
          <AlertTriangle size={40} className="mx-auto mb-4 text-amber-400" />
          <h2 className="text-xl font-bold mb-2">Wrong network</h2>
          <p className="text-sm text-muted mb-6">Switch to Flare Coston2 to continue.</p>
          <button
            onClick={() => switchChain({ chainId: 114 })}
            className="glass-btn w-full py-4 rounded-2xl text-sm font-bold tracking-widest uppercase"
          >
            Switch to Coston2
          </button>
        </div>
      </main>
    );
  }

  const isSubPage = ["send", "receive", "shield", "swap", "earn"].includes(page);
  const subTitle: Record<string, string> = {
    send: "Send",
    receive: "Receive",
    shield: "Shield",
    swap: "Swap",
    earn: "Earn",
  };

  return (
    <main className="min-h-screen relative z-10 pb-28">
      <div className="max-w-md mx-auto px-4 pt-6">
        {page === "home" && <Home onGo={setPage} />}
        {isSubPage && (
          <>
            <SubHeader title={subTitle[page]} onBack={() => setPage("home")} />
            {page === "send" && <Send />}
            {page === "receive" && <Receive />}
            {page === "shield" && <Shield />}
            {page === "swap" && <Swap />}
            {page === "earn" && <Earn />}
          </>
        )}
        {page === "activity" && (
          <>
            <SubHeader title="Activity" onBack={() => setPage("home")} />
            <Activity />
          </>
        )}
        {page === "settings" && (
          <>
            <SubHeader title="Settings" onBack={() => setPage("home")} />
            <Settings />
          </>
        )}
      </div>
      <Nav current={page} onChange={setPage} />
    </main>
  );
}

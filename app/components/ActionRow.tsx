"use client";
import { ArrowUp, ArrowDown, Shield, ArrowUpDown, LucideIcon } from "lucide-react";
import { useAccount } from "wagmi";
import { Page } from "./Nav";

export function ActionRow({ onGo }: { onGo: (page: Page) => void }) {
  const { isConnected } = useAccount();
  const actions: { id: Page; label: string; Icon: LucideIcon }[] = [
    { id: "send", label: "SEND", Icon: ArrowUp },
    { id: "receive", label: "RECEIVE", Icon: ArrowDown },
    { id: "shield", label: "SHIELD", Icon: Shield },
    { id: "swap", label: "SWAP", Icon: ArrowUpDown },
  ];
  return (
    <div className="grid grid-cols-4 gap-2 mb-6">
      {actions.map(({ id, label, Icon }) => (
        <button
          key={id}
          onClick={() => onGo(id)}
          disabled={!isConnected}
          className="flex flex-col items-center gap-2 py-2 hover:opacity-80 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <div className="glass w-14 h-14 rounded-full flex items-center justify-center">
            <Icon size={22} strokeWidth={1.8} className="text-ink" />
          </div>
          <span className="text-[10px] font-bold tracking-widest text-muted">{label}</span>
        </button>
      ))}
    </div>
  );
}

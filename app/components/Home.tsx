"use client";
import { useState } from "react";
import { BalanceCard, Mode } from "./BalanceCard";
import { ActionRow } from "./ActionRow";
import { ModeToggle } from "./ModeToggle";
import { TokenList } from "./TokenList";
import { Page } from "./Nav";

export function Home({ onGo }: { onGo: (page: Page) => void }) {
  const [mode, setMode] = useState<Mode>("public");

  return (
    <div>
      <BalanceCard mode={mode} />
      <ActionRow onGo={onGo} mode={mode} />
      <ModeToggle mode={mode} onChange={setMode} />
      <TokenList mode={mode} />
    </div>
  );
}

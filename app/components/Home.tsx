"use client";
import { useState } from "react";
import { Header } from "./Header";
import { BalanceCard } from "./BalanceCard";
import { ActionRow } from "./ActionRow";
import { FilterTabs, Filter } from "./FilterTabs";
import { TokenList } from "./TokenList";
import { Page } from "./Nav";
import { useAccount } from "wagmi";

export function Home({ onGo }: { onGo: (page: Page) => void }) {
  const { isConnected } = useAccount();
  const [filter, setFilter] = useState<Filter>("all");
  const [hidden, setHidden] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div key={refreshKey}>
      <Header
        hidden={hidden}
        onToggleHidden={() => setHidden((h) => !h)}
        onRefresh={() => setRefreshKey((k) => k + 1)}
      />
      <BalanceCard syncing={isConnected} hidden={hidden} publicUsd={0} privateUsd={0} />
      <ActionRow onGo={onGo} />
      <FilterTabs current={filter} onChange={setFilter} />
      <TokenList filter={filter} hidden={hidden} />
    </div>
  );
}

"use client";
import { SwapCard } from "./SwapCard";

export function Swap() {
  return (
    <SwapCard
      title="Swap"
      fromLabel="You Pay"
      toLabel="You Receive"
      submitLabel="Coming soon (TEE required)"
      hint="Private swaps route through the TEE. Activates when FCC registration completes."
    />
  );
}

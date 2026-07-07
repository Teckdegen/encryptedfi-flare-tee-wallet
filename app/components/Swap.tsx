"use client";
import { SwapCard } from "./SwapCard";

export function Swap() {
  return (
    <SwapCard
      title="Swap"
      mode="swap"
      submitLabel="Coming soon (TEE required)"
      hint="Private swap between two encrypted notes. Activates with FCC."
    />
  );
}

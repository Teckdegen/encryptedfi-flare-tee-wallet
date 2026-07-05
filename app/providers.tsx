"use client";
import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider, getDefaultConfig, lightTheme } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { defineChain, http } from "viem";
import { ReactNode } from "react";
import { COSTON2 } from "./lib/contracts";

const coston2 = defineChain(COSTON2);

const config = getDefaultConfig({
  appName: "Encrypted Finance",
  projectId: "ENCRYPTEDFI_COSTON2_BETA",
  chains: [coston2],
  transports: { [coston2.id]: http(coston2.rpcUrls.default.http[0]) },
  ssr: true,
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={lightTheme({ accentColor: "#1a1a1a", accentColorForeground: "#f5f1e8", borderRadius: "large" })}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

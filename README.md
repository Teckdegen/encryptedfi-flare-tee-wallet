# Encrypted Finance wallet

Next.js wallet for Encrypted Finance on Flare Coston2. Privacy preserving DeFi where your real 0x address is the private address.

## What it does

- Connect any EVM wallet (MetaMask, Rabby, Frame, WalletConnect) via RainbowKit
- Auto detect Coston2, prompt switch on wrong chain
- View public token balances for 10 cypherpunk test tokens
- Faucet: claim all 10 tokens (24 hour cooldown)
- Shield: wrap public tokens into encrypted notes (live on chain)
- Unshield, Send privately, Swap: UI shipped, activates when the FCC TEE finishes registering
- Earn: 5 cToken lending markets with live APR
- Settings: address, contracts, links, disconnect
- Real iOS glass effect throughout the UI

## Live Coston2 addresses

| Contract | Address |
|---|---|
| EncryptedFiProtocol | `0x99fb4A402C64CB44279240bB1eA88F9D291CdAA6` |
| EncryptedVault | `0xf4028BB66B293d955F0f2A852Bb6ef1d6096FA01` |
| TeeRelayer | `0x8f217a71dC852Bd14021352418fFbc4359910451` |
| TestFaucet | `0x8F8184c1d1842d18cB789102Deaa09baEF0c344D` |

All token and cToken addresses live in `app/lib/contracts.ts`.

## Stack

- Next.js 14 app router
- wagmi 2 + viem 2
- RainbowKit for wallet connect
- Tailwind for styling with real iOS glass effect
- lucide-react for icons
- TypeScript

## Run locally

```bash
npm install
npm run dev
```

Opens at http://localhost:3000

Native token faucet at https://coston2-faucet.flare.network

## Deploy to Vercel

```bash
npx vercel
```

No environment variables required. All reads and the shield flow hit Coston2 RPC directly through the connected wallet.

## Roadmap

Everything the UI shows works today except Send, Swap, and Unshield. Those unlock when the Encrypted Finance FCC TEE finishes registering on Coston2. The frontend does not change when that happens, only the backend relayer does.

## License

MIT

# Encrypted Finance test frontend

Next.js 14 demo wallet for the Coston2 beta deployment.

## What works today

- Wallet connect via RainbowKit (MetaMask, WalletConnect, etc.)
- Coston2 chain detection and switch prompt
- Faucet: claim all 10 cypherpunk tokens
- Real time balance display for all 10 tokens
- Wrap a token into an encrypted note (deposit flow, on chain)
- Lending markets list with APR

## What activates with FCC

- Private transfer (needs TEE relayer)
- Private lending (needs TEE relayer)
- Selective disclosure (needs TEE relayer)

These show up as disabled in the UI until FCC registration completes.

## Run locally

```bash
cd test-frontend
npm install
npm run dev
```

Opens at http://localhost:3000

## Deploy to Vercel

```bash
npx vercel
```

No backend or environment variables needed for the demo. All reads and the wrap flow hit Coston2 RPC directly through the user's connected wallet.

## Stack

- Next.js 14 with app router
- wagmi 2 + viem 2 + RainbowKit for wallet
- TailwindCSS for styling
- TypeScript

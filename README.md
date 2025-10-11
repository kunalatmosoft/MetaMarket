# Metamarket

Metamarket is a decentralized prediction market platform built with [Next.js](https://nextjs.org) and [Hardhat](https://hardhat.org). Users can create, participate, and resolve markets using blockchain technology. It supports real-time tracking of bets, smart contract-based transactions, and local blockchain development using Ganache.

---

## Features

- ✅ **Create Markets** – Users can create prediction markets with custom questions and resolution sources.  
- ✅ **Place Bets** – Participate by betting on "Yes" or "No" outcomes using ETH.  
- ✅ **Real-time Updates** – Market shares and user positions are updated instantly.  
- ✅ **Resolve Markets** – Market creators can resolve markets after the resolution date.  
- ✅ **User Dashboard** – View your current bets, total positions, and claim payouts for resolved markets.  
- ✅ **Local Blockchain Support** – Fully compatible with Ganache for testing and local development.  
- ✅ **Recharts Integration** – Visualize market trends with real-time charts.  
- ✅ **Persistence** – Market data is stored locally for instant reloads and offline testing.

---

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
Start editing the page by modifying `app/page.js`. The page auto-updates as you edit.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a modern font family by Vercel.

---

## Project Structure

```
├─ app/              # Next.js pages and components
├─ components/       # UI components (MarketCard, BetDrawer, etc.)
├─ scripts/          # Hardhat deployment scripts
├─ lib/              # Helper functions (contract interaction)
├─ ganache-data/     # Ganache blockchain DB
├─ package.json
└─ README.md
```

---

## Installation & Setup Guide

### 1. Create Next.js Project

```bash
npx create-next-app@latest .
```

### 2. Initialize Hardhat

```bash
npx hardhat --init
```

### 3. Install Dependencies

Add any extra dependencies as needed (e.g., OpenZeppelin).

### 4. Compile Solidity Contracts

```bash
npx hardhat compile
```

### 5. Deploy Contracts to a Network

```bash
npx hardhat run scripts/deploy.js --network ganache
```

> Replace `ganache` with `localhost`, `sepolia`, `megaeth`, or other networks as needed.

### 6. Start Ganache Local Blockchain

```bash
npx ganache --wallet.seed "metamarket" --db ./ganache-data --port 8585
```

> "metamarket" is the mnemonic; you can use a different one.
> This creates 100 ETH wallets for testing in Metamask.

---

## Ganache Network Details for Metamask

| Field                  | Value / Instruction               |
| ---------------------- | --------------------------------- |
| **Network Name**       | Ganache Localhost 8585            |
| **New RPC URL**        | `http://127.0.0.1:8585`           |
| **Chain ID**           | `1337` (default Ganache chain ID) |
| **Currency Symbol**    | ETH                               |
| **Block Explorer URL** | Leave empty (optional)            |

---

## Learn More

To learn more about the frameworks and tools used:

* [Next.js Documentation](https://nextjs.org/docs) – Learn about Next.js features and API.
* [Hardhat Documentation](https://hardhat.org/getting-started/) – Learn about smart contract development.
* [Ganache Documentation](https://trufflesuite.com/ganache/) – For local blockchain testing.
* [OpenZeppelin](https://openzeppelin.com/contracts/) – For secure smart contract standards.

---

## Security & Best Practices

* Never expose private keys or mnemonic phrases in the repository.
* Use Ganache local blockchain for testing instead of real funds.
* Keep dependencies updated and monitor for vulnerabilities.
* Always validate user inputs before interacting with smart contracts.

---

# Happy Blockchain Verse 🤝

Metamarket combines decentralized finance, prediction markets, and modern web development for a complete Web3 experience.

---

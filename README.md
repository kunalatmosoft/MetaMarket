This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

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

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Set up guide

### To create Next Repo
1. `npx create-next-app@latest .`
### To initialize the Hardhat ( VERSION 2 OLD)
2. `npx hardhat --init`
### Add Extra dependencies
3. add extra dependencies as per your requirements.(OpenZepplin...)
### To compile the solidity Code!
4. `npx hardhat compile`
### To deploy The Contracts on the network 
5. `npx hardhat run scripts/deploy.js --network ganache`  if Other network Use megaeth, localhost, sepolia etc.
### This is most important to run the blockChain on the node (Self BlockChain on the db).
6. `npx ganache --wallet.seed "metamarket" --db ./ganache-data --port 8545`. here "metamarket" is the mnemonic yu can use different one!
- this will create the private keys of (100ETH each use in the Metamask for Transactions)
details of the Ganache Network

| Field                  | Value / Instruction               |
| ---------------------- | --------------------------------- |
| **Network Name**       | Ganache Localhost 8585            |
| **New RPC URL**        | `http://127.0.0.1:8585`           |
| **Chain ID**           | `1337` (default Ganache chain ID) |
| **Currency Symbol**    | ETH                     |
| **Block Explorer URL** | Leave empty (optional)            |



# Happy BlockChain Verse 🤝 



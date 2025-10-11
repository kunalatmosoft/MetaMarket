import { ethers } from "ethers";
import PredictMarketABI from "../artifacts/contracts/polymarket.sol/PredictionMarket.json";

const CONTRACT_ADDRESS = "0x38fb23A49FD1976f2D8Dddf2a283D4CFB07b1e6c"; // your deployed contract
const GANACHE_RPC_URL = "http://127.0.0.1:8545"; // default Ganache RPC
const PRIVATE_KEY = "0xb4345b3b6aa9f3e95393bbeb90419315b8e9d3364629c9b3bf788f00df4d68d4"; // copy from Ganache UI

export async function getContract() {
  // Connect to local Ganache provider
  const provider = new ethers.JsonRpcProvider(GANACHE_RPC_URL);

  // Create signer using one of your Ganache private keys
  const signer = new ethers.Wallet(PRIVATE_KEY, provider);

  // Create and return contract instance
  const contract = new ethers.Contract(CONTRACT_ADDRESS, PredictMarketABI.abi, signer);
  return contract;
}


/* import { ethers } from 'ethers';
import PredictMarketABI from '../artifacts/contracts/polymarket.sol/PredictionMarket.json'; // Corrected path

const CONTRACT_ADDRESS = '0x38fb23A49FD1976f2D8Dddf2a283D4CFB07b1e6c'; // ✅ Your deployed contract address

export async function getContract() {
  // Ensure MetaMask is available
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMask is not installed or wallet not detected');
  }

  // Initialize ethers provider and signer
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  // Network check (especially important for MegaETH testnet)
  const network = await provider.getNetwork();
  const expectedChainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '6342'); // MegaETH testnet Chain ID

  if (Number(network.chainId) !== expectedChainId) {
    throw new Error(`Please switch to the correct network (Chain ID: ${expectedChainId})`);
  }

  // Return contract instance
  return new ethers.Contract(CONTRACT_ADDRESS, PredictMarketABI.abi, signer);
}
 */
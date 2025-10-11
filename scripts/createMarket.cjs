const hre = require("hardhat");
const { ethers } = hre;

// Replace with your deployed contract address
const CONTRACT_ADDRESS = "0x38fb23A49FD1976f2D8Dddf2a283D4CFB07b1e6c";

const main = async () => {
  // Verify ethers.utils is available
  if (!ethers || !ethers.utils) {
    throw new Error("ethers.utils is undefined. Ensure @nomicfoundation/hardhat-toolbox is installed and Hardhat is configured correctly.");
  }

  const [owner] = await ethers.getSigners();
  console.log("Owner address:", owner.address);

  const PredictionMarket = await ethers.getContractFactory("PredictionMarket");
  const predictionMarket = PredictionMarket.attach(CONTRACT_ADDRESS);

  // Use ethers.utils.toUtf8Bytes for encoding JSON metadata
  const metadata = ethers.utils.toUtf8Bytes(
    JSON.stringify({
      question: "Will ETH reach 3000 USD by next month?",
      description: "Prediction market on ETH price",
      category: "Crypto",
      resolutionSource: "CoinGecko API",
    })
  );

  const resolutionDate = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
  const initialLiquidity = ethers.utils.parseEther("1"); // 1 ETH

  console.log("Creating market with metadata:", JSON.parse(ethers.utils.toUtf8String(metadata)));
  console.log("Resolution date:", resolutionDate);
  console.log("Initial liquidity:", ethers.utils.formatEther(initialLiquidity), "ETH");

  const tx = await predictionMarket
    .connect(owner)
    .createMarket(metadata, resolutionDate, { value: initialLiquidity });
  await tx.wait();

  console.log("Market created successfully!");
};

main().catch((err) => {
  console.error("Error:", err);
  process.exitCode = 1;
});
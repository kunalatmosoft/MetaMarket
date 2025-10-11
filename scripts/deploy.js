import hre from "hardhat";

const main = async () => {
  const PredictionMarket = await hre.ethers.getContractFactory("PredictionMarket");
  console.log("Deploying MetaMarket contract...");

  const predictionMarket = await PredictionMarket.deploy();
  await predictionMarket.waitForDeployment();

  console.log("MetaMarket deployed to:", await predictionMarket.getAddress());
};

// 0x38fb23A49FD1976f2D8Dddf2a283D4CFB07b1e6c

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

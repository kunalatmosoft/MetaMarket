import hre from "hardhat";

const main = async () => {
  const CrowdfundingFactory = await hre.ethers.getContractFactory("Crowdfunding");
  console.log("Deploying CrowdFunding contract...");

  const crowdfunding = await CrowdfundingFactory.deploy();
  await crowdfunding.waitForDeployment();

  console.log("CrowdFunding deployed to:", await crowdfunding.getAddress());
};

// CrowdFunding deployed to: 0x5dc5792Aa15188a56eE407783bEf791Ca646f551 

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

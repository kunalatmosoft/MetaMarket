"use client";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import CampaignCard from "@/components/CampaignCard";
import Layout from "@/components/Layout";
import CrowdfundingABI from "@/artifacts/contracts/CrowdFunding.sol/Crowdfunding.json";

const CROWDFUNDING_ADDRESS = "0xbc6c556fA0fB5f90d887eDF80628281219BdE91A";

export default function Home() {
  const [campaigns, setCampaigns] = useState([]);
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      setError(null);

      if (!window.ethereum) {
        setError("Please install MetaMask");
        setLoading(false);
        return;
      }

      try {
        // Request MetaMask account access
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const network = await provider.getNetwork();
        console.log("Connected network:", network.chainId, network.name);

        // Verify contract deployment
        const code = await provider.getCode(CROWDFUNDING_ADDRESS);
        if (code === "0x") {
          setError(`No contract deployed at ${CROWDFUNDING_ADDRESS}`);
          setLoading(false);
          return;
        }

        const signer = await provider.getSigner();
        const contractInstance = new ethers.Contract(
          CROWDFUNDING_ADDRESS,
          CrowdfundingABI.abi,
          signer
        );
        setContract(contractInstance);

        // Fetch campaign count
        let count;
        try {
          count = await contractInstance.campaignCount();
          console.log("Campaign count:", count.toString());
        } catch (err) {
          console.error("Error fetching campaign count:", err);
          setError("Failed to fetch campaign count. Check contract and network.");
          setLoading(false);
          return;
        }

        const campaignList = [];
        for (let i = 1; i <= Number(count); i++) {
          try {
            const campaign = await contractInstance.getCampaignDetails(i);
            console.log(`Campaign ${i}:`, campaign);
            campaignList.push({
              id: i,
              creator: campaign[0],
              title: campaign[1],
              description: campaign[2],
              goal: campaign[3].toString(),
              deadline: campaign[4].toString(),
              amountRaised: campaign[5].toString(),
              completed: campaign[6],
            });
          } catch (err) {
            console.error(`Error fetching campaign ${i}:`, err);
          }
        }

        console.log("Campaign list:", campaignList);
        setCampaigns(campaignList);
        if (campaignList.length === 0) {
          setError("No campaigns found. Create a campaign to get started.");
        }
      } catch (err) {
        console.error("Error initializing contract:", err);
        setError("Failed to initialize contract. Check console for details.");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);
  

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-4">Active Campaigns</h1>
      {loading ? (
        <p>Loading campaigns...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : campaigns.length === 0 ? (
        <p>No campaigns found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {campaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              id={campaign.id}
              campaign={campaign}
            />
          ))}
        </div>
      )}
    </Layout>
  );
}
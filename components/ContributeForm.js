"use client";
import { useState } from "react";
import { ethers } from "ethers";
import CrowdfundingABI from "@/artifacts/contracts/CrowdFunding.sol/Crowdfunding.json";

const CROWDFUNDING_ADDRESS = "0xbc6c556fA0fB5f90d887eDF80628281219BdE91A";

export default function ContributeForm({ campaignId }) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const contribute = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!amount || Number(amount) <= 0) {
        alert("Please enter a valid ETH amount.");
        setLoading(false);
        return;
      }

      if (!window.ethereum) {
        alert("MetaMask not found");
        setLoading(false);
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(
        CROWDFUNDING_ADDRESS,
        CrowdfundingABI.abi,
        signer
      );

      // Validate campaign exists
      try {
        const campaign = await contract.getCampaignDetails(campaignId);
        if (campaign[0] === "0x0000000000000000000000000000000000000000") {
          alert("Campaign does not exist");
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error("Error checking campaign:", error);
        alert("Failed to fetch campaign data. Campaign might not exist.");
        setLoading(false);
        return;
      }

      const campaignIdBigInt = BigInt(campaignId);
      const amountInWei = ethers.parseEther(amount);

      // Estimate gas
      let gasEstimate;
      try {
        gasEstimate = await contract.contribute.estimateGas(campaignIdBigInt, {
          value: amountInWei,
        });
        console.log("Gas estimate:", gasEstimate.toString());
      } catch (estimateError) {
        console.error("Gas estimation failed:", estimateError);
        alert("Transaction would fail. Check campaign status or amount.");
        setLoading(false);
        return;
      }

      // Execute transaction
      const tx = await contract.contribute(campaignIdBigInt, {
        value: amountInWei,
        gasLimit: gasEstimate + BigInt(10000),
      });

      console.log("Transaction sent:", tx.hash);
      const receipt = await tx.wait();
      console.log("Transaction confirmed:", receipt);

      alert("Contribution successful!");
      setAmount("");
    } catch (error) {
      console.error("Contribution failed:", error);
      if (error.code === "CALL_EXCEPTION") {
        alert(`Transaction failed: ${error.reason || "Campaign might be inactive or ended."}`);
      } else if (error.code === "ACTION_REJECTED") {
        alert("Transaction rejected by user.");
      } else if (error.code === "INSUFFICIENT_FUNDS") {
        alert("Insufficient funds for this transaction.");
      } else if (error.code === "NETWORK_ERROR") {
        alert("Network error. Please check your connection.");
      } else {
        alert(`Transaction failed: ${error.message || "Unknown error"}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Contribute to Campaign</h3>
      <form onSubmit={contribute} className="space-y-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
            Amount in ETH
          </label>
          <input
            id="amount"
            type="number"
            step="0.001"
            min="0.001"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.1"
            className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full px-4 py-3 rounded-md font-medium transition-colors ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600 text-white"
          }`}
        >
          {loading ? "Processing..." : `Contribute ${amount || "0"} ETH`}
        </button>
      </form>
    </div>
  );
}
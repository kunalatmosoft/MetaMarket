"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ethers } from "ethers";
import Layout from "@/components/Layout";
import ContributeForm from "@/components/ContributeForm";
import {
  User,
  Target,
  Coins,
  CalendarDays,
  BadgeCheck,
  Clock,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

import CrowdfundingABI from '@/artifacts/contracts/CrowdFunding.sol/Crowdfunding.json';

const CROWDFUNDING_ADDRESS = "0xbc6c556fA0fB5f90d887eDF80628281219BdE91A";

export default function CampaignDetail() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (typeof window !== "undefined" && window.ethereum && id) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        const contractInstance = new ethers.Contract(
          CROWDFUNDING_ADDRESS,
          CrowdfundingABI.abi,
          signer
        );
        setContract(contractInstance);

        try {
          const campaignData = await contractInstance.getCampaignDetails(id);
          setCampaign({
            creator: campaignData[0],
            title: campaignData[1],
            description: campaignData[2],
            goal: campaignData[3],
            deadline: campaignData[4],
            amountRaised: campaignData[5],
            completed: campaignData[6],
          });
        } catch (err) {
          console.error("Error fetching campaign:", err);
        }
      }
    };

    init();
  }, [id]);

  if (!campaign) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" />
        </div>
      </Layout>
    );
  }

  const progress = (Number(campaign.amountRaised) / Number(campaign.goal)) * 100;
  const deadlineDate = new Date(Number(campaign.deadline) * 1000);
  const isExpired = deadlineDate < new Date() && !campaign.completed;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8">
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">{campaign.title}</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400 text-lg">{campaign.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-1 text-gray-600 dark:text-gray-400">
                <span>Raised: {ethers.formatEther(campaign.amountRaised)} ETH</span>
                <span>Goal: {ethers.formatEther(campaign.goal)} ETH</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>Creator: <strong>{campaign.creator.slice(0, 6)}...{campaign.creator.slice(-4)}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span>Goal: <strong>{ethers.formatEther(campaign.goal)} ETH</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <span>Raised: <strong>{ethers.formatEther(campaign.amountRaised)} ETH</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                <span>Deadline: <strong>{deadlineDate.toLocaleDateString()}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                {campaign.completed ? (
                  <>
                    <BadgeCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span>Status: <Badge variant="default" className="bg-green-600 dark:bg-green-500">Completed</Badge></span>
                  </>
                ) : isExpired ? (
                  <>
                    <Clock className="w-5 h-5 text-red-600 dark:text-red-400" />
                    <span>Status: <Badge variant="destructive">Expired</Badge></span>
                  </>
                ) : (
                  <>
                    <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    <span>Status: <Badge variant="default" className="bg-blue-600 dark:bg-blue-500">Active</Badge></span>
                  </>
                )}
              </div>
            </div>
            {!campaign.completed && !isExpired && (
              <div className="pt-4">
                <ContributeForm campaignId={id} contract={contract} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
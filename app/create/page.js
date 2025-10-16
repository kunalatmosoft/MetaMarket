"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import CrowdfundingABI from '@/artifacts/contracts/CrowdFunding.sol/Crowdfunding.json';
import {
  Loader2,
  Heading,
  StickyNote,
  Coins,
  Target,
  CalendarClock,
  Rocket,
  Eye,
  Pencil,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CROWDFUNDING_ADDRESS = "0xbc6c556fA0fB5f90d887eDF80628281219BdE91A";

export default function CreateCampaign() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("create");
  const router = useRouter();

  const createCampaign = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!window.ethereum) {
        alert("Please install MetaMask");
        return;
      }

      await window.ethereum.request({ method: "eth_requestAccounts" });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        CROWDFUNDING_ADDRESS,
        CrowdfundingABI.abi,
        signer
      );

      const tx = await contract.createCampaign(
        title,
        description,
        ethers.parseEther(goal),
        duration * 24 * 60 * 60
      );

      await tx.wait();
      alert("Campaign created successfully!");
      router.push("/");
    } catch (error) {
      console.error("Create campaign error:", error);
      alert("Failed to create campaign");
    }

    setLoading(false);
  };

  // Calculate preview data
  const previewCampaign = {
    title,
    description,
    goal: goal ? ethers.parseEther(goal).toString() : "0",
    amountRaised: "0",
    deadline: duration ? (Math.floor(Date.now() / 1000) + Number(duration) * 24 * 60 * 60).toString() : "0",
    completed: false,
    creator: "0x...Creator",
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Rocket className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          Create New Campaign
        </h1>
        <Tabs defaultValue="create" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100 dark:bg-gray-800">
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Pencil className="w-5 h-5" />
              Create
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Preview
            </TabsTrigger>
          </TabsList>
          <TabsContent value="create">
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Campaign Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={createCampaign} className="space-y-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                      <Heading className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      Title
                    </Label>
                    <Input
                      id="title"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter campaign title"
                      className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                      <StickyNote className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your campaign"
                      className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-yellow-500 dark:focus:ring-yellow-400 transition-all"
                      rows={5}
                      required
                    />
                  </div>

                  {/* Goal */}
                  <div className="space-y-2">
                    <Label htmlFor="goal" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                      <Coins className="w-5 h-5 text-green-600 dark:text-green-400" />
                      Goal (ETH)
                    </Label>
                    <Input
                      id="goal"
                      type="number"
                      step="0.01"
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      placeholder="Enter funding goal"
                      className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 transition-all"
                      required
                    />
                  </div>

                  {/* Duration */}
                  <div className="space-y-2">
                    <Label htmlFor="duration" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                      <CalendarClock className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                      Duration (in days)
                    </Label>
                    <Input
                      id="duration"
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="Enter campaign duration"
                      className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 transition-all"
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold py-3 transition-all"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Creating...
                      </>
                    ) : (
                      <>Create Campaign</>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="preview">
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                  {title || "Your Campaign Title"}
                </CardTitle>
                <CardDescription className="line-clamp-2 text-gray-600 dark:text-gray-400">
                  {description || "Your campaign description will appear here."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1 text-gray-600 dark:text-gray-400">
                    <span>Raised: 0 ETH</span>
                    <span>Goal: {goal ? ethers.formatEther(ethers.parseEther(goal)) : "0"} ETH</span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span>Goal: <strong>{goal ? ethers.formatEther(ethers.parseEther(goal)) : "0"} ETH</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Coins className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    <span>Raised: <strong>0 ETH</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarClock className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                    <span>Deadline: <strong>
                      {duration
                        ? new Date((Math.floor(Date.now() / 1000) + Number(duration) * 24 * 60 * 60) * 1000).toLocaleDateString()
                        : "Not set"}
                    </strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Status: <strong>Preview</strong></span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 cursor-not-allowed"
                  disabled
                >
                  <Eye className="w-5 h-5 mr-2" />
                  Preview Mode
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
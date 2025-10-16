'use client';

import Link from 'next/link';
import { ethers } from 'ethers';
import { Eye, CalendarDays, Target, Coins } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export default function CampaignCard({ id, campaign }) {
  const progress = (Number(campaign.amountRaised) / Number(campaign.goal)) * 100;
  const deadlineDate = new Date(Number(campaign.deadline) * 1000);
  const isExpired = deadlineDate < new Date();
  const isCompleted = campaign.completed;

  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white">{campaign.title}</CardTitle>
        <CardDescription className="line-clamp-2 text-gray-600 dark:text-gray-400">{campaign.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1 text-gray-600 dark:text-gray-400">
            <span>Raised: {ethers.formatEther(campaign.amountRaised)} ETH</span>
            <span>Goal: {ethers.formatEther(campaign.goal)} ETH</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-green-500 dark:text-green-400" />
            <span>Goal: <strong>{ethers.formatEther(campaign.goal)} ETH</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
            <span>Raised: <strong>{ethers.formatEther(campaign.amountRaised)} ETH</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-blue-500 dark:text-blue-400" />
            <span>Deadline: <strong>{deadlineDate.toLocaleDateString()}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span>Status: <strong>{isCompleted ? 'Completed' : isExpired ? 'Expired' : 'Active'}</strong></span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/campaigns/${id}`} className="w-full">
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
            disabled={isCompleted || isExpired}
          >
            <Eye className="w-5 h-5 mr-2" />
            {isCompleted ? 'Completed' : isExpired ? 'Expired' : 'View Campaign'}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
'use client';

import Link from 'next/link';
import { formatEther, parseUnits } from 'ethers';
import { format } from 'date-fns';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export default function MarketCard({ market }) {
  const resolutionDate = new Date(Number(market.resolutionDate) * 1000); // ✅ ensure it's a proper Date

  // ✅ Safely convert values to BigInt or string before formatting
  const yesShares = BigInt(market.yesShares?.toString() || '0');
  const noShares = BigInt(market.noShares?.toString() || '0');

  const yes = Number(formatEther(yesShares));
  const no = Number(formatEther(noShares));
  const total = yes + no;

  const yesPrice = total > 0 ? yes / total : 0.5;
  const noPrice = 1 - yesPrice;

  const volume = (yes + no).toFixed(4);
  const change24h = '+1.8%'; // Mock for now

  const status = market.resolved
    ? 'Resolved'
    : market.active
    ? 'Active'
    : 'Inactive';

  const statusColor = market.resolved
    ? 'bg-gray-200 text-gray-800'
    : market.active
    ? 'bg-green-100 text-green-700'
    : 'bg-yellow-100 text-yellow-700';

  return (
    <Card key={market.id} className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="capitalize">
            {market.category || 'General'}
          </Badge>
        </div>

        <CardTitle className="text-lg leading-tight">{market.question}</CardTitle>
        <CardDescription>
          {market.participants || '—'} participants • Ends{' '}
          {format(resolutionDate, 'PPP')}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-1 text-sm text-muted-foreground">
          <p>Yes: {yes.toFixed(4)} ETH</p>
          <p>No: {no.toFixed(4)} ETH</p>
          <Badge className={`mt-1 inline-block ${statusColor}`}>{status}</Badge>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-green-600">
              Yes {(yesPrice * 100).toFixed(0)}¢
            </span>
            <span className="text-red-600">
              No {(noPrice * 100).toFixed(0)}¢
            </span>
          </div>
          <Progress value={yesPrice * 100} className="h-2" />
        </div>

        <div className="flex gap-2">
          <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
            Buy Yes
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
          >
            Buy No
          </Button>
        </div>

        <Button variant="ghost" size="sm" className="w-full" asChild>
          <Link href={`/markets/${market.id}`}>View Details</Link>
        </Button>
      </CardContent>
    </Card>
  );
}


/* import Link from 'next/link';
import { formatEther } from 'ethers'; // ✅ v6 correct import

export default function MarketCard({ market }) {
  const resolutionDate = new Date(market.resolutionDate);

  return (
    <Link href={`/markets/${market.id}`}>
      <div className="border p-4 rounded-lg hover:shadow-lg transition">
        <h3 className="text-lg font-semibold mb-2">{market.question}</h3>
        <p className="text-sm text-gray-600 mb-1">{market.category}</p>
        <p className="text-sm mb-1">Resolves: {resolutionDate.toLocaleDateString()}</p>
        <p className="text-sm mb-1">Yes: {formatEther(market.yesShares)} ETH</p>
        <p className="text-sm">No: {formatEther(market.noShares)} ETH</p>
        <p className="text-sm font-medium">
          {market.resolved ? 'Resolved' : market.active ? 'Active' : 'Inactive'}
        </p>
      </div>
    </Link>
  );
}
 */
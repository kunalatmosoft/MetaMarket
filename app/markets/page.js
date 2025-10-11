'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getBytes } from 'ethers';
import { Target, ArrowRight } from 'lucide-react';
import { Loader, Search } from 'lucide-react';
import MarketCard from '../../components/MarketCard';
import { getContract } from '@/lib/contract';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

// Cache configuration
const CACHE_KEY = 'markets_data';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export default function Markets() {
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const categories = [
    { value: 'all', label: 'All' },
    { value: 'politics', label: 'Politics' },
    { value: 'crypto', label: 'Crypto' },
    { value: 'sports', label: 'Sports' },
    { value: 'technology', label: 'Technology' },
    { value: 'economics', label: 'Economics' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'other', label: 'Other' },
  ];

useEffect(() => {
  let contract;

  async function fetchMarkets(forceRefresh = false) {
    try {
      if (!forceRefresh) {
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
          const { data, timestamp } = JSON.parse(cachedData);
          if (Date.now() - timestamp < CACHE_DURATION) {
            setMarkets(data);
            setLoading(false);
          }
        }
      }

      // Always fetch from blockchain for the latest data
      contract = await getContract();
      const marketCount = Number(await contract.marketCount());
      const freshData = [];

      for (let i = 1; i <= marketCount; i++) {
        const [creator, metadataBytes] = await contract.getMarketMetadata(i);
        const [resolutionDate, initialLiquidity, resolved, outcome, active] =
          await contract.getMarketStatus(i);
        const [yesShares, noShares] = await contract.getMarketShares(i);

        const metadataUint8Array = getBytes(metadataBytes);
        const metadataJson = new TextDecoder().decode(metadataUint8Array);
        const metadata = JSON.parse(metadataJson);

        freshData.push({
          id: i,
          creator,
          question: metadata.question,
          description: metadata.description,
          category: metadata.category,
          resolutionSource: metadata.resolutionSource,
          resolutionDate: Number(resolutionDate) * 1000,
          initialLiquidity: Number(initialLiquidity),
          resolved,
          outcome,
          yesShares: Number(yesShares),
          noShares: Number(noShares),
          active,
        });
      }

      setMarkets(freshData);
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ data: freshData, timestamp: Date.now() })
      );
    } catch (err) {
      console.error("Error fetching markets:", err);
    } finally {
      setLoading(false);
    }
  }

  // Fetch immediately
  fetchMarkets(true);

  // ✅ Listen to contract event (real-time updates)
  async function setupListener() {
    try {
      if (!contract) contract = await getContract();
      contract.on("MarketCreated", async () => {
        console.log("📈 New market detected, refreshing...");
        await fetchMarkets(true);
      });
    } catch (e) {
      console.warn("Event listener setup failed:", e);
    }
  }

  setupListener();

  // Clean up on unmount
  return () => {
    if (contract) {
      contract.removeAllListeners("MarketCreated");
    }
  };
}, []);


  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader className="animate-spin w-8 h-8 text-blue-600" />
      </div>
    );
  }

  const filteredMarkets = markets
    .filter((market) => {
      const matchesSearch = market.question
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' || market.category === selectedCategory;
      const matchesStatus =
        selectedStatus === 'all' ||
        (selectedStatus === 'active' && market.active && !market.resolved) ||
        (selectedStatus === 'resolved' && market.resolved);
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return b.id - a.id;
      } else if (sortBy === 'ending-soon') {
        return a.resolutionDate - b.resolutionDate;
      } else if (sortBy === 'volume' || sortBy === 'participants') {
        return (
          b.yesShares + b.noShares - (a.yesShares + a.noShares)
        );
      }
      return 0;
    });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">All Markets</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search markets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="volume">Volume</SelectItem>
            <SelectItem value="participants">Participants</SelectItem>
            <SelectItem value="ending-soon">Ending Soon</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
          </SelectContent>
        </Select>

        <Button asChild variant="outline" size="lg" className="group hover:scale-105 transition-all duration-300">
          <Link href="/markets/create">
            <Target className="w-5 h-5 mr-2" />
            Create Market
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </Button>
        <br />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMarkets.map((market) => (
          <MarketCard key={market.id} market={market} />
        ))}
      </div>

      {filteredMarkets.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No markets found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
}

// Previous Latest version


/* 'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getBytes } from 'ethers';
import { Target, ArrowRight } from 'lucide-react';
import { Loader, Search } from 'lucide-react';
import MarketCard from '../../components/MarketCard';
import { getContract } from '@/lib/contract';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

export default function Markets() {
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all'); // ✅ new status filter
  const [sortBy, setSortBy] = useState('newest');

  const categories = [
    { value: 'all', label: 'All' },
    { value: 'politics', label: 'Politics' },
    { value: 'crypto', label: 'Crypto' },
    { value: 'sports', label: 'Sports' },
    { value: 'technology', label: 'Technology' },
    { value: 'economics', label: 'Economics' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'other', label: 'Other' },
  ];

  useEffect(() => {
    async function fetchMarkets() {
      try {
        const contract = await getContract();
        const marketCount = Number(await contract.marketCount());
        const marketsData = [];

        for (let i = 1; i <= marketCount; i++) {
          const [creator, metadataBytes] = await contract.getMarketMetadata(i);
          const [resolutionDate, initialLiquidity, resolved, outcome, active] =
            await contract.getMarketStatus(i);
          const [yesShares, noShares] = await contract.getMarketShares(i);

          const metadataUint8Array = getBytes(metadataBytes);
          const metadataJson = new TextDecoder().decode(metadataUint8Array);
          const metadata = JSON.parse(metadataJson);

          marketsData.push({
            id: i,
            creator,
            question: metadata.question,
            description: metadata.description,
            category: metadata.category,
            resolutionSource: metadata.resolutionSource,
            resolutionDate: Number(resolutionDate) * 1000,
            initialLiquidity: Number(initialLiquidity),
            resolved,
            outcome,
            yesShares: Number(yesShares),
            noShares: Number(noShares),
            active,
          });
        }

        setMarkets(marketsData);
      } catch (err) {
        console.error('Error fetching markets:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchMarkets();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader className="animate-spin w-8 h-8 text-blue-600" />
      </div>
    );
  }

  // ✅ Updated filter logic to include selectedStatus
  const filteredMarkets = markets
    .filter((market) => {
      const matchesSearch = market.question
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' || market.category === selectedCategory;
      const matchesStatus =
        selectedStatus === 'all' ||
        (selectedStatus === 'active' && market.active && !market.resolved) ||
        (selectedStatus === 'resolved' && market.resolved);
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return b.id - a.id;
      } else if (sortBy === 'ending-soon') {
        return a.resolutionDate - b.resolutionDate;
      } else if (sortBy === 'volume' || sortBy === 'participants') {
        return (
          b.yesShares + b.noShares - (a.yesShares + a.noShares)
        );
      }
      return 0;
    });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">All Markets</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {/* Search 
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search markets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Select 
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status Filter 
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort Filter 
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="volume">Volume</SelectItem>
            <SelectItem value="participants">Participants</SelectItem>
            <SelectItem value="ending-soon">Ending Soon</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
          </SelectContent>
        </Select>

        {/*Create Button
        <Button asChild variant="outline" size="lg" className="group hover:scale-105 transition-all duration-300">
          <Link href="/markets/create">
            <Target className="w-5 h-5 mr-2" />
            Create Market
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </Button>
        <br />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMarkets.map((market) => (
          <MarketCard key={market.id} market={market} />
        ))}
      </div>

      {filteredMarkets.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No markets found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
} */




















/* 'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getBytes } from 'ethers'; // ✅ correct import
import { Loader } from 'lucide-react';
import MarketCard from '../../components/MarketCard';
import { getContract } from '@/lib/contract';

export default function Markets() {
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMarkets() {
      try {
        const contract = await getContract();
        const marketCount = Number(await contract.marketCount()); // ✅ correct function name

        const marketsData = [];

        for (let i = 1; i <= marketCount; i++) {
          // Step 1: Fetch raw data from contract
          const [creator, metadataBytes] = await contract.getMarketMetadata(i);
          const [resolutionDate, initialLiquidity, resolved, outcome, active] = await contract.getMarketStatus(i);
          const [yesShares, noShares] = await contract.getMarketShares(i);

          // Step 2: Decode hex string metadata -> Uint8Array -> JSON string -> object
          const metadataUint8Array = getBytes(metadataBytes); // converts '0x...' to Uint8Array
          const metadataJson = new TextDecoder().decode(metadataUint8Array); // decode to string
          const metadata = JSON.parse(metadataJson); // parse JSON

          // Step 3: Combine all data into one object
          marketsData.push({
            id: i,
            creator,
            question: metadata.question,
            description: metadata.description,
            category: metadata.category,
            resolutionSource: metadata.resolutionSource,
            resolutionDate: Number(resolutionDate) * 1000, // Convert to ms for JS Date
            initialLiquidity: Number(initialLiquidity),
            resolved,
            outcome,
            yesShares: Number(yesShares),
            noShares: Number(noShares),
            active,
          });
        }

        setMarkets(marketsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching markets:', err);
        setLoading(false);
      }
    }

    fetchMarkets();
  }, []);

  if (loading) return(
    <div className='flex justify-center items-center h-[60vh]'>
      <Loader className='animate-spin w-8 h-8 text-blue-600'/>
    </div>
  )
  const filteredMarkets = markets.filter((market) => {
    const matchesSearch = market.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || market.category === selectedCategory
    return matchesSearch && matchesCategory
  })
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">All Markets</h2>
      <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search markets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="volume">Volume</SelectItem>
              <SelectItem value="participants">Participants</SelectItem>
              <SelectItem value="ending-soon">Ending Soon</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
            </SelectContent>
          </Select>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {markets.map((market) => (
          <MarketCard key={market.id} market={market} />
        ))}
      </div>
              {filteredMarkets.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No markets found matching your criteria.</p>
          </div>
        )}
    </div>
  );
}
 */
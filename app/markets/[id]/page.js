"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { ethers, formatEther } from "ethers"
import BetDrawer from "@/components/BetDrawer"
import ResolveForm from "@/components/ResolveForm"
import PayoutButton from "@/components/PayoutButton"
import { getContract } from "@/lib/contract"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Line } from "react-chartjs-2"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CalendarDays,
  TrendingUp,
  TrendingDown,
  Clock,
  DollarSign,
  Users,
  AlertCircle,
  CheckCircle2,
} from "lucide-react"

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default function MarketDetails() {
  const { id } = useParams()
  const [market, setMarket] = useState(null)
  const [userBets, setUserBets] = useState({ yesBets: 0, noBets: 0 })
  const [loading, setLoading] = useState(true)
  const [account, setAccount] = useState("")
  const [isCreator, setIsCreator] = useState(false)
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Yes Shares (ETH)",
        data: [],
        borderColor: "hsl(var(--primary))",
        backgroundColor: "hsl(var(--primary) / 0.1)",
        fill: false,
        tension: 0.3,
      },
      {
        label: "No Shares (ETH)",
        data: [],
        borderColor: "hsl(var(--destructive))",
        backgroundColor: "hsl(var(--destructive) / 0.1)",
        fill: false,
        tension: 0.3,
      },
    ],
  })

  const fetchMarketDetails = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const userAddress = await signer.getAddress()
      setAccount(userAddress)

      const contract = await getContract()
      const [creator, metadataBytes] = await contract.getMarketMetadata(id)
      const [resolutionDate, initialLiquidity, resolved, outcome, active] = await contract.getMarketStatus(id)
      const [yesShares, noShares] = await contract.getMarketShares(id)
      const [yesBet, noBet] = await contract.getUserBets(id, userAddress)

      // Decode metadata bytes
      const metadataArray = ethers.getBytes(metadataBytes)
      const metadataJson = new TextDecoder().decode(metadataArray)
      const metadata = JSON.parse(metadataJson)

      const resolutionDateMs = Number(resolutionDate) * 1000

      const marketObj = {
        id: Number(id),
        creator,
        question: metadata.question,
        description: metadata.description,
        category: metadata.category,
        resolutionSource: metadata.resolutionSource,
        resolutionDate: resolutionDateMs,
        initialLiquidity,
        resolved,
        outcome,
        yesShares,
        noShares,
        active,
      }

      setMarket(marketObj)
      setUserBets({ yesBets: yesBet, noBets: noBet })

      // Set isCreator
      const isUserCreator = userAddress.toLowerCase() === creator.toLowerCase()
      setIsCreator(isUserCreator)

      // Update chart
      const timestamp = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })

      setChartData((prev) => ({
        labels: [...prev.labels, timestamp].slice(-20),
        datasets: [
          {
            ...prev.datasets[0],
            data: [...prev.datasets[0].data, Number(formatEther(yesShares))].slice(-20),
          },
          {
            ...prev.datasets[1],
            data: [...prev.datasets[1].data, Number(formatEther(noShares))].slice(-20),
          },
        ],
      }))

      console.log("✅ Account:", userAddress)
      console.log("✅ Market Creator:", creator)
      console.log("✅ Is Creator:", isUserCreator)
      console.log("✅ Market Resolved:", resolved)
      console.log("✅ Resolution Date (ms):", resolutionDateMs)
      console.log("✅ Current Time (ms):", Date.now())
      console.log("✅ Resolution Date Passed:", resolutionDateMs <= Date.now())
      console.log("✅ Show Resolve Button:", isUserCreator && !resolved && resolutionDateMs <= Date.now())

      setLoading(false)
    } catch (error) {
      console.error("Error fetching market details:", error)
      setLoading(false)
    }
  }

  useEffect(() => {
    let contract
    let provider

    async function setupEventListener() {
      if (!contract) {
        contract = await getContract()
        provider = new ethers.BrowserProvider(window.ethereum)
      }

      contract.on("BetPlaced", async (marketId, bettor, outcome, amount) => {
        if (marketId.toString() === id.toString()) {
          try {
            const [yesShares, noShares] = await contract.getMarketShares(id)
            const timestamp = new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })
            setChartData((prev) => ({
              labels: [...prev.labels, timestamp].slice(-20),
              datasets: [
                {
                  ...prev.datasets[0],
                  data: [...prev.datasets[0].data, Number(formatEther(yesShares))].slice(-20),
                },
                {
                  ...prev.datasets[1],
                  data: [...prev.datasets[1].data, Number(formatEther(noShares))].slice(-20),
                },
              ],
            }))

            // Refresh user bets after a bet is placed
            fetchMarketDetails()
          } catch (error) {
            console.error("Error updating chart:", error)
          }
        }
      })

      return () => {
        contract.removeAllListeners("BetPlaced")
      }
    }

    fetchMarketDetails()
    setupEventListener()

    return () => {
      if (contract) {
        contract.removeAllListeners("BetPlaced")
      }
    }
  }, [id])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/3" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!market) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Market not found. Please check the market ID and try again.</AlertDescription>
        </Alert>
      </div>
    )
  }

  const resolutionDateObj = new Date(market.resolutionDate)
  const showResolveButton = isCreator && !market.resolved && market.resolutionDate <= Date.now()
  const totalShares = Number(formatEther(market.yesShares)) + Number(formatEther(market.noShares))
  const yesPercentage = totalShares > 0 ? (Number(formatEther(market.yesShares)) / totalShares) * 100 : 50
  const noPercentage = 100 - yesPercentage

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Market Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl leading-tight">{market.question}</CardTitle>
              <CardDescription className="text-base">{market.description}</CardDescription>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge variant={market.active ? "default" : "secondary"}>{market.active ? "Active" : "Inactive"}</Badge>
              {market.resolved && (
                <Badge variant={market.outcome ? "default" : "destructive"}>
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Resolved: {market.outcome ? "Yes" : "No"}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline">{market.category}</Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays className="w-4 h-4" />
              <span>Resolves: {resolutionDateObj.toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="w-4 h-4" />
              <span>Initial: {formatEther(market.initialLiquidity)} ETH</span>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            <strong>Resolution Source:</strong> {market.resolutionSource}
          </div>

          {/* Market Odds */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Market Sentiment</span>
              <span className="text-sm text-muted-foreground">{totalShares.toFixed(4)} ETH Total Volume</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">Yes</span>
                </div>
                <span className="text-sm font-bold text-green-600">{yesPercentage.toFixed(1)}%</span>
              </div>
              <Progress value={yesPercentage} className="h-2" />
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium">No</span>
                </div>
                <span className="text-sm font-bold text-red-600">{noPercentage.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different sections */}
      <Tabs defaultValue="chart" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chart">Market Trends</TabsTrigger>
          <TabsTrigger value="bets">Your Position</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="chart" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Market Trends
              </CardTitle>
              <CardDescription>Real-time tracking of Yes vs No shares over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                <Line
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "top",
                        labels: {
                          font: { size: 12, family: "Inter" },
                          color: "hsl(var(--foreground))",
                        },
                      },
                      title: {
                        display: false,
                      },
                      tooltip: {
                        backgroundColor: "hsl(var(--popover))",
                        titleColor: "hsl(var(--popover-foreground))",
                        bodyColor: "hsl(var(--popover-foreground))",
                        borderColor: "hsl(var(--border))",
                        borderWidth: 1,
                        callbacks: {
                          label: (context) => `${context.dataset.label}: ${context.parsed.y.toFixed(4)} ETH`,
                        },
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: "Shares (ETH)",
                          font: { size: 12 },
                          color: "hsl(var(--muted-foreground))",
                        },
                        ticks: {
                          precision: 4,
                          color: "hsl(var(--muted-foreground))",
                        },
                        grid: { color: "hsl(var(--border))" },
                      },
                      x: {
                        title: {
                          display: true,
                          text: "Time",
                          font: { size: 12 },
                          color: "hsl(var(--muted-foreground))",
                        },
                        ticks: { color: "hsl(var(--muted-foreground))" },
                        grid: { display: false },
                      },
                    },
                    animation: { duration: 1000, easing: "easeInOutQuad" },
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Your Position
              </CardTitle>
              <CardDescription>Your current bets and potential returns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="font-medium">Yes Bet</span>
                      </div>
                      <span className="text-lg font-bold text-green-600">{formatEther(userBets.yesBets)} ETH</span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="w-4 h-4 text-red-600" />
                        <span className="font-medium">No Bet</span>
                      </div>
                      <span className="text-lg font-bold text-red-600">{formatEther(userBets.noBets)} ETH</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {(userBets.yesBets > 0 || userBets.noBets > 0) && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground">
                    Total Position:{" "}
                    {(Number(formatEther(userBets.yesBets)) + Number(formatEther(userBets.noBets))).toFixed(4)} ETH
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions" className="space-y-4">
          <div className="space-y-4">
            {market.active && !market.resolved && (
              <Card>
                <CardHeader>
                  <CardTitle>Place a Bet</CardTitle>
                  <CardDescription>Choose your prediction and bet amount</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <BetDrawer
                      marketId={id}
                      outcome="yes"
                      percentage={yesPercentage}
                      onBetPlaced={fetchMarketDetails}
                    />
                    <BetDrawer marketId={id} outcome="no" percentage={noPercentage} onBetPlaced={fetchMarketDetails} />
                  </div>
                </CardContent>
              </Card>
            )}

            {showResolveButton && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Resolve Market
                  </CardTitle>
                  <CardDescription>As the market creator, you can now resolve this market</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResolveForm marketId={id} />
                </CardContent>
              </Card>
            )}

            {isCreator && !showResolveButton && !market.resolved && (
              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  Resolution will be available after {resolutionDateObj.toLocaleString()}
                </AlertDescription>
              </Alert>
            )}

            {market.resolved && (userBets.yesBets > 0 || userBets.noBets > 0) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Claim Payout
                  </CardTitle>
                  <CardDescription>Market has been resolved. Claim your winnings if applicable.</CardDescription>
                </CardHeader>
                <CardContent>
                  <PayoutButton marketId={id} />
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}



/* 'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ethers, formatEther } from 'ethers';
import BetForm from '../../../components/BetForm';
import ResolveForm from '../../../components/ResolveForm';
import PayoutButton from '../../../components/PayoutButton';
import { getContract } from '@/lib/contract';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function MarketDetails() {
  const { id } = useParams();
  const [market, setMarket] = useState(null);
  const [userBets, setUserBets] = useState({ yesBets: 0, noBets: 0 });
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState('');
  const [isCreator, setIsCreator] = useState(false);
  const [chartData, setChartData] = useState({
    labels: [] ,
    datasets: [
      {
        label: 'Yes Shares (ETH)',
        data: [],
        borderColor: '#4BC0C0',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: false,
        tension: 0.3,
      },
      {
        label: 'No Shares (ETH)',
        data: [] ,
        borderColor: '#FF6384',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: false,
        tension: 0.3,
      },
    ],
  });

  useEffect(() => {
    let contract;
    let provider;

    async function fetchMarketDetails() {
      try {
        provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();
        setAccount(userAddress);

        contract = await getContract();
        const [creator, metadataBytes] = await contract.getMarketMetadata(id);
        const [resolutionDate, initialLiquidity, resolved, outcome, active] = await contract.getMarketStatus(id);
        const [yesShares, noShares] = await contract.getMarketShares(id);
        const [yesBet, noBet] = await contract.getUserBets(id, userAddress);

        // Decode metadata bytes
        const metadataArray = ethers.getBytes(metadataBytes);
        const metadataJson = new TextDecoder().decode(metadataArray);
        const metadata = JSON.parse(metadataJson);

        const resolutionDateMs = Number(resolutionDate) * 1000;

        const marketObj = {
          id: Number(id),
          creator,
          question: metadata.question,
          description: metadata.description,
          category: metadata.category,
          resolutionSource: metadata.resolutionSource,
          resolutionDate: resolutionDateMs,
          initialLiquidity,
          resolved,
          outcome,
          yesShares,
          noShares,
          active,
        };

        setMarket(marketObj);
        setUserBets({ yesBets: yesBet, noBets: noBet });

        // Set isCreator
        const isUserCreator = userAddress.toLowerCase() === creator.toLowerCase();
        setIsCreator(isUserCreator);

        // Initialize chart
        const timestamp = new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
        setChartData({
          labels: [timestamp],
          datasets: [
            {
              label: 'Yes Shares (ETH)',
              data: [Number(formatEther(yesShares))],
              borderColor: '#4BC0C0',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              fill: false,
              tension: 0.3,
            },
            {
              label: 'No Shares (ETH)',
              data: [Number(formatEther(noShares))],
              borderColor: '#FF6384',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              fill: false,
              tension: 0.3,
            },
          ],
        });

        // Debug logs
        console.log('✅ Account:', userAddress);
        console.log('✅ Market Creator:', creator);
        console.log('✅ Is Creator:', isUserCreator);
        console.log('✅ Market Resolved:', resolved);
        console.log('✅ Resolution Date (ms):', resolutionDateMs);
        console.log('✅ Current Time (ms):', Date.now());
        console.log('✅ Resolution Date Passed:', resolutionDateMs <= Date.now());
        console.log('✅ Show Resolve Button:', isUserCreator && !resolved && resolutionDateMs <= Date.now());

        setLoading(false);
      } catch (error) {
        console.error('Error fetching market details:', error);
        setLoading(false);
      }
    }

    async function setupEventListener() {
      if (!contract) {
        contract = await getContract();
        provider = new ethers.BrowserProvider(window.ethereum);
      }

      contract.on('BetPlaced', async (marketId, bettor, outcome, amount) => {
        if (marketId.toString() === id.toString()) {
          try {
            const [yesShares, noShares] = await contract.getMarketShares(id);
            const timestamp = new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            });
            setChartData((prev) => ({
              labels: [...prev.labels, timestamp].slice(-20),
              datasets: [
                {
                  ...prev.datasets[0],
                  data: [...prev.datasets[0].data, Number(formatEther(yesShares))].slice(-20),
                },
                {
                  ...prev.datasets[1],
                  data: [...prev.datasets[1].data, Number(formatEther(noShares))].slice(-20),
                },
              ],
            }));
          } catch (error) {
            console.error('Error updating chart:', error);
          }
        }
      });

      return () => {
        contract.removeAllListeners('BetPlaced');
      };
    }

    fetchMarketDetails();
    setupEventListener();

    return () => {
      if (contract) {
        contract.removeAllListeners('BetPlaced');
      }
    };
  }, [id]);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (!market) return <p className="text-center text-red-500">Market not found.</p>;

  const resolutionDateObj = new Date(market.resolutionDate);
  const showResolveButton = isCreator && !market.resolved && market.resolutionDate <= Date.now();

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">{market.question}</h2>
      <p className="mb-2 text-gray-600">{market.description}</p>
      <p className="mb-2"><strong>Category:</strong> {market.category}</p>
      <p className="mb-2"><strong>Resolution Source:</strong> {market.resolutionSource}</p>
      <p className="mb-2"><strong>Resolution Date:</strong> {resolutionDateObj.toLocaleString()}</p>
      <p className="mb-2"><strong>Initial Liquidity:</strong> {formatEther(market.initialLiquidity)} ETH</p>
      <p className="mb-2"><strong>Yes Shares:</strong> {formatEther(market.yesShares)} ETH</p>
      <p className="mb-2"><strong>No Shares:</strong> {formatEther(market.noShares)} ETH</p>
      <p className="mb-4"><strong>Status:</strong> {market.active ? 'Active' : 'Inactive'}</p>

      {market.resolved && (
        <p className="mb-4"><strong>Outcome:</strong> {market.outcome ? 'Yes' : 'No'}</p>
      )}

      <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-800">Market Trends</h3>
      <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
        <Line
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
                labels: { font: { size: 14, family: 'Inter' }, color: '#333' },
              },
              title: {
                display: true,
                text: 'Yes vs No Shares Over Time',
                font: { size: 16, family: 'Inter' },
                color: '#333',
              },
              tooltip: {
                backgroundColor: '#fff',
                titleColor: '#333',
                bodyColor: '#333',
                borderColor: '#ddd',
                borderWidth: 1,
                callbacks: {
                  label: (context) => `${context.dataset.label}: ${context.parsed.y.toFixed(4)} ETH`,
                },
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                title: { display: true, text: 'Shares (ETH)', font: { size: 14 }, color: '#333' },
                ticks: { precision: 4, color: '#333' },
                grid: { color: '#eee' },
              },
              x: {
                title: { display: true, text: 'Time', font: { size: 14 }, color: '#333' },
                ticks: { color: '#333' },
                grid: { display: false },
              },
            },
            animation: { duration: 1000, easing: 'easeInOutQuad' },
          }}
        />
      </div>

      <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-800">Your Bets</h3>
      <p className="mb-2">Yes Bet: {formatEther(userBets.yesBets)} ETH</p>
      <p className="mb-4">No Bet: {formatEther(userBets.noBets)} ETH</p>

      {market.active && !market.resolved && <BetForm marketId={id} />}
      {showResolveButton ? (
        <ResolveForm marketId={id} />
      ) : (
        isCreator && (
          <p className="text-yellow-500 mb-4">
            Resolve button hidden: {market.resolved ? 'Market already resolved' : 'Resolution date not reached yet'}
          </p>
        )
      )}
      {market.resolved && (userBets.yesBets > 0 || userBets.noBets > 0) && (
        <PayoutButton marketId={id} />
      )}
    </div>
  );
} */
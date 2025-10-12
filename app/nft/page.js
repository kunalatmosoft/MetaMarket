"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
  TrendingUp,
  Wallet,
  Activity,
  Coins,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Link as LinkIcon,
  Moon,
  Sun,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

// Mock data
const earningsData = [
  { name: "Jan", value: 120 },
  { name: "Feb", value: 180 },
  { name: "Mar", value: 90 },
  { name: "Apr", value: 220 },
  { name: "May", value: 170 },
  { name: "Jun", value: 300 },
]

const portfolioData = [
  { name: "PFP NFTs", value: 40 },
  { name: "Art NFTs", value: 25 },
  { name: "Gaming NFTs", value: 20 },
  { name: "Music NFTs", value: 15 },
]

const COLORS = ["#3b82f6", "#f59e0b", "#10b981", "#a855f7"]

export default function DashboardPage() {
  const [nfts, setNfts] = useState([])
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [theme, setTheme] = useState("light")
  const [selectedNFT, setSelectedNFT] = useState(null)
  const [filterType, setFilterType] = useState("All")
  const [totalValue, setTotalValue] = useState(0)

  // Mock transaction data
  const transactions = [
    { name: "Cyber Ape #102", type: "Sold", amount: "2.4 ETH", date: "2025-10-10" },
    { name: "NeoPunk #45", type: "Bought", amount: "1.1 ETH", date: "2025-10-09" },
    { name: "Meta Tiger #8", type: "Minted", amount: "0.5 ETH", date: "2025-10-08" },
  ]

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem("theme") || "light"
    setTheme(savedTheme)
    document.documentElement.classList.toggle("dark", savedTheme === "dark")

    // Simulate fetching NFTs
    const fetchNFTs = async () => {
      try {
        setLoading(true)
        // Mock API call
        const mockNfts = [
          { id: 1, name: "Cyber Ape #102", price: 2.4, image: "https://picsum.photos/300?1", description: "A rare Cyber Ape with futuristic accessories.", attributes: { rarity: "Epic", category: "PFP" } },
          { id: 2, name: "NeoPunk #45", price: 1.1, image: "https://picsum.photos/300?2", description: "A vibrant NeoPunk with neon aesthetics.", attributes: { rarity: "Rare", category: "Art" } },
          { id: 3, name: "Meta Tiger #8", price: 3.5, image: "https://picsum.photos/300?3", description: "A majestic Meta Tiger with unique stripes.", attributes: { rarity: "Legendary", category: "Gaming" } },
        ]
        setNfts(mockNfts)
        // Calculate total portfolio value
        const total = mockNfts.reduce((sum, nft) => sum + nft.price, 0)
        setTotalValue(total.toFixed(2))
        setLoading(false)
      } catch (err) {
        setError("Failed to load NFTs")
        setLoading(false)
      }
    }
    fetchNFTs()

    // Simulate real-time price updates
    const priceUpdateInterval = setInterval(() => {
      setNfts(prevNfts =>
        prevNfts.map(nft => ({
          ...nft,
          price: parseFloat((parseFloat(nft.price) + (Math.random() - 0.5) * 0.2).toFixed(2)), // Ensure price is a number
        }))
      )
    }, 10000) // Update every 10 seconds

    return () => clearInterval(priceUpdateInterval)
  }, [])

  useEffect(() => {
    // Recalculate total value when NFT prices change
    const total = nfts.reduce((sum, nft) => sum + parseFloat(nft.price), 0)
    setTotalValue(total.toFixed(2))
  }, [nfts])

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        setLoading(true)
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
        setWalletAddress(accounts[0])
        setWalletConnected(true)
        setLoading(false)
      } catch (err) {
        setError("Wallet connection failed")
        setLoading(false)
      }
    } else {
      setError("Please install MetaMask to connect your wallet.")
    }
  }

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  }

  const filteredTransactions = filterType === "All" ? transactions : transactions.filter(tx => tx.type === filterType)

  return (
    <main className="p-4 sm:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100 space-y-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">NFT Dashboard</h1>
        <div className="flex items-center gap-4">
          <Button
            onClick={toggleTheme}
            className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </Button>
          {!walletConnected ? (
            <Button
              onClick={connectWallet}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Connecting..." : "Connect Wallet"}
            </Button>
          ) : (
            <div className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300">
              {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </div>
          )}
        </div>
      </header>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard title="Total Value" value={`${totalValue} ETH`} icon={<Wallet className="text-blue-500" />} />
        <StatCard title="Listed NFTs" value={nfts.length} icon={<Activity className="text-green-500" />} />
        <StatCard title="Top Sale" value="3.5 ETH" icon={<TrendingUp className="text-purple-500" />} />
        <StatCard title="Rewards Earned" value="0.9 ETH" icon={<Coins className="text-yellow-500" />} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Earnings Chart */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition">
          <CardContent className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Earnings Overview</h2>
            <div className="h-64">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={earningsData}>
                    <XAxis dataKey="name" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip contentStyle={{ backgroundColor: theme === "light" ? "white" : "#1f2937", border: "1px solid #ddd" }} />
                    <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Portfolio Distribution */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition">
          <CardContent className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Portfolio Breakdown</h2>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={portfolioData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {portfolioData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
            <h2 className="text-lg sm:text-xl font-semibold">Recent Transactions</h2>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm"
            >
              <option value="All">All</option>
              <option value="Sold">Sold</option>
              <option value="Bought">Bought</option>
              <option value="Minted">Minted</option>
            </select>
          </div>
          <table className="w-full text-left border-t border-gray-100 dark:border-gray-700">
            <thead>
              <tr className="text-gray-600 dark:text-gray-400">
                <th className="py-2">NFT</th>
                <th className="py-2">Action</th>
                <th className="py-2">Amount</th>
                <th className="py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx, i) => (
                <tr key={i} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-3 font-medium">{tx.name}</td>
                  <td className="py-3 text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    {tx.type === "Sold" ? (
                      <ArrowUpRight className="text-green-500 w-4 h-4" />
                    ) : tx.type === "Bought" ? (
                      <ArrowDownRight className="text-red-500 w-4 h-4" />
                    ) : (
                      <Zap className="text-yellow-500 w-4 h-4" />
                    )}
                    {tx.type}
                  </td>
                  <td className="py-3">{tx.amount}</td>
                  <td className="py-3 text-gray-500 dark:text-gray-400">{tx.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* NFT Market Trends */}
      <section>
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Trending NFTs</h2>
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {nfts.map(nft => (
              <div
                key={nft.id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden hover:shadow-lg transition cursor-pointer"
                onClick={() => setSelectedNFT(nft)}
              >
                <img src={nft.image} alt={nft.name} className="w-full h-48 object-cover" />
                <div className="p-4 space-y-2">
                  <h3 className="font-semibold text-lg">{nft.name}</h3>
                  <p className="text-gray-500 dark:text-gray-400">{nft.price} ETH</p>
                  <Button variant="link" className="flex items-center text-blue-600 font-medium hover:underline p-0">
                    View on MetaMarket <LinkIcon className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* NFT Details Modal */}
      <Dialog open={!!selectedNFT} onOpenChange={() => setSelectedNFT(null)}>
        <DialogContent className="bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-gray-100">{selectedNFT?.name}</DialogTitle>
          </DialogHeader>
          {selectedNFT && (
            <div className="space-y-4">
              <img src={selectedNFT.image} alt={selectedNFT.name} className="w-full h-64 object-cover rounded-lg" />
              <p className="text-gray-600 dark:text-gray-300">{selectedNFT.description}</p>
              <div>
                <h4 className="font-semibold">Price</h4>
                <p>{selectedNFT.price} ETH</p>
              </div>
              <div>
                <h4 className="font-semibold">Attributes</h4>
                <p>Rarity: {selectedNFT.attributes.rarity}</p>
                <p>Category: {selectedNFT.attributes.category}</p>
              </div>
              <Button variant="outline" onClick={() => setSelectedNFT(null)}>
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  )
}

function StatCard({ title, value, icon }) {
  return (
    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition">
      <CardContent className="p-4 flex items-center space-x-4">
        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-xl">{icon}</div>
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{title}</p>
          <p className="text-xl font-bold text-gray-800 dark:text-gray-200">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}

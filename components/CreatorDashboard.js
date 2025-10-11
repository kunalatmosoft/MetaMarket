"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"
import NFTCard from "./NFTCard"

export default function CreatorDashboard({ contract, account, buyNFT, setPrice }) {
  const [nfts, setNfts] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalNFTs: 0,
    totalValue: 0,
    ownedNFTs: 0,
  })

  const fetchCreatorNFTs = async () => {
    if (!contract || !account) return
    setLoading(true)

    try {
      const tokenIds = await contract.getCreatorNFTs(account)
      const nfts = []
      let totalValue = 0
      let ownedCount = 0

      for (const tokenId of tokenIds) {
        try {
          const tokenURI = await contract.tokenURI(tokenId)
          const price = await contract.tokenPrices(tokenId)
          const owner = await contract.ownerOf(tokenId)
          const isOwner = owner.toLowerCase() === account.toLowerCase()

          if (isOwner) ownedCount++
          totalValue += Number.parseFloat(ethers.formatEther(price || 0))

          nfts.push({
            tokenId,
            tokenURI,
            price,
            creator: account,
            isOwner,
          })
        } catch (error) {
          console.error(`Error fetching NFT ${tokenId}:`, error)
        }
      }

      setNfts(nfts)
      setStats({
        totalNFTs: nfts.length,
        totalValue: totalValue.toFixed(4),
        ownedNFTs: ownedCount,
      })
    } catch (error) {
      console.error("Error fetching creator NFTs:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCreatorNFTs()
  }, [contract, account])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-900 text-lg">Loading your NFT collection...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Creator Dashboard</h1>
              <p className="text-gray-600 text-lg">
                {account ? `${account.slice(0, 8)}...${account.slice(-6)}` : "Unknown"}
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm uppercase tracking-wide mb-1">Total NFTs</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalNFTs}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm uppercase tracking-wide mb-1">Total Value</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.totalValue} <span className="text-lg text-green-600">ETH</span>
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm uppercase tracking-wide mb-1">Still Owned</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.ownedNFTs}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* NFT Collection */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <span>Your NFT Collection</span>
          </h2>

          {nfts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No NFTs Created Yet</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Start your creative journey by minting your first NFT. Head to the gallery to create something amazing!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {nfts.map((nft) => (
                <NFTCard key={nft.tokenId} {...nft} buyNFT={buyNFT} setPrice={setPrice} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

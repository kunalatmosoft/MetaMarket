"use client"

import { useState } from "react"
import { ethers } from "ethers"
import { getContract } from "@/lib/contract"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { TrendingUp, TrendingDown, Minus, Plus, Loader2 } from "lucide-react"

export default function BetDrawer({ marketId, outcome, percentage, onBetPlaced }) {
  const [betAmount, setBetAmount] = useState(0.0001)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isPlacingBet, setIsPlacingBet] = useState(false)

  const handleBetIncrement = (increment) => {
    setBetAmount(Math.max(0.0001, betAmount + increment))
  }

  const handleCustomBetChange = (value) => {
    const numValue = Number.parseFloat(value)
    if (!isNaN(numValue) && numValue >= 0.0001) {
      setBetAmount(numValue)
    }
  }

  const handlePlaceBet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask to place bets")
      return
    }

    setIsPlacingBet(true)

    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = await getContract()

      const betAmountWei = ethers.parseEther(betAmount.toString())
      const outcomeValue = outcome === "yes"

      const tx = await contract.placeBet(marketId, outcomeValue, {
        value: betAmountWei,
      })

      console.log("Transaction submitted:", tx.hash)

      await tx.wait()

      console.log(`Bet placed successfully! ${betAmount.toFixed(4)} ETH on ${outcome.toUpperCase()}`)

      setIsDrawerOpen(false)
      setBetAmount(0.0001)

      if (onBetPlaced) {
        onBetPlaced()
      }
    } catch (error) {
      console.error("Error placing bet:", error)
      alert(`Error placing bet: ${error.message || "Failed to place bet. Please try again."}`)
    } finally {
      setIsPlacingBet(false)
    }
  }

  const isYes = outcome === "yes"
  const Icon = isYes ? TrendingUp : TrendingDown
  const colorClass = isYes ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
  const textColorClass = isYes ? "text-green-600" : "text-red-600"

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerTrigger asChild>
        <Button className={`h-20 text-lg font-semibold ${colorClass}`}>
          <div className="flex flex-col items-center gap-1">
            <Icon className="w-6 h-6" />
            <span>Bet {outcome.toUpperCase()}</span>
            <span className="text-sm opacity-90">{percentage.toFixed(1)}%</span>
          </div>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle className="flex items-center gap-2">
              <Icon className={`w-5 h-5 ${textColorClass}`} />
              Bet on {outcome.toUpperCase()}
            </DrawerTitle>
            <DrawerDescription>Set your bet amount for a {outcome.toUpperCase()} outcome</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0 space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                onClick={() => handleBetIncrement(-0.0001)}
                disabled={betAmount <= 0.0001 || isPlacingBet}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <div className="flex-1 text-center">
                <div className="text-4xl font-bold tracking-tighter">{betAmount.toFixed(4)}</div>
                <div className="text-muted-foreground text-sm uppercase">ETH</div>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                onClick={() => handleBetIncrement(0.0001)}
                disabled={isPlacingBet}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleBetIncrement(0.001)} disabled={isPlacingBet}>
                +0.001
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleBetIncrement(0.01)} disabled={isPlacingBet}>
                +0.01
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleBetIncrement(0.1)} disabled={isPlacingBet}>
                +0.1
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`custom-amount-${outcome}`}>Custom Amount</Label>
              <Input
                id={`custom-amount-${outcome}`}
                type="number"
                step="0.0001"
                min="0.0001"
                value={betAmount}
                onChange={(e) => handleCustomBetChange(e.target.value)}
                placeholder="Enter custom amount"
                disabled={isPlacingBet}
              />
            </div>

            <div className="bg-muted p-3 rounded-lg text-sm">
              <div className="flex justify-between">
                <span>Potential Return:</span>
                <span className="font-semibold">
                  {percentage > 0 ? (betAmount * (100 / percentage)).toFixed(4) : "0.0000"} ETH
                </span>
              </div>
            </div>
          </div>
          <DrawerFooter>
            <Button onClick={handlePlaceBet} className={colorClass} disabled={isPlacingBet}>
              {isPlacingBet ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Placing Bet...
                </>
              ) : (
                `Place ${outcome.toUpperCase()} Bet (${betAmount.toFixed(4)} ETH)`
              )}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline" disabled={isPlacingBet}>
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

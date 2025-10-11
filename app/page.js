"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Aperture,Users, DollarSign, BarChart3, ArrowRight, Sparkles, Target, Globe } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <Badge variant="secondary" className="mb-4 px-4 py-2 animate-pulse">
              <Sparkles className="w-4 h-4 mr-2" />
              Decentralized Prediction Markets
            </Badge>
          </div>

          <h1
            className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            Welcome to the Future of
            <br />
            <span className="text-foreground">Prediction Markets</span>
          </h1>

          <p
            className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed animate-slide-up"
            style={{ animationDelay: "0.3s" }}
          >
            Create and participate in prediction markets on various topics. Harness the wisdom of crowds to forecast
            future events and earn rewards for accurate predictions.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up"
            style={{ animationDelay: "0.4s" }}
          >
            <Button asChild size="lg" className="group hover:scale-105 transition-all duration-300">
              <Link href="/markets">
                <BarChart3 className="w-5 h-5 mr-2" />
                Browse Markets
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </Button>
            <Button asChild size="lg" className="group bg-blue-500 hover:scale-105 transition-all duration-300">
              <Link href="/nft">
                <Aperture className="w-5 h-5 mr-2" />
                Browse Nft's
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="group hover:scale-105 transition-all duration-300">
              <Link href="/recomm">
                <Target className="w-5 h-5 mr-2" />
                Get AI Insights
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card
            className="h-full hover:shadow-lg hover:scale-105 transition-all duration-500 animate-slide-up"
            style={{ animationDelay: "0.5s" }}
          >
            <CardHeader className="text-center">
              <div className="animate-float">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 text-green-600" />
              </div>
              <CardTitle>Smart Predictions</CardTitle>
              <CardDescription>
                Leverage collective intelligence to make accurate predictions about future events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center animate-slide-in-left" style={{ animationDelay: "0.8s" }}>
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-2 animate-pulse" />
                  Real-time market data
                </li>
                <li className="flex items-center animate-slide-in-left" style={{ animationDelay: "0.9s" }}>
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-2 animate-pulse" />
                  Dynamic pricing
                </li>
                <li className="flex items-center animate-slide-in-left" style={{ animationDelay: "1s" }}>
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-2 animate-pulse" />
                  Transparent outcomes
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card
            className="h-full hover:shadow-lg hover:scale-105 transition-all duration-500 animate-slide-up"
            style={{ animationDelay: "0.6s" }}
          >
            <CardHeader className="text-center">
              <div className="animate-float" style={{ animationDelay: "0.5s" }}>
                <Users className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              </div>
              <CardTitle>Community Driven</CardTitle>
              <CardDescription>
                Join a vibrant community of predictors and market creators from around the world
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center animate-slide-in-left" style={{ animationDelay: "1.1s" }}>
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse" />
                  Global participation
                </li>
                <li className="flex items-center animate-slide-in-left" style={{ animationDelay: "1.2s" }}>
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse" />
                  Diverse markets
                </li>
                <li className="flex items-center animate-slide-in-left" style={{ animationDelay: "1.3s" }}>
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse" />
                  Social insights
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card
            className="h-full hover:shadow-lg hover:scale-105 transition-all duration-500 animate-slide-up"
            style={{ animationDelay: "0.7s" }}
          >
            <CardHeader className="text-center">
              <div className="animate-float" style={{ animationDelay: "1s" }}>
                <DollarSign className="w-12 h-12 mx-auto mb-4 text-yellow-600" />
              </div>
              <CardTitle>Earn Rewards</CardTitle>
              <CardDescription>Get rewarded for accurate predictions and successful market creation</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center animate-slide-in-left" style={{ animationDelay: "1.4s" }}>
                  <div className="w-2 h-2 bg-yellow-600 rounded-full mr-2 animate-pulse" />
                  ETH rewards
                </li>
                <li className="flex items-center animate-slide-in-left" style={{ animationDelay: "1.5s" }}>
                  <div className="w-2 h-2 bg-yellow-600 rounded-full mr-2 animate-pulse" />
                  Low fees
                </li>
                <li className="flex items-center animate-slide-in-left" style={{ animationDelay: "1.6s" }}>
                  <div className="w-2 h-2 bg-yellow-600 rounded-full mr-2 animate-pulse" />
                  Instant payouts
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="bg-muted/30 rounded-2xl p-8 mb-16 animate-slide-up" style={{ animationDelay: "0.8s" }}>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4 animate-fade-in" style={{ animationDelay: "1s" }}>
              Platform Statistics
            </h2>
            <p className="text-muted-foreground animate-fade-in" style={{ animationDelay: "1.1s" }}>
              Join thousands of users making predictions
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div
              className="text-center animate-scale-in hover:scale-110 transition-transform duration-300 cursor-pointer"
              style={{ animationDelay: "1.2s" }}
            >
              <div className="text-3xl font-bold text-primary mb-2 animate-bounce">1,234</div>
              <div className="text-sm text-muted-foreground">Active Markets</div>
            </div>
            <div
              className="text-center animate-scale-in hover:scale-110 transition-transform duration-300 cursor-pointer"
              style={{ animationDelay: "1.3s" }}
            >
              <div className="text-3xl font-bold text-green-600 mb-2 animate-bounce">5,678</div>
              <div className="text-sm text-muted-foreground">Total Users</div>
            </div>
            <div
              className="text-center animate-scale-in hover:scale-110 transition-transform duration-300 cursor-pointer"
              style={{ animationDelay: "1.4s" }}
            >
              <div className="text-3xl font-bold text-blue-600 mb-2 animate-bounce">123.45</div>
              <div className="text-sm text-muted-foreground">ETH Volume</div>
            </div>
            <div
              className="text-center animate-scale-in hover:scale-110 transition-transform duration-300 cursor-pointer"
              style={{ animationDelay: "1.5s" }}
            >
              <div className="text-3xl font-bold text-yellow-600 mb-2 animate-bounce">89%</div>
              <div className="text-sm text-muted-foreground">Accuracy Rate</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center animate-slide-up" style={{ animationDelay: "1.6s" }}>
          <Card className="max-w-2xl mx-auto hover:shadow-xl transition-shadow duration-500">
            <CardHeader>
              <CardTitle className="text-2xl animate-fade-in" style={{ animationDelay: "1.7s" }}>
                Ready to Start Predicting?
              </CardTitle>
              <CardDescription className="animate-fade-in" style={{ animationDelay: "1.8s" }}>
                Join the future of decentralized prediction markets and start earning rewards today
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up"
                style={{ animationDelay: "1.9s" }}
              >
                <Button asChild size="lg" className="group hover:scale-105 transition-all duration-300">
                  <Link href="/markets">
                    <Globe className="w-5 h-5 mr-2" />
                    Explore Markets
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="hover:scale-105 transition-all duration-300">
                  <Link href="/markets/create">Create Your First Market</Link>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: "2s" }}>
                No registration required • Connect with MetaMask • Start with as little as 0.001 ETH
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

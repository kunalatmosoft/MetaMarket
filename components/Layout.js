import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Github, Heart, Wallet, Rocket, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function Layout({ children }) {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      setLoading(true);
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
      } catch (error) {
        console.error('Wallet connection failed:', error);
        alert('Failed to connect wallet');
      }
      setLoading(false);
    } else {
      alert('Please install MetaMask to use this feature');
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = async (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });

      const checkConnection = async () => {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) {
            const address = await accounts[0].getAddress();
            setAccount(address);
          }
        } catch (error) {
          console.error('Error checking connection:', error);
        }
      };

      checkConnection();

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', () => {});
      };
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="w-full px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Rocket className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">Crowdfundr</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/create">
              <Button variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
                Create Campaign
              </Button>
            </Link>
            {typeof account === 'string' ? (
              <Badge className="bg-green-600 dark:bg-green-500 text-white px-4 py-2 text-sm font-medium">
                <Wallet className="w-4 h-4 mr-2" />
                {account.slice(0, 6)}...{account.slice(-4)}
              </Badge>
            ) : (
              <Button
                onClick={connectWallet}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Wallet className="w-4 h-4 mr-2" />
                    Connect Wallet
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </nav>
      <main className="flex-grow w-full px-6 py-8">{children}</main>
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="w-full px-6 py-4 flex flex-col md:flex-row items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <p className="mb-2 md:mb-0">
            &copy; {new Date().getFullYear()} <span className="font-semibold text-gray-800 dark:text-white">Crowdfundr</span>. Built with <Heart className="inline w-4 h-4 text-red-500" /> by <span className="text-blue-600 dark:text-blue-400">Kunal Singh</span>.
          </p>
          <div className="flex gap-4">
            <a href="https://github.com/kunalsingh" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 dark:hover:text-white transition-colors">
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
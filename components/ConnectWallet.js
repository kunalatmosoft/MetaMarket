'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export default function ConnectWallet() {
  const [account, setAccount] = useState('');
  const [error, setError] = useState('');

  const connect = async () => {
    if (!window.ethereum) {
      setError('Please install MetaMask');
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      setError('');
    } catch (err) {
      setError('Failed to connect wallet');
    }
  };

  // Define the handler separately to clean up properly
  const handleAccountsChanged = (accounts) => {
    setAccount(accounts[0] || '');
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  return (
    <div className="p-4 border rounded-md">
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {account ? (
        <p className="text-sm">Connected: {account.slice(0, 4)}...{account.slice(-4)}</p>
      ) : (
        <button
          onClick={connect}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}

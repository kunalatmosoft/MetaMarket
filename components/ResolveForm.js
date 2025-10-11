'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ethers } from 'ethers'; // Added ethers import
import { getContract } from '@/lib/contract';

export default function ResolveForm({ marketId }) {
  const [outcome, setOutcome] = useState(true); // Use boolean instead of string
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const contract = await getContract();
      const tx = await contract.resolveMarket(marketId, outcome, { gasLimit: 5000000 }); // Added gas limit for MegaETH/Sepolia
      await tx.wait();
      router.push(`/markets/${marketId}`); // Redirect to market details to refresh data
    } catch (err) {
      console.error('Resolve error:', err);
      setError(err.message || 'Failed to resolve market');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      {error && <p className="text-red-500">{error}</p>}
      <div>
        <label className="block text-sm font-medium text-gray-700">Outcome</label>
        <select
          value={outcome.toString()} // Convert boolean to string for select
          onChange={(e) => setOutcome(e.target.value === 'true')}
          className="mt-1 p-2 border rounded w-full focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
      >
        {loading ? 'Resolving...' : 'Resolve Market'}
      </button>
    </form>
  );
}
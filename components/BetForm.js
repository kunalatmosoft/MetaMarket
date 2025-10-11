'use client';

import { useState } from 'react';
import { parseEther } from 'ethers'; // ✅ Correct import for v6+
import { useRouter } from 'next/navigation';
import { getContract } from '@/lib/contract.js';

export default function BetForm({ marketId }) {
  const [amount, setAmount] = useState('');
  const [outcome, setOutcome] = useState('yes');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const contract = await getContract();
      const betAmount = parseEther(amount || '0'); // ✅ Updated usage
      const tx = await contract.placeBet(marketId, outcome === 'yes', { value: betAmount });
      await tx.wait();
      router.refresh();
    } catch (err) {
      setError(err.message || 'Failed to place bet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      {error && <p className="text-red-500">{error}</p>}
      <div>
        <label className="block text-sm font-medium">Bet Amount (ETH)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mt-1 p-2 border rounded w-full"
          step="0.01"
          min="0.0001"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Outcome</label>
        <select
          value={outcome}
          onChange={(e) => setOutcome(e.target.value)}
          className="mt-1 p-2 border rounded w-full"
        >
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white p-2 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? 'Placing Bet...' : 'Place Bet'}
      </button>
    </form>
  );
}

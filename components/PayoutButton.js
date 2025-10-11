'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getContract } from '../lib/contract';

export default function PayoutButton({ marketId }) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handlePayout = async () => {
    setError('');
    setLoading(true);

    try {
      const contract = await getContract();

      // Correct function name
      const tx = await contract.claimPayout(marketId);
      await tx.wait();

      router.refresh();
    } catch (err) {
      // Handle different error structures
      let message = 'Failed to claim payout';
      if (err?.reason) {
        // ethers.js custom error reason
        message = err.reason;
      } else if (err?.data?.message) {
        message = err.data.message;
      } else if (err?.message) {
        message = err.message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      {error && (
        <p className="text-red-500 break-words">
          {error}
        </p>
      )}
      <button
        onClick={handlePayout}
        disabled={loading}
        className="w-full bg-green-600 text-white p-2 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
      >
        {loading ? 'Claiming Payout...' : 'Claim Payout'}
      </button>
    </div>
  );
}

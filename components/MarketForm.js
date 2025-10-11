'use client';

import { useState } from 'react';
import { ethers, parseEther } from 'ethers';
import { useRouter } from 'next/navigation';
import { getContract } from '../lib/contract.js';
import { format } from 'date-fns';

// UI Components
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

export default function MarketForm() {
  const [formData, setFormData] = useState({
    question: '',
    description: '',
    category: '',
    resolutionSource: '',
    resolutionDate: '',
    initialLiquidity: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const categories = [
    { value: 'politics', label: 'Politics' },
    { value: 'crypto', label: 'Crypto' },
    { value: 'sports', label: 'Sports' },
    { value: 'technology', label: 'Technology' },
    { value: 'economics', label: 'Economics' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'other', label: 'Other' },
  ];

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const contract = await getContract();
      const resolutionTimestamp = Math.floor(
        new Date(formData.resolutionDate).getTime() / 1000
      );
      const liquidity = parseEther(formData.initialLiquidity || '0');

      const metadata = {
        question: formData.question,
        description: formData.description,
        category: formData.category,
        resolutionSource: formData.resolutionSource,
      };

      const metadataBytes = ethers.toUtf8Bytes(JSON.stringify(metadata));

      const tx = await contract.createMarket(metadataBytes, resolutionTimestamp, {
        value: liquidity,
      });

      await tx.wait();
      router.push('/markets');
    } catch (err) {
      console.error(err);
      setError(err?.message || 'Failed to create market');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Form */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Market Details</CardTitle>
            <CardDescription>
              Provide clear and specific information about your prediction market
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
              {error && <p className="text-red-500">{error}</p>}

              <div>
                <Label htmlFor="question">Market Question</Label>
                <Input
                  id="question"
                  name="question"
                  placeholder="e.g., Will Bitcoin reach $100,000 by end of 2024?"
                  value={formData.question}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description & Resolution Criteria</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Provide detailed resolution criteria and context..."
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, category: value }))
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="resolutionSource">Resolution Source</Label>
                <Input
                  id="resolutionSource"
                  name="resolutionSource"
                  placeholder="e.g., CoinMarketCap, Official Election Results"
                  value={formData.resolutionSource}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label>Resolution Date</Label>
                <Input
                  type="datetime-local"
                  name="resolutionDate"
                  value={formData.resolutionDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label>Initial Liquidity (ETH)</Label>
                <Input
                  type="number"
                  name="initialLiquidity"
                  value={formData.initialLiquidity}
                  onChange={handleChange}
                  step="0.0001"
                  min="0.0001"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-500"
              >
                {loading ? 'Creating...' : 'Create Market'}
              </button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Preview & Guidelines */}
      <div className="space-y-6">
        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            {formData.question ? (
              <div className="space-y-3">
                <h3 className="font-semibold leading-tight">{formData.question}</h3>
                {formData.category && (
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs">
                      {
                        categories.find((c) => c.value === formData.category)?.label
                      }
                    </span>
                  </div>
                )}
                {formData.description && (
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {formData.description}
                  </p>
                )}
                {formData.resolutionDate && (
                  <p className="text-sm text-muted-foreground">
                    Resolves: {format(new Date(formData.resolutionDate), 'PPP')}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                Fill out the form to see a preview of your market
              </p>
            )}
          </CardContent>
        </Card>

        {/* Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle>Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <h4 className="font-medium mb-1">Good Questions</h4>
              <ul className="text-muted-foreground space-y-1">
                <li>• Clear yes/no outcomes</li>
                <li>• Specific timeframes</li>
                <li>• Verifiable results</li>
                <li>• Public interest</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-1">Avoid</h4>
              <ul className="text-muted-foreground space-y-1">
                <li>• Subjective questions</li>
                <li>• Harmful content</li>
                <li>• Personal information</li>
                <li>• Illegal activities</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Fees */}
        <Card>
          <CardHeader>
            <CardTitle>Market Creation Fee</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Creation Fee</span>
                <span>$10.00</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Fee</span>
                <span>2% of volume</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-medium">
                <span>Total Due</span>
                <span>$10.00</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


/* 'use client';

import { useState } from 'react';
import { ethers, parseEther } from 'ethers';
import { getContract } from '../lib/contract.js';
import { useRouter } from 'next/navigation';

export default function MarketForm() {
  const [formData, setFormData] = useState({
    question: '',
    description: '',
    category: '',
    resolutionSource: '',
    resolutionDate: '',
    initialLiquidity: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const contract = await getContract();
      const resolutionTimestamp = Math.floor(new Date(formData.resolutionDate).getTime() / 1000);
      const liquidity = parseEther(formData.initialLiquidity || '0');

      // ✅ Construct metadata and convert to bytes
      const metadata = {
        question: formData.question,
        description: formData.description,
        category: formData.category,
        resolutionSource: formData.resolutionSource,
      };
      const metadataBytes = ethers.toUtf8Bytes(JSON.stringify(metadata));

      // ✅ Call contract function correctly
      const tx = await contract.createMarket(
        metadataBytes,
        resolutionTimestamp,
        { value: liquidity }
      );

      await tx.wait();
      router.push('/markets');
    } catch (err) {
      console.error(err);
      setError(err?.message || 'Failed to create market');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
      {error && <p className="text-red-500">{error}</p>}

      <div>
        <label className="block text-sm font-medium">Question</label>
        <input
          type="text"
          name="question"
          value={formData.question}
          onChange={handleChange}
          className="mt-1 p-2 border rounded w-full"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="mt-1 p-2 border rounded w-full"
          rows="4"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Category</label>
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="mt-1 p-2 border rounded w-full"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Resolution Source</label>
        <input
          type="text"
          name="resolutionSource"
          value={formData.resolutionSource}
          onChange={handleChange}
          className="mt-1 p-2 border rounded w-full"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Resolution Date</label>
        <input
          type="datetime-local"
          name="resolutionDate"
          value={formData.resolutionDate}
          onChange={handleChange}
          className="mt-1 p-2 border rounded w-full"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Initial Liquidity (ETH)</label>
        <input
          type="number"
          name="initialLiquidity"
          value={formData.initialLiquidity}
          onChange={handleChange}
          className="mt-1 p-2 border rounded w-full"
          step="0.0001"
          min="0.0001"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-500"
      >
        {loading ? 'Creating...' : 'Create Market'}
      </button>
    </form>
  );
}
 */
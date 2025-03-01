import React from 'react';
import { PhoneCall } from 'lucide-react';
import type { VirtualNumber } from '../types';
import { useState, useEffect } from 'react';
import { getAvailableNumbers } from '../lib/getotp';

interface NumberSelectorProps {
  onSelect: (number: VirtualNumber) => void;
}

export function NumberSelector({ onSelect }: NumberSelectorProps) {
  const [numbers, setNumbers] = useState<VirtualNumber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAvailableNumbers();
  }, []);

  const fetchAvailableNumbers = async () => {
    try {
      const numbers = await getAvailableNumbers();
      setNumbers(numbers);
      setError(null);
    } catch (err) {
      setError('Failed to load available numbers. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="flex items-center gap-2 mb-6">
        <PhoneCall className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-semibold text-gray-900">Select Virtual Number</h2>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading available numbers...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}
      
      {!loading && !error && (
        <div className="space-y-3">
        {numbers.map((number) => (
          <button
            key={number.id}
            onClick={() => onSelect(number)}
            className="w-full p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 text-left"
          >
            <div className="font-medium text-gray-900">{number.number}</div>
            <div className="text-sm text-gray-500">{number.country}</div>
            <div className="mt-2">
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                Available
              </span>
            </div>
          </button>
        ))}
        </div>
      )}
    </div>
  );
}
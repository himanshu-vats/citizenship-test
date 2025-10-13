'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function InlineZipPrompt({ onSave, onSkip, currentQuestion }) {
  const [zipCode, setZipCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!/^\d{5}$/.test(zipCode)) {
      setError('Please enter a valid 5-digit ZIP code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/representatives?zipCode=${zipCode}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch information');
      }

      // Save to localStorage
      const saveData = {
        zipCode,
        ...data,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem('userRepresentatives', JSON.stringify(saveData));

      onSave(saveData);
    } catch (err) {
      setError(err.message || 'Failed to fetch information');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 sm:p-8 border-t-4 border-blue-600 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center mb-4">
          <span className="text-3xl mr-3">📍</span>
          <h2 className="text-2xl font-bold text-gray-900">
            Personalize This Answer
          </h2>
        </div>

        <p className="text-gray-700 mb-4">
          This question asks about <strong>YOUR state</strong>. Add your ZIP code to see the correct answer for where you live.
        </p>

        <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-6 rounded-r-lg">
          <p className="text-sm font-bold text-blue-900 mb-2">
            We&apos;ll remember for future questions:
          </p>
          <div className="text-sm text-blue-800 space-y-1">
            <p>✓ Your 2 U.S. Senators</p>
            <p>✓ Your Governor</p>
            <p>✓ Your State Capital</p>
            <p className="text-xs text-blue-700 mt-2 italic">
              Note: We can&apos;t determine your House Representative from ZIP code alone -
              congressional districts don&apos;t align with ZIP boundaries.
            </p>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-900 mb-2">
            Your ZIP Code
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={zipCode}
              onChange={(e) => {
                setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5));
                setError('');
              }}
              placeholder="12345"
              maxLength="5"
              className="flex-1 p-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none text-gray-900 font-medium text-lg"
              disabled={loading}
              autoFocus
            />
            <button
              onClick={handleSubmit}
              disabled={loading || zipCode.length !== 5}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {loading ? 'Loading...' : 'Save'}
            </button>
          </div>
          {error && (
            <p className="text-red-600 mt-2 text-sm font-medium">{error}</p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={onSkip}
            className="w-full py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-all"
          >
            Skip - I&apos;ll Answer Generically
          </button>

          <Link
            href="/settings"
            className="text-center text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Or add ZIP code in Settings later
          </Link>
        </div>

        <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-lg">
          <p className="text-xs text-yellow-900">
            <strong>Privacy:</strong> Your ZIP code is stored only on this device and never sent to our servers.
          </p>
        </div>
      </div>
    </div>
  );
}

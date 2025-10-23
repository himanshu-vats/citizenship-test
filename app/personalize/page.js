'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TopNav from '@/components/TopNav';

export default function Personalize() {
  const [zipCode, setZipCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [representatives, setRepresentatives] = useState(null);
  const [savedInfo, setSavedInfo] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('userRepresentatives');
    if (saved) {
      setSavedInfo(JSON.parse(saved));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!/^\d{5}$/.test(zipCode)) {
      setError('Please enter a valid 5-digit ZIP code');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/representatives?zipCode=${zipCode}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch representatives');
      }

      setRepresentatives(data);
      
      const saveData = {
        zipCode,
        ...data,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem('userRepresentatives', JSON.stringify(saveData));
      setSavedInfo(saveData);
    } catch (err) {
      setError(err.message || 'Failed to fetch representative information');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    localStorage.removeItem('userRepresentatives');
    setSavedInfo(null);
    setRepresentatives(null);
    setZipCode('');
  };

  return (
    <>
      <TopNav />

      <div className="min-h-screen bg-gradient-to-br from-red-600 via-white to-blue-700 dark:from-red-900 dark:via-slate-900 dark:to-blue-900">
        <main className="px-4 py-6">
          <div className="max-w-4xl mx-auto">

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 border-t-4 border-blue-600 dark:border-blue-500">
            <div className="flex items-center mb-6">
              <span className="text-4xl mr-3">📍</span>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Learn Your Representatives
                </h1>
                <p className="text-gray-600 dark:text-slate-300 mt-1">
                  Know your senators, representative, governor, and state capital
                </p>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-600 dark:border-blue-500 p-4 mb-6 rounded-r-lg">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>Why this matters:</strong> Questions 23, 29, 30, 43, 44, and 61 on the citizenship test
                ask about your specific representatives. Enter your ZIP code to get personalized answers!
              </p>
            </div>

          <form onSubmit={handleSubmit} className="mb-8">
            <label className="block text-lg font-bold text-gray-900 dark:text-white mb-3">
              Enter Your ZIP Code
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                placeholder="12345"
                maxLength="5"
                className="flex-1 p-4 border-2 border-gray-300 dark:border-slate-600 rounded-lg focus:border-blue-600 dark:focus:border-blue-500 focus:outline-none text-gray-900 dark:text-white bg-white dark:bg-slate-700 font-medium text-lg"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || zipCode.length !== 5}
                className="px-8 py-4 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all disabled:bg-gray-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed"
              >
                {loading ? 'Loading...' : 'Find'}
              </button>
            </div>
            {error && (
              <p className="text-red-600 dark:text-red-400 mt-2 text-sm font-medium">{error}</p>
            )}
          </form>

          {savedInfo && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Representatives</h2>
                <button
                  onClick={handleClear}
                  className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium"
                >
                  Clear Saved Info
                </button>
              </div>

              {savedInfo.state && (
                <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg border border-gray-200 dark:border-slate-600">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center">
                    <span className="text-xl mr-2">🗺️</span>
                    State Information
                  </h3>
                  <div className="space-y-1 text-gray-700 dark:text-slate-300">
                    <p><strong>State:</strong> {savedInfo.stateName || savedInfo.state}</p>
                    {savedInfo.city && <p><strong>City:</strong> {savedInfo.city}</p>}
                  </div>
                </div>
              )}

              {savedInfo.capital && (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg border border-yellow-200 dark:border-yellow-700">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center">
                    <span className="text-xl mr-2">🏛️</span>
                    Question 62: State Capital
                  </h3>
                  <p className="text-lg text-gray-900 dark:text-white font-semibold">{savedInfo.capital}</p>
                </div>
              )}

              {savedInfo.governor && (
                <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-700">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center">
                    <span className="text-xl mr-2">👔</span>
                    Question 61: Your Governor
                  </h3>
                  <p className="text-lg text-gray-900 dark:text-white font-semibold">{savedInfo.governor}</p>
                </div>
              )}

              {savedInfo.senators && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center">
                    <span className="text-xl mr-2">🏛️</span>
                    Question 23: Your U.S. Senators
                  </h3>
                  {Array.isArray(savedInfo.senators) && savedInfo.senators.length > 0 ? (
                    <ul className="space-y-1">
                      {savedInfo.senators.map((senator, index) => (
                        <li key={index} className="text-lg text-gray-900 dark:text-white font-semibold">
                          • {senator}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div>
                      <p className="text-gray-700 dark:text-slate-300 mb-2">{savedInfo.senators}</p>

                        <a href="https://www.senate.gov/senators/senators-contact.htm"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-sm"
                      >
                        Find your senators on senate.gov
                      </a>
                    </div>
                  )}
                </div>
              )}

              {savedInfo.representative && (
                <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg border border-purple-200 dark:border-purple-700">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center">
                    <span className="text-xl mr-2">🏛️</span>
                    Question 29: Your U.S. Representative
                  </h3>
                  {typeof savedInfo.representative === 'string' && !savedInfo.representative.includes('Visit') ? (
                    <p className="text-lg text-gray-900 dark:text-white font-semibold">{savedInfo.representative}</p>
                  ) : (
                    <div>
                      <p className="text-gray-700 dark:text-slate-300 mb-2">
                        {typeof savedInfo.representative === 'string'
                          ? savedInfo.representative
                          : 'Visit house.gov to find your representative'}
                      </p>

                       <a href="https://www.house.gov/representatives/find-your-representative"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-sm"
                      >
                        Find your representative on house.gov
                      </a>
                    </div>
                  )}
                </div>
              )}

              {savedInfo.message && (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg border-l-4 border-yellow-500 dark:border-yellow-600">
                  <p className="text-sm text-yellow-900 dark:text-yellow-200">{savedInfo.message}</p>
                </div>
              )}

              {savedInfo.lastUpdated && (
                <p className="text-xs text-gray-500 dark:text-slate-400 text-center mt-4">
                  Last updated: {new Date(savedInfo.lastUpdated).toLocaleDateString()}
                </p>
              )}
            </div>
          )}
          </div>

          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border-l-4 border-blue-600 dark:border-blue-500">
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">💡 Study Tip</h3>
            <p className="text-sm text-gray-700 dark:text-slate-300">
              Write down your representatives names and practice saying them out loud.
              During your citizenship interview, you will need to answer these questions verbally!
            </p>
          </div>
        </div>
        </main>
      </div>
    </>
  );
}
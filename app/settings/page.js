'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Settings() {
  const [zipCode, setZipCode] = useState('');
  const [testVersion, setTestVersion] = useState('2025');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [savedInfo, setSavedInfo] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    // Load saved representatives
    const saved = localStorage.getItem('userRepresentatives');
    if (saved) {
      const data = JSON.parse(saved);
      setSavedInfo(data);
      setZipCode(data.zipCode || '');
    }

    // Load test version preference
    const version = localStorage.getItem('testVersion');
    if (version) {
      setTestVersion(version);
    }
  }, []);

  const handleZipSubmit = async (e) => {
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

  const handleClearZip = () => {
    localStorage.removeItem('userRepresentatives');
    setSavedInfo(null);
    setZipCode('');
  };

  const handleVersionChange = (version) => {
    setTestVersion(version);
    localStorage.setItem('testVersion', version);
  };

  const handleClearAllData = () => {
    if (showClearConfirm) {
      // Clear all localStorage data
      localStorage.clear();
      setSavedInfo(null);
      setZipCode('');
      setTestVersion('2025');
      setShowClearConfirm(false);
      alert('All data has been cleared.');
    } else {
      setShowClearConfirm(true);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-red-600 via-white to-blue-700 p-4 pb-20">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center text-blue-700 hover:text-blue-900 font-bold mb-6 bg-white px-4 py-2 rounded-lg shadow-md"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>
        <div className="bg-white rounded-2xl shadow-2xl p-6 border-t-4 border-blue-600">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-3">⚙️</span>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600 mt-1">Manage your preferences</p>
            </div>
          </div>

          {/* Test Version Selection */}
          <section className="mb-8 pb-8 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Test Version</h2>
            <p className="text-sm text-gray-600 mb-4">
              Choose which test version to use based on your N-400 filing date.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => handleVersionChange('2025')}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                  testVersion === '2025'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-gray-900">
                      2025 Test (128 Questions)
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      For N-400 filed on/after October 20, 2025
                    </div>
                  </div>
                  {testVersion === '2025' && (
                    <span className="text-2xl">✓</span>
                  )}
                </div>
              </button>

              <button
                onClick={() => handleVersionChange('2008')}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                  testVersion === '2008'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-gray-900">
                      2008 Test (100 Questions)
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      For N-400 filed before October 20, 2025
                    </div>
                  </div>
                  {testVersion === '2008' && (
                    <span className="text-2xl">✓</span>
                  )}
                </div>
              </button>
            </div>
          </section>

          {/* ZIP Code / Representatives */}
          <section className="mb-8 pb-8 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-3">My State Info</h2>
            <p className="text-sm text-gray-600 mb-4">
              Enter your ZIP code to personalize questions about YOUR state officials.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-3 mb-4 rounded-r-lg">
              <p className="text-xs font-bold text-blue-900 mb-1">What we can determine from your ZIP:</p>
              <div className="text-xs text-blue-800 space-y-1">
                <p>✓ Your 2 U.S. Senators</p>
                <p>✓ Your Governor</p>
                <p>✓ Your State Capital</p>
                <p className="text-xs text-blue-700 mt-2">
                  ✗ Your House Representative - ZIP codes don&apos;t align with congressional districts.
                  We&apos;ll show you where to look it up when needed.
                </p>
              </div>
            </div>

            <form onSubmit={handleZipSubmit} className="mb-4">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                ZIP Code
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                  placeholder="12345"
                  maxLength="5"
                  className="flex-1 p-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none text-gray-900"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || zipCode.length !== 5}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {loading ? 'Loading...' : 'Save'}
                </button>
              </div>
              {error && (
                <p className="text-red-600 mt-2 text-sm">{error}</p>
              )}
            </form>

            {savedInfo && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-gray-900">Saved Information</span>
                  <button
                    onClick={handleClearZip}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Clear
                  </button>
                </div>
                <div className="space-y-1 text-sm text-gray-700">
                  {savedInfo.stateName && (
                    <p><strong>State:</strong> {savedInfo.stateName}</p>
                  )}
                  {savedInfo.capital && (
                    <p><strong>Capital:</strong> {savedInfo.capital}</p>
                  )}
                  {savedInfo.governor && (
                    <p><strong>Governor:</strong> {savedInfo.governor}</p>
                  )}
                  {savedInfo.senators && Array.isArray(savedInfo.senators) && (
                    <p><strong>Senators:</strong> {savedInfo.senators.join(', ')}</p>
                  )}
                </div>
              </div>
            )}
          </section>

          {/* Data Management */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Data Management</h2>
            <p className="text-sm text-gray-600 mb-4">
              Clear all saved data including test history, progress, and preferences.
            </p>
            <button
              onClick={handleClearAllData}
              className={`w-full py-3 rounded-lg font-bold transition-all ${
                showClearConfirm
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {showClearConfirm ? 'Click Again to Confirm' : 'Clear All Data'}
            </button>
            {showClearConfirm && (
              <button
                onClick={() => setShowClearConfirm(false)}
                className="w-full mt-2 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
            )}
          </section>

          {/* About */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">About</h2>
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <strong>US Citizenship Test 2025</strong>
              </p>
              <p>
                Practice for your USCIS civics test with official questions from both the 2008 and 2025 versions.
              </p>
              <p className="text-xs text-gray-500 mt-4">
                Version 1.0.0
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

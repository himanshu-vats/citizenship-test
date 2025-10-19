'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AppHeader from '@/components/AppHeader';

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
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-red-600 via-white to-blue-700 dark:from-red-900 dark:via-slate-900 dark:to-blue-900">
      <AppHeader title="Settings" showBack={true} backHref="/" />
      <main className="flex-1 overflow-y-auto px-3 py-2 min-h-0">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 border-t-4 border-blue-600 dark:border-blue-500">
            <div className="flex items-center mb-6">
              <span className="text-4xl mr-3">⚙️</span>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
                <p className="text-gray-600 dark:text-slate-300 mt-1">Manage your preferences</p>
              </div>
            </div>

          {/* Test Version Selection */}
          <section className="mb-8 pb-8 border-b border-gray-200 dark:border-slate-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Test Version</h2>
            <p className="text-sm text-gray-600 dark:text-slate-300 mb-4">
              Choose which test version to use based on your N-400 filing date.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              <button
                onClick={() => handleVersionChange('2025')}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                  testVersion === '2025'
                    ? 'border-blue-500 bg-blue-500 text-white shadow-lg'
                    : 'border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-gray-400 dark:hover:border-slate-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">
                      2025 Test (128 Questions)
                    </div>
                    <div className="text-sm text-gray-600 dark:text-slate-300 mt-1 opacity-90">
                      For N-400 filed on/after October 20, 2025
                    </div>
                  </div>
                  {testVersion === '2025' && (
                    <span className="text-2xl text-white">✓</span>
                  )}
                </div>
              </button>

              <button
                onClick={() => handleVersionChange('2008')}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                  testVersion === '2008'
                    ? 'border-blue-500 bg-blue-500 text-white shadow-lg'
                    : 'border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-gray-400 dark:hover:border-slate-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">
                      2008 Test (100 Questions)
                    </div>
                    <div className="text-sm text-gray-600 dark:text-slate-300 mt-1 opacity-90">
                      For N-400 filed before October 20, 2025
                    </div>
                  </div>
                  {testVersion === '2008' && (
                    <span className="text-2xl text-white">✓</span>
                  )}
                </div>
              </button>
            </div>
          </section>

          {/* ZIP Code / Representatives */}
          <section className="mb-8 pb-8 border-b border-gray-200 dark:border-slate-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">My State Info</h2>
            <p className="text-sm text-gray-600 dark:text-slate-300 mb-4">
              Enter your ZIP code to personalize questions about YOUR state officials.
            </p>

            <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 dark:border-blue-600 p-3 mb-4 rounded-r-lg">
              <p className="text-xs font-bold text-blue-900 dark:text-blue-200 mb-1">What we can determine from your ZIP:</p>
              <div className="text-xs text-blue-800 dark:text-blue-300 space-y-1">
                <p>✓ Your 2 U.S. Senators</p>
                <p>✓ Your Governor</p>
                <p>✓ Your State Capital</p>
                <p className="text-xs text-blue-700 dark:text-blue-400 mt-2">
                  ✗ Your House Representative - ZIP codes don&apos;t align with congressional districts.
                  We&apos;ll show you where to look it up when needed.
                </p>
              </div>
            </div>

            <form onSubmit={handleZipSubmit} className="mb-4">
              <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">
                ZIP Code
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                  placeholder="12345"
                  maxLength="5"
                  className="flex-1 p-3 border-2 border-gray-300 dark:border-slate-600 rounded-lg focus:border-blue-600 dark:focus:border-blue-500 focus:outline-none text-gray-900 dark:text-white bg-white dark:bg-slate-700"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || zipCode.length !== 5}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all disabled:bg-gray-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed"
                >
                  {loading ? 'Loading...' : 'Save'}
                </button>
              </div>
              {error && (
                <p className="text-red-600 dark:text-red-400 mt-2 text-sm">{error}</p>
              )}
            </form>

            {savedInfo && (
              <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 border border-gray-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-gray-900 dark:text-white">Saved Information</span>
                  <button
                    onClick={handleClearZip}
                    className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                  >
                    Clear
                  </button>
                </div>
                <div className="space-y-1 text-sm text-gray-700 dark:text-slate-300">
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
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Data Management</h2>
            <p className="text-sm text-gray-600 dark:text-slate-300 mb-4">
              Clear all saved data including test history, progress, and preferences.
            </p>
            <button
              onClick={handleClearAllData}
              className={`w-full py-3 rounded-lg font-bold transition-all ${
                showClearConfirm
                  ? 'bg-red-600 dark:bg-red-700 text-white hover:bg-red-700 dark:hover:bg-red-600'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600'
              }`}
            >
              {showClearConfirm ? 'Click Again to Confirm' : 'Clear All Data'}
            </button>
            {showClearConfirm && (
              <button
                onClick={() => setShowClearConfirm(false)}
                className="w-full mt-2 py-2 text-sm text-gray-600 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200"
              >
                Cancel
              </button>
            )}
          </section>

          {/* About */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">About</h2>
            <div className="space-y-2 text-sm text-gray-700 dark:text-slate-300">
              <p>
                <strong>US Citizenship Test 2025</strong>
              </p>
              <p>
                Practice for your USCIS civics test with official questions from both the 2008 and 2025 versions.
              </p>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-4">
                Version 1.0.0
              </p>
            </div>
          </section>
        </div>
      </div>
      </main>
    </div>
  );
}

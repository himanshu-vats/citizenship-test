'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/lib/ThemeContext';

export default function MenuDrawer({ isOpen, onClose }) {
  const { theme, toggleTheme } = useTheme();
  const [testVersion, setTestVersion] = useState('2025');
  const [zipCode, setZipCode] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Load current settings
      const savedVersion = localStorage.getItem('testVersion') || '2025';
      setTestVersion(savedVersion);

      const savedInfo = localStorage.getItem('userRepresentatives');
      if (savedInfo) {
        try {
          const data = JSON.parse(savedInfo);
          setZipCode(data.zipCode || '');
        } catch (e) {
          setZipCode('');
        }
      } else {
        setZipCode('');
      }
    }
  }, [isOpen]);

  const handleVersionToggle = () => {
    const newVersion = testVersion === '2025' ? '2008' : '2025';
    setTestVersion(newVersion);
    localStorage.setItem('testVersion', newVersion);
  };

  const handleClearZip = () => {
    localStorage.removeItem('userRepresentatives');
    setZipCode('');
  };

  const handleClearAllData = () => {
    if (showClearConfirm) {
      localStorage.clear();
      setZipCode('');
      setTestVersion('2025');
      setShowClearConfirm(false);
      onClose();
      window.location.reload(); // Refresh to show cleared state
    } else {
      setShowClearConfirm(true);
      setTimeout(() => setShowClearConfirm(false), 5000); // Auto-cancel after 5s
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/5 dark:bg-black/20 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white dark:bg-slate-900 shadow-2xl z-50 transform transition-transform">
        <div className="flex flex-col h-full">

          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Settings</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6 text-gray-700 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto py-4 px-4 space-y-4">

            {/* Home Link */}
            <Link
              href="/"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors border-b border-gray-200 dark:border-slate-700 pb-4"
            >
              <span className="text-2xl">🏠</span>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">Home</div>
                <div className="text-xs text-gray-600 dark:text-slate-400">Back to main screen</div>
              </div>
            </Link>

            {/* Dark Mode Toggle */}
            <div className="border-b border-gray-200 dark:border-slate-700 pb-4">
              <button
                onClick={toggleTheme}
                className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{theme === 'dark' ? '🌙' : '☀️'}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">Dark Mode</span>
                </div>

                {/* Toggle Switch */}
                <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'
                }`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </div>
              </button>
            </div>

            {/* Test Version Toggle */}
            <div className="border-b border-gray-200 dark:border-slate-700 pb-4">
              <button
                onClick={handleVersionToggle}
                className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📝</span>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900 dark:text-white">Test Version</div>
                    <div className="text-xs text-gray-600 dark:text-slate-400">{testVersion} Test</div>
                  </div>
                </div>

                {/* Toggle Switch */}
                <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  testVersion === '2025' ? 'bg-blue-600' : 'bg-gray-300'
                }`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    testVersion === '2025' ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </div>
              </button>
            </div>

            {/* Stats Link */}
            <Link
              href="/stats"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors border-b border-gray-200 dark:border-slate-700 pb-4"
            >
              <span className="text-2xl">📊</span>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">Your Stats</div>
                <div className="text-xs text-gray-600 dark:text-slate-400">View test history</div>
              </div>
            </Link>

            {/* ZIP Code / Advanced Settings */}
            <Link
              href="/settings"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors border-b border-gray-200 dark:border-slate-700 pb-4"
            >
              <span className="text-2xl">📍</span>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  ZIP Code {zipCode && `(${zipCode})`}
                </div>
                <div className="text-xs text-gray-600 dark:text-slate-400">
                  {zipCode ? 'Manage personalization' : 'Add for personalization'}
                </div>
              </div>
            </Link>

            {/* Clear All Data */}
            <div className="pt-2">
              <button
                onClick={handleClearAllData}
                className={`w-full px-4 py-3 rounded-lg font-semibold transition-all ${
                  showClearConfirm
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                }`}
              >
                {showClearConfirm ? '⚠️ Tap Again to Confirm' : '🗑️ Clear All Data'}
              </button>
              {showClearConfirm && (
                <p className="text-xs text-gray-600 dark:text-slate-400 text-center mt-2">
                  This will delete all test history and settings
                </p>
              )}
            </div>

          </div>

        </div>
      </div>
    </>
  );
}

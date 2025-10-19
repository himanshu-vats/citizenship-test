'use client';

import Link from 'next/link';

export default function AppHeader({ title, showBack = false, backHref = '/', onBackClick, showHomeIcon = false }) {
  return (
    <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        {/* Three-column grid layout - modern app pattern */}
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2">
          {/* Left: Back button */}
          <div className="flex items-center">
            {showBack && (
              <>
                {onBackClick ? (
                  <button
                    onClick={onBackClick}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 rounded-lg text-sm font-semibold transition-all border border-gray-200 dark:border-slate-700"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                  </button>
                ) : (
                  <Link
                    href={backHref}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 rounded-lg text-sm font-semibold transition-all border border-gray-200 dark:border-slate-700"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Center: Title with truncation for long titles */}
          {title && (
            <h1 className="text-base sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white text-center truncate px-2">
              {title}
            </h1>
          )}

          {/* Right: Menu Icon - Home or Settings */}
          <div className="flex items-center justify-end">
            {showHomeIcon ? (
              <Link
                href="/"
                className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                aria-label="Home"
              >
                <svg className="w-5 h-5 text-gray-700 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </Link>
            ) : (
              <Link
                href="/settings"
                className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                aria-label="Settings"
              >
                <svg className="w-5 h-5 text-gray-700 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

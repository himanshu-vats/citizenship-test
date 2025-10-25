'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function AppHeader({ title, showBack = false, backHref = '/', onBackClick, showHomeIcon = false }) {
  const [menuOpen, setMenuOpen] = useState(false);

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

          {/* Right: Menu Icon with Dropdown */}
          <div className="flex items-center justify-end relative">
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
              <>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                  aria-label="Menu"
                >
                  <svg className="w-5 h-5 text-gray-700 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {menuOpen && (
                  <>
                    {/* Backdrop to close menu */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setMenuOpen(false)}
                    />

                    {/* Menu */}
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 py-2 z-50">
                      <Link
                        href="/"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Home
                      </Link>

                      <Link
                        href="/study"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        Study
                      </Link>

                      <Link
                        href="/blog-simple"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                        Posts
                      </Link>

                      <Link
                        href="/stats"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Stats
                      </Link>

                      <hr className="my-2 border-gray-200 dark:border-slate-700" />

                      <Link
                        href="/settings"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Settings
                      </Link>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

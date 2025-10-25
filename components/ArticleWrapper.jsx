'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/lib/ThemeContext';

export default function ArticleWrapper({ htmlContent, slug }) {
  const router = useRouter();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Force light/dark mode based on user's choice
  const isDark = mounted && (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches));

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white">
        <div className="animate-pulse text-gray-400 text-center py-12">
          Loading article...
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Minimal Top Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>

          <a
            href="/"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Practice Test
          </a>
        </div>
      </div>

      {/* Override article's dark mode styles */}
      <style jsx global>{`
        /* Force light mode styles */
        ${!isDark ? `
          body, .container, .article-container {
            background: #f8f9fa !important;
            color: #333 !important;
          }
          .sidebar {
            background: linear-gradient(180deg, #1e3a8a 0%, #1e40af 100%) !important;
            color: white !important;
          }
          .content {
            background: white !important;
            color: #333 !important;
          }
          .content h1, .content h2, .content h3 {
            color: #1e3a8a !important;
          }
          .content p, .content li {
            color: #374151 !important;
          }
          .meta {
            border-bottom-color: #e5e7eb !important;
          }
          .intro {
            background: #eff6ff !important;
            color: #4b5563 !important;
          }
        ` : `
          /* Dark mode styles */
          body, .container, .article-container {
            background: #0f172a !important;
            color: #e2e8f0 !important;
          }
          .sidebar {
            background: linear-gradient(180deg, #1e3a8a 0%, #1e293b 100%) !important;
          }
          .content {
            background: #0f172a !important;
          }
          .content h1, .content h2, .content h3 {
            color: #93c5fd !important;
          }
          .content p, .content li {
            color: #cbd5e1 !important;
          }
          .intro {
            background: #1e3a8a20 !important;
            color: #cbd5e1 !important;
          }
        `}
      `}</style>

      {/* Article Content */}
      <div
        className="pt-12"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  );
}

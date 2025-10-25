'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function ContentHub() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Fetch file-based articles from API route
        const response = await fetch('/api/articles');
        if (response.ok) {
          const articles = await response.json();
          setPosts(articles.slice(0, 6)); // Take latest 6
        }
      } catch (error) {
        console.error('Failed to fetch articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Don't render if still loading
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto mt-8 mb-12">
        <div className="text-center py-12">
          <div className="animate-pulse text-gray-400 dark:text-slate-500">Loading articles...</div>
        </div>
      </div>
    );
  }

  // Don't render if no posts
  if (posts.length === 0) {
    return null;
  }

  // Category color mapping (Reddit-style)
  const categoryStyles = {
    'news': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-300 dark:border-red-800',
    'process-guide': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-800',
    'question-deep-dive': 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-300 dark:border-purple-800',
    'community-qa': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-300 dark:border-green-800'
  };

  const getCategoryStyle = (category) => {
    return categoryStyles[category] || 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 border-gray-300 dark:border-gray-700';
  };

  return (
    <div className="max-w-6xl mx-auto mt-8 mb-12">

      {/* Attention-Grabbing Header */}
      <div className="mb-8 text-center px-4">
        <div className="inline-flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/30 border-2 border-yellow-400 dark:border-yellow-600 rounded-lg px-4 py-2 mb-4">
          <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-bold text-yellow-900 dark:text-yellow-200">
            MUST READ: Essential Guides for Your Success
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          What Others Are Reading Right Now
        </h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-slate-400">
          Real answers to questions from people just like you
        </p>
      </div>

      {/* Articles Grid - Reddit/Forum Style */}
      <div className="space-y-4 px-4">
        {posts.map((post, index) => (
          <Link
            key={post.slug}
            href={`/blog-simple/${post.slug}`}
            className="group block bg-white dark:bg-slate-800 rounded-xl border-2 border-gray-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg transition-all"
          >
            <div className="flex gap-4 p-4">

              {/* Left: Engagement Indicator (like Reddit upvotes) */}
              <div className="flex-shrink-0 flex flex-col items-center justify-start pt-1">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-md">
                  #{index + 1}
                </div>
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 font-semibold">
                  HOT
                </div>
              </div>

              {/* Middle: Content */}
              <div className="flex-1 min-w-0">
                {/* Category Badge */}
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className={`inline-block px-2.5 py-0.5 text-xs font-bold rounded border ${getCategoryStyle(post.category)}`}>
                    {post.category.replace('-', ' ').toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    • {post.readTime}
                  </span>
                </div>

                {/* Title - Bold and Attention-Grabbing */}
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-sm text-gray-600 dark:text-slate-400 mb-3 line-clamp-2">
                  {post.description}
                </p>

                {/* CTA - Forum Style */}
                <div className="flex items-center gap-4 text-xs">
                  <span className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-semibold group-hover:underline">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Read full answer
                  </span>
                  <span className="text-gray-400 dark:text-gray-500">→</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom CTA - Social Proof Style */}
      <div className="mt-8 text-center">
        <Link
          href="/blog-simple"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all text-base"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          Browse All {posts.length > 0 ? `${posts.length}+` : ''} Articles
        </Link>

        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          💡 Join thousands preparing for their citizenship test
        </p>
      </div>

    </div>
  );
}

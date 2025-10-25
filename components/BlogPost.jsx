'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function BlogPost({
  title,
  description,
  date,
  readTime,
  category,
  content,
  tableOfContents = [],
  relatedPosts = []
}) {
  const [activeSection, setActiveSection] = useState('');

  return (
    <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Article Header */}
      <header className="max-w-4xl mx-auto mb-12">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link href="/blog-simple" className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">
            ← Back to all posts
          </Link>
        </nav>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600 dark:text-slate-400">
          <span className="inline-flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {date}
          </span>
          <span className="inline-flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {readTime}
          </span>
          {category && (
            <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-semibold rounded-full uppercase tracking-wide">
              {category}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
          {title}
        </h1>

        {/* Description */}
        {description && (
          <p className="text-xl text-gray-600 dark:text-slate-400 leading-relaxed">
            {description}
          </p>
        )}
      </header>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Table of Contents - Desktop Sidebar */}
        {tableOfContents.length > 0 && (
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                On This Page
              </h2>
              <nav className="space-y-2">
                {tableOfContents.map((item, index) => (
                  <a
                    key={index}
                    href={`#${item.id}`}
                    className={`block text-sm py-1 border-l-2 pl-3 transition-colors ${
                      activeSection === item.id
                        ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-medium'
                        : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:border-gray-400 dark:hover:border-slate-500 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {item.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>
        )}

        {/* Article Content */}
        <div className={`${tableOfContents.length > 0 ? 'lg:col-span-9' : 'lg:col-span-12'}`}>
          <div className="max-w-4xl prose prose-lg dark:prose-invert prose-blue mx-auto">
            {content}
          </div>

          {/* CTA Section */}
          <div className="max-w-4xl mx-auto mt-16 p-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Master the Civics Test?</h3>
            <p className="text-blue-100 mb-6">
              Join thousands of people preparing for their citizenship interview with free practice tests.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Start Studying for Free
            </Link>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="max-w-4xl mx-auto mt-16">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Related Articles
              </h3>
              <div className="grid gap-6 sm:grid-cols-2">
                {relatedPosts.map((post, index) => (
                  <Link
                    key={index}
                    href={`/blog-simple/${post.slug}`}
                    className="block p-6 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-lg transition-all group"
                  >
                    <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wide mb-2">
                      {post.category}
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {post.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-slate-400 line-clamp-2">
                      {post.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { client, queries, urlForImage, isSanityConfigured } from '@/lib/sanity';

export default function FeaturedArticles() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!isSanityConfigured()) {
        setLoading(false);
        return;
      }

      try {
        // Fetch featured posts, or latest 3 if no featured posts
        let featuredPosts = await client.fetch(queries.getFeaturedPosts);

        // If no featured posts, get the latest 3
        if (!featuredPosts || featuredPosts.length === 0) {
          featuredPosts = await client.fetch(`*[_type == "blogPost"] | order(publishedAt desc) [0...3] {
            _id,
            title,
            slug,
            excerpt,
            category,
            publishedAt,
            readTime,
            featuredImage,
            author
          }`);
        }

        setPosts(featuredPosts);
      } catch (error) {
        console.error('Failed to fetch featured articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Don't render if no posts or still loading
  if (loading || posts.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 max-w-5xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          📚 Essential Reading
        </h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-slate-400">
          Expert tips and guides for your citizenship journey
        </p>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link
            key={post._id}
            href={`/blog/${post.slug.current}`}
            className="group bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden border border-gray-200 dark:border-slate-700 hover:scale-105 hover:border-blue-300 dark:hover:border-blue-600"
          >
            {/* Featured Image */}
            {post.featuredImage && (
              <div className="h-40 relative bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 overflow-hidden">
                <img
                  src={urlForImage(post.featuredImage).width(400).height(250).url()}
                  alt={post.featuredImage.alt || post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            )}

            {/* Content */}
            <div className="p-5">
              {/* Category Badge */}
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-block px-2.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  {post.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {post.readTime}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                {post.title}
              </h3>

              {/* Excerpt */}
              <p className="text-sm text-gray-600 dark:text-slate-400 mb-3 line-clamp-2">
                {post.excerpt}
              </p>

              {/* Read More Link */}
              <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold text-sm">
                Read more
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* View All Link */}
      <div className="text-center mt-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-semibold rounded-lg shadow-md hover:shadow-lg border border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-slate-700 transition-all"
        >
          View All Articles
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

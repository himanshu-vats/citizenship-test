import Link from 'next/link';
import TopNav from '@/components/TopNav';
import { getAllPosts } from '@/lib/blog';

export const metadata = {
  title: 'Latest Updates & Guides | CivicsPass Blog',
  description: 'Stay informed with the latest news, tips, and comprehensive guides for US citizenship applicants',
};

export default function BlogPage() {
  const articles = getAllPosts();

  return (
    <>
      <TopNav />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
        <main className="px-4 py-8 max-w-6xl mx-auto">

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Latest Updates & Guides
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
              Stay informed with the latest news, tips, and comprehensive guides for US citizenship applicants
            </p>
          </div>

          {/* Categories Filter */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {['All', 'Question Deep Dive', 'Process Guide', 'News', 'Community Q&A'].map((cat) => (
              <button
                key={cat}
                className="px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors text-sm font-medium"
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Articles Grid */}
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {articles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/blog/${article.slug}`}
                  className="group bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-slate-700 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                        {article.category}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-slate-500">
                        {article.readTime}
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {article.title}
                    </h2>

                    <p className="text-sm text-gray-600 dark:text-slate-400 mb-4">
                      {article.excerpt}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-slate-500">
                      <span>{new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span className="text-blue-600 dark:text-blue-400 group-hover:underline">
                        Read more →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center p-12 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 mb-12">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                No Articles Yet
              </h3>
              <p className="text-gray-600 dark:text-slate-400 mb-4">
                Articles will appear here once they are published through the admin panel.
              </p>
              <Link
                href="/admin"
                className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all"
              >
                Go to Admin Panel
              </Link>
            </div>
          )}

          {/* Coming Soon Notice */}
          <div className="text-center p-8 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              More Articles Coming Daily!
            </h3>
            <p className="text-gray-600 dark:text-slate-400">
              We&apos;re working on bringing you daily updates with the latest citizenship news, test preparation tips, and comprehensive guides. Check back soon!
            </p>
          </div>

        </main>
      </div>
    </>
  );
}

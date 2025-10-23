import Link from 'next/link';
import TopNav from '@/components/TopNav';
import { getPostBySlug, getAllPosts } from '@/lib/blog';
import { notFound } from 'next/navigation';

// Generate static params for all blog posts
export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Generate metadata for each blog post
export async function generateMetadata({ params }) {
  const article = await getPostBySlug(params.slug);

  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  return {
    title: `${article.title} | CivicsPass Blog`,
    description: article.metaDescription,
    openGraph: {
      title: article.title,
      description: article.metaDescription,
      type: 'article',
      publishedTime: article.date,
    },
  };
}

export default async function BlogArticle({ params }) {
  const article = await getPostBySlug(params.slug);

  if (!article) {
    notFound();
  }

  return (
    <>
      <TopNav />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
        <main className="px-4 py-8 max-w-4xl mx-auto">

          {/* Back Link */}
          <Link
            href="/blog"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-6"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>

          {/* Article Header */}
          <article className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 sm:p-10 border border-gray-200 dark:border-slate-700">
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold mb-4">
                {article.category}
              </span>

              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {article.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-slate-400">
                <time dateTime={article.date}>
                  {new Date(article.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </time>
                <span>•</span>
                <span>{article.readTime}</span>
              </div>
            </div>

            {/* Article Content */}
            <div
              className="prose dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-slate-300 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-strong:text-gray-900 dark:prose-strong:text-white prose-ul:text-gray-700 dark:prose-ul:text-slate-300 prose-ol:text-gray-700 dark:prose-ol:text-slate-300"
              dangerouslySetInnerHTML={{ __html: article.content }}
              style={{
                fontSize: '1.0625rem',
                lineHeight: '1.75',
              }}
            />

            {/* Source Citation */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-slate-700">
              <p className="text-sm text-gray-600 dark:text-slate-400">
                <strong>Source:</strong>{' '}
                <a
                  href="https://www.uscis.gov/citizenship/civics-test"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  USCIS Official Civics Test
                </a>
                <br />
                <strong>Last Updated:</strong> {new Date(article.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>

            {/* CTA */}
            <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Ready to practice?
              </h3>
              <p className="text-gray-600 dark:text-slate-400 mb-4">
                Test your knowledge with our free practice tests and flashcards.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/study"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all"
                >
                  Start Studying
                </Link>
                <Link
                  href="/"
                  className="px-6 py-3 bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-900 dark:text-white rounded-lg font-semibold transition-all border border-gray-200 dark:border-slate-700"
                >
                  Take Practice Test
                </Link>
              </div>
            </div>
          </article>

        </main>
      </div>
    </>
  );
}

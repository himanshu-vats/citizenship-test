import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import TopNav from '@/components/TopNav';

export default function SimpleBlogPage() {
  // Read all HTML files from articles directory
  const articlesDirectory = path.join(process.cwd(), 'articles');
  let posts = [];

  try {
    const files = fs.readdirSync(articlesDirectory);
    posts = files
      .filter(file => file.endsWith('.html'))
      .map(file => {
        const slug = file.replace('.html', '');
        const filePath = path.join(articlesDirectory, file);
        const content = fs.readFileSync(filePath, 'utf8');

        // Extract title from HTML (looks for <title> or first <h1>)
        const titleMatch = content.match(/<title>(.*?)<\/title>/) || content.match(/<h1[^>]*>(.*?)<\/h1>/);
        const title = titleMatch ? titleMatch[1].replace(/<[^>]*>/g, '') : slug;

        // Extract meta description
        const descMatch = content.match(/<meta name="description" content="(.*?)"/);
        const description = descMatch ? descMatch[1] : '';

        // Extract tag/category
        const tagMatch = content.match(/<span class="tag">(.*?)<\/span>/);
        const tag = tagMatch ? tagMatch[1] : 'Guide';

        // Extract read time
        const readTimeMatch = content.match(/(\d+)\s*min read/);
        const readTime = readTimeMatch ? readTimeMatch[1] + ' min read' : '10 min read';

        return {
          slug,
          title,
          description,
          tag,
          readTime,
          file
        };
      });
  } catch (error) {
    console.log('No articles directory found');
  }

  return (
    <>
      <TopNav activeSection="posts" />
      <main className="min-h-screen pt-8 pb-24 px-4 bg-white dark:bg-slate-900">
        <div className="max-w-5xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12 mt-4">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              What Others Are Reading Right Now
            </h1>
            <p className="text-lg text-gray-600 dark:text-slate-400">
              Real answers to questions from people just like you
            </p>
          </div>

          {posts.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-12 text-center border border-gray-200 dark:border-slate-700">
              <p className="text-gray-500 dark:text-gray-400 mb-4">No posts yet.</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Add .html files to the /articles folder
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post, index) => (
                <Link
                  key={post.slug}
                  href={`/blog-simple/${post.slug}`}
                  className="block bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 hover:shadow-lg hover:border-blue-500 dark:hover:border-blue-500 transition-all group"
                >
                  {/* Post Number Badge */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                        #{index + 1}
                      </div>
                      {index === 0 && (
                        <div className="mt-1 text-center">
                          <span className="inline-block px-2 py-0.5 bg-orange-500 text-white text-xs font-bold rounded">
                            HOT
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      {/* Tag and Read Time */}
                      <div className="flex items-center gap-3 mb-2">
                        <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-semibold rounded-full uppercase tracking-wide">
                          {post.tag}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-slate-400">
                          • {post.readTime}
                        </span>
                      </div>

                      {/* Title */}
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {post.title}
                      </h2>

                      {/* Description */}
                      {post.description && (
                        <p className="text-gray-600 dark:text-slate-400 leading-relaxed mb-4">
                          {post.description}
                        </p>
                      )}

                      {/* Read More Link */}
                      <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold text-sm group-hover:gap-2 transition-all">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Read full answer
                        <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Browse All CTA */}
          {posts.length > 0 && (
            <div className="text-center mt-12">
              <p className="text-gray-500 dark:text-slate-400 mb-6">
                💡 Join thousands preparing for their citizenship test
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Start Studying for Free
              </Link>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import AppHeader from '@/components/AppHeader';

export default function SimpleBlogPage() {
  // Read all HTML files from articles directory
  const articlesDirectory = path.join(process.cwd(), 'articles');
  let articles = [];

  try {
    const files = fs.readdirSync(articlesDirectory);
    articles = files
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

        return {
          slug,
          title,
          description,
          file
        };
      });
  } catch (error) {
    console.log('No articles directory found');
  }

  return (
    <>
      <AppHeader title="Blog" showBack={true} />
      <main className="min-h-screen pb-24 pt-20 px-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-950 dark:to-slate-900">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-3 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            Blog Articles
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
            Expert guides for your citizenship journey
          </p>

          {articles.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-12 text-center">
              <p className="text-gray-500 dark:text-gray-400 mb-4">No articles yet.</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Add .html files to the /articles folder
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {articles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/blog-simple/${article.slug}`}
                  className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all hover:scale-[1.02]"
                >
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {article.title}
                  </h2>
                  {article.description && (
                    <p className="text-gray-600 dark:text-gray-300">
                      {article.description}
                    </p>
                  )}
                  <div className="mt-4 text-blue-600 dark:text-blue-400 font-semibold text-sm">
                    Read article →
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

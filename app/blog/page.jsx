import Link from 'next/link'
import { client, queries, urlForImage, isSanityConfigured } from '@/lib/sanity'
import AppHeader from '@/components/AppHeader'

export const revalidate = 60 // Revalidate every 60 seconds

export default async function BlogPage() {
  // Return empty array if Sanity isn't configured yet
  let posts = []
  if (isSanityConfigured()) {
    try {
      posts = await client.fetch(queries.getAllPosts)
    } catch (error) {
      console.error('Failed to fetch blog posts:', error)
    }
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
            Tips, guides, and updates for your citizenship journey
          </p>

          {posts.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-12 text-center">
              <p className="text-gray-500 dark:text-gray-400 mb-4">No blog posts yet.</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Visit <Link href="/studio" className="text-blue-600 dark:text-blue-400 underline">/studio</Link> to create your first post.
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {posts.map((post) => (
                <Link
                  key={post._id}
                  href={`/blog/${post.slug.current}`}
                  className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="md:flex">
                    {post.featuredImage && (
                      <div className="md:w-1/3 h-48 md:h-auto relative bg-gray-200 dark:bg-slate-700">
                        <img
                          src={urlForImage(post.featuredImage).width(400).height(300).url()}
                          alt={post.featuredImage.alt || post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className={`p-6 ${post.featuredImage ? 'md:w-2/3' : 'w-full'}`}>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                          {post.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(post.publishedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">{post.readTime}</span>
                        <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">
                          Read more →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}

import { client, queries, urlForImage, isSanityConfigured } from '@/lib/sanity'
import { PortableText } from '@portabletext/react'
import AppHeader from '@/components/AppHeader'
import LongFormArticle from '@/components/LongFormArticle'
import { notFound } from 'next/navigation'

export const revalidate = 60 // Revalidate every 60 seconds

// Generate static params for all blog posts
export async function generateStaticParams() {
  if (!isSanityConfigured()) {
    return []
  }
  try {
    const posts = await client.fetch(`*[_type == "blogPost"] { "slug": slug.current }`)
    return posts.map((post) => ({
      slug: post.slug,
    }))
  } catch (error) {
    console.error('Failed to fetch blog posts for static params:', error)
    return []
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { slug } = await params

  if (!isSanityConfigured()) {
    return {
      title: 'Blog | CivicsPass',
    }
  }

  try {
    const post = await client.fetch(queries.getPostBySlug, { slug })

    if (!post) {
      return {
        title: 'Post Not Found',
      }
    }

    return {
      title: `${post.title} | CivicsPass Blog`,
      description: post.metaDescription || post.excerpt,
      openGraph: {
        title: post.title,
        description: post.metaDescription || post.excerpt,
        images: post.featuredImage ? [urlForImage(post.featuredImage).width(1200).height(630).url()] : [],
      },
    }
  } catch (error) {
    console.error('Failed to fetch blog post metadata:', error)
    return {
      title: 'Blog | CivicsPass',
    }
  }
}

// Custom components for Portable Text rendering
const components = {
  types: {
    image: ({ value }) => (
      <figure className="my-8">
        <img
          src={urlForImage(value).width(800).url()}
          alt={value.alt || 'Blog image'}
          className="rounded-lg w-full shadow-lg"
        />
        {value.caption && (
          <figcaption className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2 italic">
            {value.caption}
          </figcaption>
        )}
      </figure>
    ),
    callout: ({ value }) => {
      const styles = {
        tip: 'bg-blue-50 dark:bg-blue-900/20 border-blue-400 dark:border-blue-600',
        warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-400 dark:border-yellow-600',
        info: 'bg-purple-50 dark:bg-purple-900/20 border-purple-400 dark:border-purple-600',
        success: 'bg-green-50 dark:bg-green-900/20 border-green-400 dark:border-green-600',
      }
      const icons = {
        tip: '💡',
        warning: '⚠️',
        info: 'ℹ️',
        success: '✅',
      }
      return (
        <div className={`my-6 p-5 rounded-lg border-l-4 ${styles[value.type]}`}>
          {value.title && (
            <div className="font-bold text-lg mb-2 flex items-center gap-2">
              <span>{icons[value.type]}</span>
              <span>{value.title}</span>
            </div>
          )}
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {value.content}
          </p>
        </div>
      )
    },
    youtube: ({ value }) => {
      const getYouTubeId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
        const match = url.match(regExp)
        return (match && match[2].length === 11) ? match[2] : null
      }
      const videoId = getYouTubeId(value.url)
      if (!videoId) return null
      return (
        <div className="my-8 aspect-video">
          <iframe
            className="w-full h-full rounded-lg shadow-lg"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )
    },
  },
  block: {
    h2: ({ children }) => (
      <h2 className="text-3xl font-bold mt-10 mb-5 text-gray-900 dark:text-white border-b-2 border-gray-200 dark:border-slate-700 pb-2">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-xl font-bold mt-6 mb-3 text-gray-900 dark:text-white">
        {children}
      </h4>
    ),
    normal: ({ children }) => (
      <p className="mb-5 text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-blue-600 dark:border-blue-400 pl-6 py-4 my-8 italic text-xl text-gray-700 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/20 rounded-r-lg">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-outside ml-6 mb-5 space-y-2 text-gray-700 dark:text-gray-300 text-lg">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-outside ml-6 mb-5 space-y-2 text-gray-700 dark:text-gray-300 text-lg">
        {children}
      </ol>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-bold text-gray-900 dark:text-white">
        {children}
      </strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    underline: ({ children }) => <u className="underline">{children}</u>,
    'strike-through': ({ children }) => <s className="line-through">{children}</s>,
    code: ({ children }) => (
      <code className="bg-gray-100 dark:bg-slate-700 text-blue-600 dark:text-blue-400 px-2 py-1 rounded text-sm font-mono">
        {children}
      </code>
    ),
    highlight: ({ children }) => (
      <mark className="bg-yellow-200 dark:bg-yellow-600 px-1 rounded">
        {children}
      </mark>
    ),
    link: ({ children, value }) => (
      <a
        href={value.href}
        target={value.blank ? '_blank' : '_self'}
        rel={value.blank ? 'noopener noreferrer' : undefined}
        className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
      >
        {children}
      </a>
    ),
    internalLink: ({ children, value }) => {
      const slug = value?.reference?.slug?.current
      return slug ? (
        <a
          href={`/blog/${slug}`}
          className="text-purple-600 dark:text-purple-400 underline hover:text-purple-800 dark:hover:text-purple-300 font-medium transition-colors"
        >
          {children}
        </a>
      ) : (
        <span>{children}</span>
      )
    },
  },
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params

  if (!isSanityConfigured()) {
    notFound()
  }

  let post = null
  try {
    post = await client.fetch(queries.getPostBySlug, { slug })
  } catch (error) {
    console.error('Failed to fetch blog post:', error)
    notFound()
  }

  if (!post) {
    notFound()
  }

  // Use long-form layout if enabled
  if (post.longForm) {
    return <LongFormArticle post={post} />
  }

  return (
    <>
      <AppHeader title="Blog" showBack={true} />
      <main className="min-h-screen pb-24 pt-20 px-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-950 dark:to-slate-900">
        <article className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 mb-6">
            <div className="flex items-center gap-3 mb-4">
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
              <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">{post.readTime}</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              {post.title}
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
              {post.excerpt}
            </p>

            {post.author && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                By {post.author}
              </p>
            )}
          </div>

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="mb-6 rounded-2xl overflow-hidden shadow-lg">
              <img
                src={urlForImage(post.featuredImage).width(1200).height(630).url()}
                alt={post.featuredImage.alt || post.title}
                className="w-full h-auto"
              />
            </div>
          )}

          {/* Content */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 prose prose-lg dark:prose-invert max-w-none">
            <PortableText
              value={post.body}
              components={components}
            />
          </div>
        </article>
      </main>
    </>
  )
}

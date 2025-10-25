import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

// Check if Sanity is configured
export const isSanityConfigured = () => {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  return projectId && projectId !== 'your-project-id'
}

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01', // Use today's date
  useCdn: true, // Set to false if using draft mode
})

// Helper to generate image URLs
const builder = imageUrlBuilder(client)

export function urlForImage(source) {
  return builder.image(source)
}

// Common queries
export const queries = {
  // Get all published blog posts
  getAllPosts: `*[_type == "blogPost"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    category,
    publishedAt,
    readTime,
    featuredImage,
    author,
    featured
  }`,

  // Get a single post by slug
  getPostBySlug: `*[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    category,
    publishedAt,
    readTime,
    metaDescription,
    featuredImage,
    body,
    author,
    featured,
    longForm
  }`,

  // Get featured posts
  getFeaturedPosts: `*[_type == "blogPost" && featured == true] | order(publishedAt desc) [0...3] {
    _id,
    title,
    slug,
    excerpt,
    category,
    publishedAt,
    readTime,
    featuredImage,
    author
  }`,

  // Get posts by category
  getPostsByCategory: `*[_type == "blogPost" && category == $category] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    category,
    publishedAt,
    readTime,
    featuredImage,
    author
  }`,
}

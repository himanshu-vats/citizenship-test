import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const blogDirectory = path.join(process.cwd(), 'content/blog');

/**
 * Get all blog posts sorted by date
 */
export function getAllPosts() {
  // Create directory if it doesn't exist
  if (!fs.existsSync(blogDirectory)) {
    fs.mkdirSync(blogDirectory, { recursive: true });
    return [];
  }

  const fileNames = fs.readdirSync(blogDirectory);
  const allPosts = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(blogDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);

      return {
        slug,
        title: data.title || 'Untitled',
        excerpt: data.excerpt || '',
        category: data.category || 'Uncategorized',
        date: data.date || new Date().toISOString(),
        readTime: data.readTime || '5 min read',
        featuredImage: data.featuredImage || null,
      };
    });

  // Sort by date (newest first)
  return allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
}

/**
 * Get a single blog post by slug
 */
export async function getPostBySlug(slug) {
  const fullPath = path.join(blogDirectory, `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  // Convert markdown to HTML
  const processedContent = await remark()
    .use(html, { sanitize: false })
    .process(content);
  const contentHtml = processedContent.toString();

  return {
    slug,
    title: data.title || 'Untitled',
    excerpt: data.excerpt || '',
    category: data.category || 'Uncategorized',
    date: data.date || new Date().toISOString(),
    readTime: data.readTime || '5 min read',
    metaDescription: data.metaDescription || data.excerpt || '',
    featuredImage: data.featuredImage || null,
    content: contentHtml,
  };
}

/**
 * Get all unique categories
 */
export function getAllCategories() {
  const posts = getAllPosts();
  const categories = [...new Set(posts.map(post => post.category))];
  return categories;
}

import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  const articlesDirectory = path.join(process.cwd(), 'articles');

  try {
    const files = fs.readdirSync(articlesDirectory);
    const articles = files
      .filter(file => file.endsWith('.html'))
      .map(file => {
        const slug = file.replace('.html', '');
        const filePath = path.join(articlesDirectory, file);
        const content = fs.readFileSync(filePath, 'utf8');

        // Extract title from HTML
        const titleMatch = content.match(/<title>(.*?)<\/title>/) || content.match(/<h1[^>]*>(.*?)<\/h1>/);
        const title = titleMatch ? titleMatch[1].replace(/<[^>]*>/g, '') : slug;

        // Extract meta description
        const descMatch = content.match(/<meta name="description" content="(.*?)"/);
        const description = descMatch ? descMatch[1] : '';

        // Extract category from meta tag (we'll add this pattern to our HTML template)
        const categoryMatch = content.match(/<meta name="category" content="(.*?)"/);
        const category = categoryMatch ? categoryMatch[1] : 'process-guide'; // default

        // Extract read time from meta section
        const readTimeMatch = content.match(/⏱️\s*(\d+\s*min\s*read)/);
        const readTime = readTimeMatch ? readTimeMatch[1] : '10 min read';

        return {
          slug,
          title,
          description,
          category,
          readTime,
          file
        };
      });

    return NextResponse.json(articles);
  } catch (error) {
    console.error('Error reading articles:', error);
    return NextResponse.json([]);
  }
}

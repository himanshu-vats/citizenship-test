import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const articlesDirectory = path.join(process.cwd(), 'articles');

  try {
    const files = fs.readdirSync(articlesDirectory);
    return files
      .filter(file => file.endsWith('.html'))
      .map(file => ({
        slug: file.replace('.html', '')
      }));
  } catch (error) {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const articlesDirectory = path.join(process.cwd(), 'articles');
  const filePath = path.join(articlesDirectory, `${slug}.html`);

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const titleMatch = content.match(/<title>(.*?)<\/title>/);
    const descMatch = content.match(/<meta name="description" content="(.*?)"/);

    return {
      title: titleMatch ? titleMatch[1] : slug,
      description: descMatch ? descMatch[1] : '',
    };
  } catch (error) {
    return {
      title: 'Article Not Found',
    };
  }
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const articlesDirectory = path.join(process.cwd(), 'articles');
  const filePath = path.join(articlesDirectory, `${slug}.html`);

  let htmlContent = '';
  try {
    htmlContent = fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    notFound();
  }

  // Inject our app's styles and make it work within our layout
  const styledContent = `
    <style>
      .article-container {
        max-width: 1400px;
        margin: 0 auto;
        background: white;
        min-height: 100vh;
      }

      /* Dark mode support */
      @media (prefers-color-scheme: dark) {
        .article-container {
          background: #0f172a;
          color: #e2e8f0;
        }
        .sidebar {
          background: linear-gradient(180deg, #1e3a8a 0%, #1e293b 100%) !important;
        }
      }

      /* Ensure the article uses full viewport */
      body {
        margin: 0;
        padding: 0;
      }
    </style>
    ${htmlContent}
  `;

  return (
    <div
      className="min-h-screen"
      dangerouslySetInnerHTML={{ __html: styledContent }}
    />
  );
}

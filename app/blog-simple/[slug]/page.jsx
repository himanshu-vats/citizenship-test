import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import ArticleWrapper from '@/components/ArticleWrapper';

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

  // Extract styles from <head> and content from <body>
  const styleMatch = htmlContent.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
  const styles = styleMatch ? styleMatch[0] : '';

  const scriptMatch = htmlContent.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
  const script = scriptMatch ? scriptMatch[0] : '';

  const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  const bodyContent = bodyMatch ? bodyMatch[1] : htmlContent;

  // Combine styles, body content, and scripts
  const fullContent = `${styles}\n${bodyContent}\n${script}`;

  return <ArticleWrapper htmlContent={fullContent} slug={slug} />;
}

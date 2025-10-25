import TopNav from '@/components/TopNav';
import BlogPost from '@/components/BlogPost';
import { notFound } from 'next/navigation';

// Import blog post components
import N400FilingMistakesContent, {
  metadata as n400MistakesMetadata,
  tableOfContents as n400MistakesTOC,
  relatedPosts as n400MistakesRelated
} from '../posts/n400-filing-mistakes';

import CompleteN400ProcessContent, {
  metadata as n400ProcessMetadata,
  tableOfContents as n400ProcessTOC,
  relatedPosts as n400ProcessRelated
} from '../posts/complete-n400-process';

// Map of all blog posts
const blogPosts = {
  'n400-filing-mistakes': {
    metadata: n400MistakesMetadata,
    Content: N400FilingMistakesContent,
    tableOfContents: n400MistakesTOC,
    relatedPosts: n400MistakesRelated
  },
  'complete-n400-process': {
    metadata: n400ProcessMetadata,
    Content: CompleteN400ProcessContent,
    tableOfContents: n400ProcessTOC,
    relatedPosts: n400ProcessRelated
  }
};

export async function generateStaticParams() {
  return Object.keys(blogPosts).map(slug => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = blogPosts[slug];

  if (!post) {
    return { title: 'Post Not Found' };
  }

  return {
    title: post.metadata.title,
    description: post.metadata.description,
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = blogPosts[slug];

  if (!post) {
    notFound();
  }

  const { Content, metadata, tableOfContents, relatedPosts } = post;

  return (
    <>
      <TopNav activeSection="posts" />
      <main className="min-h-screen bg-white dark:bg-slate-900">
        <BlogPost
          title={metadata.title}
          description={metadata.description}
          date={metadata.date}
          readTime={metadata.readTime}
          category={metadata.category}
          content={<Content />}
          tableOfContents={tableOfContents}
          relatedPosts={relatedPosts}
        />
      </main>
    </>
  );
}

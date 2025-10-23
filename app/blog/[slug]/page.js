'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import TopNav from '@/components/TopNav';

// This will be replaced with actual article data from your automated system
const getArticle = (slug) => {
  const articles = {
    'supreme-law-of-the-land': {
      title: 'What is the Supreme Law of the Land? Understanding the Constitution',
      category: 'Question Deep Dive',
      date: '2025-01-15',
      readTime: '5 min read',
      content: `
        <h2>Short Answer</h2>
        <p><strong>The Constitution</strong></p>

        <h2>Detailed Explanation</h2>
        <p>The United States Constitution is the supreme law of the land. This means it is the highest form of law in the United States, and all other laws must comply with it.</p>

        <p>Adopted in 1787 and ratified in 1788, the Constitution establishes:</p>
        <ul>
          <li>The structure of the federal government</li>
          <li>The powers and duties of government institutions</li>
          <li>The fundamental rights and freedoms of citizens</li>
        </ul>

        <h2>Why This Matters for Your Test</h2>
        <p>This is one of the most frequently asked questions on the USCIS citizenship test. Understanding the Constitution demonstrates knowledge of American government and values.</p>

        <h2>Related Questions</h2>
        <ul>
          <li>What does the Constitution do?</li>
          <li>The idea of self-government is in the first three words of the Constitution. What are these words?</li>
          <li>What is an amendment?</li>
        </ul>

        <h2>Study Tips</h2>
        <p>Remember: The Constitution is called the "supreme law" because it overrides all other laws, including state laws and federal statutes.</p>
      `,
      metaDescription: 'Learn about the US Constitution as the supreme law of the land - essential knowledge for your USCIS citizenship test.',
    },
    'n400-application-guide-2025': {
      title: 'N-400 Application Guide 2025: Complete Step-by-Step Process',
      category: 'Process Guide',
      date: '2025-01-14',
      readTime: '8 min read',
      content: `
        <h2>What is Form N-400?</h2>
        <p>Form N-400, Application for Naturalization, is the official form used to apply for US citizenship.</p>

        <h2>Eligibility Requirements</h2>
        <ul>
          <li>Be at least 18 years old</li>
          <li>Be a lawful permanent resident (green card holder) for at least 5 years (or 3 years if married to a US citizen)</li>
          <li>Demonstrate continuous residence and physical presence in the US</li>
          <li>Be able to read, write, and speak basic English</li>
          <li>Have knowledge of US history and government</li>
          <li>Be a person of good moral character</li>
        </ul>

        <h2>Step-by-Step Filing Process</h2>
        <ol>
          <li><strong>Gather Required Documents</strong> - Green card, passport, tax returns, etc.</li>
          <li><strong>Complete Form N-400</strong> - Can be done online or by mail</li>
          <li><strong>Pay Filing Fee</strong> - Currently $640 application fee + $85 biometrics fee</li>
          <li><strong>Submit Application</strong> - Online via USCIS website or by mail</li>
          <li><strong>Attend Biometrics Appointment</strong> - Fingerprinting and photo</li>
          <li><strong>Complete Interview</strong> - Civics test and English test</li>
          <li><strong>Receive Decision</strong> - Approval, denial, or continuation</li>
          <li><strong>Take Oath of Allegiance</strong> - Final step to become a citizen</li>
        </ol>

        <h2>Processing Times</h2>
        <p>Current processing times vary by location but typically range from 8-12 months. Check the USCIS website for specific processing times in your area.</p>
      `,
      metaDescription: 'Complete guide to filing Form N-400 for US citizenship in 2025. Step-by-step instructions, requirements, and processing times.',
    },
    'citizenship-interview-tips': {
      title: 'USCIS Interview Tips: What to Expect at Your Citizenship Interview',
      category: 'Process Guide',
      date: '2025-01-13',
      readTime: '6 min read',
      content: `
        <h2>Overview</h2>
        <p>The citizenship interview is a crucial step in your naturalization journey. Here&apos;s what to expect and how to prepare.</p>

        <h2>What Happens During the Interview?</h2>
        <ol>
          <li><strong>Check-in</strong> - Arrive 15 minutes early with required documents</li>
          <li><strong>Oath</strong> - You&apos;ll be sworn in to tell the truth</li>
          <li><strong>Application Review</strong> - Officer reviews your N-400 and asks questions</li>
          <li><strong>English Test</strong> - Reading, writing, and speaking assessment</li>
          <li><strong>Civics Test</strong> - Up to 10 questions from the 100-question list</li>
          <li><strong>Decision</strong> - In many cases, you&apos;ll receive a decision same day</li>
        </ol>

        <h2>Common Interview Questions</h2>
        <ul>
          <li>Why do you want to become a US citizen?</li>
          <li>Have you ever left the United States since becoming a permanent resident?</li>
          <li>Do you support the Constitution?</li>
          <li>Are you willing to take the full Oath of Allegiance?</li>
        </ul>

        <h2>Tips for Success</h2>
        <ul>
          <li>Bring ALL required original documents</li>
          <li>Dress professionally</li>
          <li>Be honest - don&apos;t guess if you don&apos;t know an answer</li>
          <li>Practice your civics questions using CivicsPass</li>
          <li>If you don&apos;t understand a question, ask the officer to repeat it</li>
        </ul>

        <h2>What to Bring</h2>
        <ul>
          <li>Interview appointment notice</li>
          <li>Green card</li>
          <li>State ID or driver&apos;s license</li>
          <li>Passport</li>
          <li>Any documents related to your application (marriage certificate, divorce decree, etc.)</li>
        </ul>
      `,
      metaDescription: 'Essential tips for your USCIS citizenship interview. Learn what to expect, what to bring, and how to prepare for success.',
    },
  };

  return articles[slug] || null;
};

export default function BlogArticle() {
  const params = useParams();
  const article = getArticle(params.slug);

  if (!article) {
    return (
      <>
        <TopNav />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Article Not Found</h1>
            <Link href="/blog" className="text-blue-600 dark:text-blue-400 hover:underline">
              ← Back to Blog
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <TopNav />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
        <main className="px-4 py-8 max-w-4xl mx-auto">

          {/* Back Link */}
          <Link
            href="/blog"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-6"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>

          {/* Article Header */}
          <article className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 sm:p-10 border border-gray-200 dark:border-slate-700">
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold mb-4">
                {article.category}
              </span>

              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {article.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-slate-400">
                <time dateTime={article.date}>
                  {new Date(article.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </time>
                <span>•</span>
                <span>{article.readTime}</span>
              </div>
            </div>

            {/* Article Content */}
            <div
              className="prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: article.content }}
              style={{
                fontSize: '1.0625rem',
                lineHeight: '1.75',
              }}
            />

            {/* Source Citation */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-slate-700">
              <p className="text-sm text-gray-600 dark:text-slate-400">
                <strong>Source:</strong>{' '}
                <a
                  href="https://www.uscis.gov/citizenship/civics-test"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  USCIS Official Civics Test
                </a>
                <br />
                <strong>Last Updated:</strong> {article.date}
              </p>
            </div>

            {/* CTA */}
            <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Ready to practice?
              </h3>
              <p className="text-gray-600 dark:text-slate-400 mb-4">
                Test your knowledge with our free practice tests and flashcards.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/study"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all"
                >
                  Start Studying
                </Link>
                <Link
                  href="/"
                  className="px-6 py-3 bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-900 dark:text-white rounded-lg font-semibold transition-all border border-gray-200 dark:border-slate-700"
                >
                  Take Practice Test
                </Link>
              </div>
            </div>
          </article>

        </main>
      </div>
    </>
  );
}

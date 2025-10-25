'use client';

import { useEffect, useState, useRef } from 'react';
import { PortableText } from '@portabletext/react';
import { urlForImage } from '@/lib/sanity';
import Link from 'next/link';

export default function LongFormArticle({ post }) {
  const [activeSection, setActiveSection] = useState('');
  const [progress, setProgress] = useState(0);
  const [tocItems, setTocItems] = useState([]);
  const contentRef = useRef(null);

  // Extract table of contents from body
  useEffect(() => {
    if (!post.body) return;

    const toc = [];
    post.body.forEach((block, index) => {
      if (block._type === 'block') {
        if (block.style === 'h2') {
          const text = block.children?.map(child => child.text).join('') || '';
          const id = `section-${index}`;
          toc.push({
            id,
            text,
            level: 2,
            children: []
          });
        } else if (block.style === 'h3' && toc.length > 0) {
          const text = block.children?.map(child => child.text).join('') || '';
          const id = `section-${index}`;
          toc[toc.length - 1].children.push({
            id,
            text,
            level: 3
          });
        }
      }
    });

    setTocItems(toc);
  }, [post.body]);

  // Update progress bar on scroll
  useEffect(() => {
    const updateProgress = () => {
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setProgress(scrolled);
    };

    window.addEventListener('scroll', updateProgress);
    updateProgress();

    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;

      const headings = contentRef.current.querySelectorAll('h2[id], h3[id]');
      let current = '';

      headings.forEach(heading => {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= 150) {
          current = heading.id;
        }
      });

      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [tocItems]);

  // Components for rendering Portable Text
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
    },
    block: {
      h2: ({ children, value }) => {
        const id = `section-${post.body.indexOf(value)}`;
        return (
          <h2 id={id} className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white border-b-4 border-blue-600 dark:border-blue-400 pb-3">
            {children}
          </h2>
        );
      },
      h3: ({ children, value }) => {
        const id = `section-${post.body.indexOf(value)}`;
        return (
          <h3 id={id} className="text-2xl font-bold mt-8 mb-4 text-blue-900 dark:text-blue-300">
            {children}
          </h3>
        );
      },
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
      code: ({ children }) => (
        <code className="bg-gray-100 dark:bg-slate-700 text-blue-600 dark:text-blue-400 px-2 py-1 rounded text-sm font-mono">
          {children}
        </code>
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
    },
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-blue-600 dark:bg-blue-400 z-50 transition-all duration-150"
        style={{ width: `${progress}%` }}
      />

      <div className="flex max-w-[1400px] mx-auto bg-white dark:bg-slate-900">
        {/* Sidebar Table of Contents */}
        <aside className="hidden lg:block w-80 bg-gradient-to-b from-blue-900 to-blue-950 dark:from-slate-900 dark:to-slate-950 text-white p-8 sticky top-0 h-screen overflow-y-auto">
          <h2 className="text-xl font-bold mb-6 pb-3 border-b-2 border-blue-500">
            📋 Table of Contents
          </h2>

          <nav>
            <ul className="space-y-2">
              {tocItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => scrollToSection(item.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                      activeSection === item.id
                        ? 'bg-blue-600 text-white font-semibold shadow-lg transform scale-105'
                        : 'text-blue-200 hover:bg-blue-800 hover:text-white hover:translate-x-1'
                    }`}
                  >
                    {item.text}
                  </button>

                  {item.children.length > 0 && (
                    <ul className="ml-4 mt-2 space-y-1">
                      {item.children.map((child) => (
                        <li key={child.id}>
                          <button
                            onClick={() => scrollToSection(child.id)}
                            className={`w-full text-left px-3 py-2 text-sm rounded-md transition-all duration-200 ${
                              activeSection === child.id
                                ? 'bg-blue-700 text-white font-medium'
                                : 'text-blue-300 hover:bg-blue-800 hover:text-white hover:translate-x-1'
                            }`}
                          >
                            {child.text}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* CTA in Sidebar */}
          <div className="mt-8 p-4 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl">
            <h3 className="font-bold text-lg mb-2">🎯 Practice Now</h3>
            <p className="text-sm text-blue-100 mb-3">Test your knowledge</p>
            <div className="space-y-2">
              <Link href="/" className="block w-full py-2 px-4 bg-white text-blue-900 font-semibold rounded-lg text-center text-sm hover:shadow-lg transition-all">
                Take Test
              </Link>
              <Link href="/study" className="block w-full py-2 px-4 bg-white text-blue-900 font-semibold rounded-lg text-center text-sm hover:shadow-lg transition-all">
                Study Cards
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-6 lg:px-12 py-12 max-w-4xl" ref={contentRef}>
          {/* Article Header */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
              <span className="flex items-center gap-1">
                📅 {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
              <span className="flex items-center gap-1">⏱️ {post.readTime}</span>
              <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full font-semibold">
                {post.category.replace('-', ' ').toUpperCase()}
              </span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              {post.title}
            </h1>

            {post.excerpt && (
              <div className="text-xl text-gray-700 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 dark:border-blue-400 p-6 rounded-r-lg mb-8">
                {post.excerpt}
              </div>
            )}

            {post.featuredImage && (
              <div className="mb-8 rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={urlForImage(post.featuredImage).width(1200).height(600).url()}
                  alt={post.featuredImage.alt || post.title}
                  className="w-full h-auto"
                />
              </div>
            )}
          </div>

          {/* Article Body */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <PortableText
              value={post.body}
              components={components}
            />
          </div>

          {/* Related Actions */}
          <div className="mt-16 p-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl text-white text-center">
            <h3 className="text-2xl font-bold mb-3">🎉 Ready to Start Your Journey?</h3>
            <p className="text-blue-100 mb-6 text-lg">Put your knowledge to the test</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/" className="px-6 py-3 bg-white text-blue-900 font-bold rounded-lg hover:shadow-2xl hover:scale-105 transition-all">
                Take Practice Test
              </Link>
              <Link href="/study" className="px-6 py-3 bg-white text-blue-900 font-bold rounded-lg hover:shadow-2xl hover:scale-105 transition-all">
                Study Flashcards
              </Link>
              <Link href="/stats" className="px-6 py-3 bg-white text-blue-900 font-bold rounded-lg hover:shadow-2xl hover:scale-105 transition-all">
                Track Progress
              </Link>
            </div>
          </div>

          {/* Author & Date */}
          {post.author && (
            <div className="mt-8 pt-8 border-t-2 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400 text-sm">
              <p>Written by <strong>{post.author}</strong></p>
            </div>
          )}

          {/* Disclaimer */}
          <div className="mt-8 p-6 bg-gray-100 dark:bg-slate-800 rounded-xl text-sm text-gray-600 dark:text-gray-400 italic border-l-4 border-gray-400 dark:border-slate-600">
            <strong>Disclaimer:</strong> This article provides general information about the U.S. citizenship process. Immigration laws and USCIS policies can change. For legal advice specific to your situation, consult a qualified immigration attorney.
          </div>
        </main>
      </div>
    </>
  );
}

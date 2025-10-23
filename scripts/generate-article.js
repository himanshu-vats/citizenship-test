#!/usr/bin/env node

/**
 * Blog Article Generator
 *
 * Generates blog articles using OpenAI API
 *
 * Usage:
 *   node scripts/generate-article.js "Your article topic here"
 *
 * Setup:
 *   1. npm install openai
 *   2. Set environment variable: export OPENAI_API_KEY="your-key"
 *   3. Run: node scripts/generate-article.js "topic"
 */

const fs = require('fs');
const path = require('path');

// Check for OpenAI API key
if (!process.env.OPENAI_API_KEY) {
  console.error('❌ Error: OPENAI_API_KEY environment variable not set');
  console.error('\nSetup instructions:');
  console.error('1. Get API key from: https://platform.openai.com/api-keys');
  console.error('2. Set environment variable:');
  console.error('   export OPENAI_API_KEY="your-api-key-here"');
  console.error('\nOr add to .env.local file');
  process.exit(1);
}

// Get topic from command line
const topic = process.argv[2];
if (!topic) {
  console.error('❌ Error: Please provide a topic');
  console.error('\nUsage:');
  console.error('  node scripts/generate-article.js "Your article topic"');
  console.error('\nExample:');
  console.error('  node scripts/generate-article.js "How to prepare for citizenship interview"');
  process.exit(1);
}

console.log('🤖 Generating article about:', topic);
console.log('⏳ Please wait...\n');

// System prompt for the AI
const systemPrompt = `You are a blog writer for CivicsPass, a US citizenship test prep website.

WRITING GUIDELINES:
- Tone: Helpful, authoritative, encouraging
- Target audience: N-400 applicants preparing for citizenship
- Use simple language, short sentences, bullet points
- Include practical actionable advice
- Link to app features: /study, /, /stats, /settings
- SEO keywords: "citizenship test", "N-400", "USCIS"

REQUIRED FORMAT:
---
title: "Article Title (60 chars max)"
excerpt: "One sentence description (150 chars max)"
category: "Process Guide"
date: "${new Date().toISOString()}"
readTime: "X min read"
metaDescription: "SEO description (150-160 chars)"
---

## Introduction

[Content here]

## Main Sections

[Content with H2/H3, bullets, numbered lists]

---

***Disclaimer:** This article provides general information. For specific legal advice, consult with a qualified immigration attorney.*

Generate a complete, well-researched article about the given topic.`;

// Generate article using OpenAI API
async function generateArticle(topic) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Cheaper model, good quality
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Write a blog article about: ${topic}` }
        ],
        temperature: 0.7,
        max_tokens: 2500
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;

  } catch (error) {
    console.error('❌ Error generating article:', error.message);
    process.exit(1);
  }
}

// Create filename from topic
function createFilename(topic) {
  return topic
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-')         // Replace spaces with dashes
    .substring(0, 60)             // Limit length
    + '.md';
}

// Save article to file
function saveArticle(content, filename) {
  const blogDir = path.join(process.cwd(), 'content', 'blog');

  // Create directory if it doesn't exist
  if (!fs.existsSync(blogDir)) {
    fs.mkdirSync(blogDir, { recursive: true });
  }

  const filepath = path.join(blogDir, filename);
  fs.writeFileSync(filepath, content, 'utf8');

  return filepath;
}

// Main execution
(async () => {
  try {
    // Generate article
    const article = await generateArticle(topic);

    // Create filename
    const filename = createFilename(topic);

    // Save to file
    const filepath = saveArticle(article, filename);

    console.log('✅ Article generated successfully!');
    console.log('📝 File:', filepath);
    console.log('\n📋 Preview:');
    console.log('─'.repeat(60));
    console.log(article.substring(0, 500) + '...');
    console.log('─'.repeat(60));
    console.log('\n📤 Next steps:');
    console.log('1. Review the article in:', filename);
    console.log('2. Make any edits if needed');
    console.log('3. Commit to GitHub:');
    console.log(`   git add content/blog/${filename}`);
    console.log(`   git commit -m "Add article: ${topic}"`);
    console.log('   git push');
    console.log('4. Vercel will auto-deploy in 2-3 minutes');
    console.log('\n🎉 Done!');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
})();

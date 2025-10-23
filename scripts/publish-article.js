#!/usr/bin/env node

/**
 * Quick Publish Script
 *
 * Paste AI-generated article and it auto-commits to GitHub
 *
 * Usage:
 *   node scripts/publish-article.js
 *
 * Then paste your article when prompted (Ctrl+D when done)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('📝 Quick Blog Publisher');
console.log('━'.repeat(60));
console.log('Paste your AI-generated article below.');
console.log('Press Ctrl+D (Mac/Linux) or Ctrl+Z (Windows) when done.');
console.log('━'.repeat(60));
console.log('');

// Read from stdin
let content = '';
process.stdin.setEncoding('utf8');

process.stdin.on('data', chunk => {
  content += chunk;
});

process.stdin.on('end', () => {
  if (!content.trim()) {
    console.error('❌ No content provided');
    process.exit(1);
  }

  try {
    // Extract title from frontmatter to create filename
    const titleMatch = content.match(/title:\s*["'](.+?)["']/);
    if (!titleMatch) {
      console.error('❌ No title found in frontmatter');
      console.error('Make sure your article has: title: "Article Title"');
      process.exit(1);
    }

    const title = titleMatch[1];
    const filename = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 60)
      + '.md';

    // Save to content/blog/
    const blogDir = path.join(process.cwd(), 'content', 'blog');
    if (!fs.existsSync(blogDir)) {
      fs.mkdirSync(blogDir, { recursive: true });
    }

    const filepath = path.join(blogDir, filename);
    fs.writeFileSync(filepath, content, 'utf8');

    console.log('');
    console.log('✅ Article saved:', filename);
    console.log('');

    // Auto-commit to git
    console.log('📤 Committing to GitHub...');
    try {
      execSync(`git add "${filepath}"`, { stdio: 'inherit' });
      execSync(`git commit -m "Add article: ${title}"`, { stdio: 'inherit' });
      execSync('git push', { stdio: 'inherit' });

      console.log('');
      console.log('🎉 Success! Article published!');
      console.log('');
      console.log('Next steps:');
      console.log('1. Vercel is rebuilding your site (2-3 minutes)');
      console.log('2. Article will be live at: /blog/' + filename.replace('.md', ''));
      console.log('');
    } catch (gitError) {
      console.log('');
      console.log('⚠️  Git commit failed. Manual steps:');
      console.log(`   git add content/blog/${filename}`);
      console.log(`   git commit -m "Add article: ${title}"`);
      console.log('   git push');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
});

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log('\n\n❌ Cancelled');
  process.exit(0);
});

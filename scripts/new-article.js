const fs = require('fs');
const path = require('path');

const CONTENT_DIR = path.resolve(__dirname, '..', 'src', 'content', 'articles');

// Generate slug from title
function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Get today's date in YYYY-MM-DD format
function getToday() {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

// Main
function createArticle() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: npm run new-article "My Article Title"');
    console.log('\nThis will create a new Markdown file with frontmatter template.');
    process.exit(1);
  }
  
  const title = args.join(' ');
  const slug = slugify(title);
  const today = getToday();
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
  
  // Check if file already exists
  if (fs.existsSync(filePath)) {
    console.error(`Error: Article already exists at ${filePath}`);
    process.exit(1);
  }
  
  const template = `---
slug: "${slug}"
title: "Nick Liffen's Blog | ${title} | Blog Post"
headline: "${title}"
description: "Nick Liffen's Blog | ${title} | Blog Post"
date: "${today}"
modified: "${today}"
keywords:
  - Nick
  - Liffen
  - Blog
image: "https://nickliffen.dev/img/tech.jpg"
sections:
  - Introduction
  - Conclusion
articleBody: "Add a brief excerpt here that summarizes the article..."
hasYouTube: false
draft: true
---

        <h2 id="introduction" class="mb">Introduction:</h2>

        <p>Start writing your article here...</p>

        <h2 id="conclusion" class="mb">Conclusion:</h2>

        <p>Wrap up your article here...</p>
`;
  
  // Ensure directory exists
  if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
  }
  
  fs.writeFileSync(filePath, template);
  
  console.log(`\n✓ Created new article: ${filePath}`);
  console.log('\nNext steps:');
  console.log('1. Edit the frontmatter (title, description, keywords, image, sections)');
  console.log('2. Write your article content as HTML below the frontmatter');
  console.log('3. Set draft: false when ready to publish');
  console.log('4. Run npm run build:dev to preview with drafts');
  console.log('5. Run npm run build to build for production');
}

createArticle();

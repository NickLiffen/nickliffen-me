/**
 * Create a new article with frontmatter template
 * Usage: npx tsx scripts/new-article.ts "My Article Title"
 */

import fs from 'fs';
import path from 'path';
import { CONTENT_DIR } from './lib/config';
import { getToday } from './lib/dates';

/** Convert title to URL-safe slug */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Generate article frontmatter template */
export function generateTemplate(slug: string, title: string, today: string): string {
  return `---
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

## Introduction

Start writing your article here...

## Conclusion

Wrap up your article here...
`;
}

/** Create a new article file */
export function createArticleFile(title: string): string {
  const slug = slugify(title);
  const today = getToday();
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
  
  if (fs.existsSync(filePath)) {
    throw new Error(`Article already exists at ${filePath}`);
  }
  
  if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
  }
  
  const template = generateTemplate(slug, title, today);
  fs.writeFileSync(filePath, template);
  
  return filePath;
}

/** CLI entry point */
export function main(): void {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: npm run new-article "My Article Title"');
    console.log('\nThis will create a new Markdown file with frontmatter template.');
    process.exit(1);
  }
  
  const title = args.join(' ');
  
  try {
    const filePath = createArticleFile(title);
    console.log(`\n✓ Created new article: ${filePath}`);
    console.log('\nNext steps:');
    console.log('1. Edit the frontmatter (title, description, keywords, image, sections)');
    console.log('2. Write your article content in Markdown');
    console.log('3. Set draft: false when ready to publish');
    console.log('4. Run npm run build:dev to preview with drafts');
    console.log('5. Run npm run build to build for production');
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
}

// Run if executed directly (not imported as a module)
const isDirectExecution = process.argv[1]?.includes('new-article');
const isTestEnvironment = process.env.NODE_ENV === 'test' || process.env.VITEST;

if (isDirectExecution && !isTestEnvironment) {
  main();
}

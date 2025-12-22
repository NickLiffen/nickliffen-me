/**
 * Article loading and processing
 */

import fs from 'fs';
import { glob } from 'glob';
import matter from 'gray-matter';
import { marked } from 'marked';
import { CONTENT_DIR, SITE_URL, isDev } from './config';
import { formatDate } from './dates';
import type { Article, ArticleFrontmatter } from './types';

// Configure marked for safe HTML output
marked.setOptions({
  gfm: true,
  breaks: false
});

/** Load and process all article markdown files */
export async function getArticles(): Promise<Article[]> {
  const files = await glob(`${CONTENT_DIR}/*.md`);
  
  const articles = files.map((file): Article => {
    const raw = fs.readFileSync(file, 'utf-8');
    const { data, content: body } = matter(raw);
    const frontmatter = data as ArticleFrontmatter;
    
    return {
      ...frontmatter,
      content: marked(body.trim()) as string,
      formattedDate: formatDate(frontmatter.date),
      canonicalUrl: `${SITE_URL}/articles/${frontmatter.slug}.html`,
      datePublished: frontmatter.date,
      dateModified: frontmatter.modified || frontmatter.date,
      tocLink: `./articles/${frontmatter.slug}.html`
    };
  });
  
  // Filter drafts in production, sort by date descending
  return articles
    .filter(a => isDev || !a.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

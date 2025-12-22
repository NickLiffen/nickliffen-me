/**
 * HTML page generators: articles, index, pagination, 404
 */

import fs from 'fs';
import path from 'path';
import { mkdirp } from 'mkdirp';
import { DIST_DIR, ARTICLES_PER_INDEX, ARTICLES_PER_PAGE } from '../config';
import { renderTemplate } from '../templates';
import type { Article } from '../types';

/** Generate individual article pages */
export async function generateArticles(articles: Article[]): Promise<void> {
  await mkdirp(path.join(DIST_DIR, 'articles'));
  
  for (const article of articles) {
    const html = renderTemplate('article.ejs', article);
    const outputPath = path.join(DIST_DIR, 'articles', `${article.slug}.html`);
    fs.writeFileSync(outputPath, html);
    console.log(`Generated: articles/${article.slug}.html`);
  }
}

/** Generate the homepage */
export async function generateIndex(articles: Article[]): Promise<void> {
  const displayArticles = articles.slice(0, ARTICLES_PER_INDEX);
  const allArticles = articles.map(a => ({
    ...a,
    tocLink: `./articles/${a.slug}.html`
  }));
  
  const html = renderTemplate('index.ejs', { displayArticles, allArticles });
  fs.writeFileSync(path.join(DIST_DIR, 'index.html'), html);
  console.log('Generated: index.html');
}

/** Generate pagination pages */
export async function generatePagination(articles: Article[]): Promise<void> {
  await mkdirp(path.join(DIST_DIR, 'articles', 'page'));
  
  const paginatedArticles = articles.slice(ARTICLES_PER_INDEX);
  const totalPages = Math.ceil(paginatedArticles.length / ARTICLES_PER_PAGE);
  
  // TOC links for pagination pages use relative paths
  const allArticles = articles.map(a => ({
    ...a,
    tocLink: `../${a.slug}.html`
  }));
  
  for (let page = 0; page < totalPages; page++) {
    const pageNumber = page + 2;
    const start = page * ARTICLES_PER_PAGE;
    const displayArticles = paginatedArticles.slice(start, start + ARTICLES_PER_PAGE);
    const hasNextPage = page < totalPages - 1;
    const hasYouTube = displayArticles.some(a => a.hasYouTube);
    
    const html = renderTemplate('pagination.ejs', {
      pageNumber,
      displayArticles,
      allArticles,
      hasNextPage,
      hasYouTube
    });
    
    const outputPath = path.join(DIST_DIR, 'articles', 'page', `${pageNumber}.html`);
    fs.writeFileSync(outputPath, html);
    console.log(`Generated: articles/page/${pageNumber}.html`);
  }
}

/** Generate 404 error page */
export async function generate404(): Promise<void> {
  const html = renderTemplate('404.ejs', {});
  fs.writeFileSync(path.join(DIST_DIR, '404.html'), html);
  console.log('Generated: 404.html');
}

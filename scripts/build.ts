/**
 * Static site generator entry point
 * 
 * Orchestrates the build process:
 * 1. Load and process articles from markdown
 * 2. Generate HTML pages (articles, index, pagination, 404)
 * 3. Generate feeds (sitemap, RSS)
 * 4. Generate PWA files (manifest, service worker)
 * 5. Copy static assets
 */

import fs from 'fs';
import { mkdirp } from 'mkdirp';
import { DIST_DIR } from './lib/config';
import { getArticles } from './lib/articles';
import { generateArticles, generateIndex, generatePagination, generate404 } from './lib/generators/pages';
import { generateSitemap, generateRSS } from './lib/generators/feeds';
import { generateManifest, generateServiceWorker } from './lib/generators/pwa';
import { copyAssets } from './lib/assets';

async function build(): Promise<void> {
  console.log('Starting build...\n');
  
  // Clean and create dist directory
  if (fs.existsSync(DIST_DIR)) {
    fs.rmSync(DIST_DIR, { recursive: true });
  }
  await mkdirp(DIST_DIR);
  
  // Load articles
  const articles = await getArticles();
  console.log(`Found ${articles.length} articles\n`);
  
  // Generate all output
  await generateArticles(articles);
  await generateIndex(articles);
  await generatePagination(articles);
  await generate404();
  await generateSitemap(articles);
  await generateRSS(articles);
  await generateManifest(articles);
  await generateServiceWorker(articles);
  await copyAssets();
  
  console.log('\nBuild complete!');
}

build().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});

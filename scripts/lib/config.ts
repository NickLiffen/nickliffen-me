/**
 * Build configuration and path definitions
 */

import path from 'path';

// Site configuration
export const SITE_URL = 'https://nickliffen.dev';
export const ARTICLES_PER_INDEX = 3;
export const ARTICLES_PER_PAGE = 2;

// Directory paths
export const ROOT_DIR = path.resolve(__dirname, '../..');
export const SRC_DIR = path.join(ROOT_DIR, 'src');
export const DIST_DIR = path.join(ROOT_DIR, 'dist');
export const TEMPLATES_DIR = path.join(SRC_DIR, 'templates');
export const CONTENT_DIR = path.join(SRC_DIR, 'content', 'articles');

// Static assets to copy (directories and files)
export const STATIC_ASSETS = [
  'css',
  'img',
  'favicon.ico',
  'icon.png',
  'tile.png',
  'tile-wide.png',
  'robots.txt',
  'browserconfig.xml',
  'humans.txt',
  'lighthouserc.js',
  '.htaccess',
  'netlify.toml'
];

// Check if running in development mode
export const isDev = process.env.NODE_ENV === 'development';

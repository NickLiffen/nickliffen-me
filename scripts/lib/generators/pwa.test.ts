/**
 * Tests for PWA generators (manifest and service worker)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs';
import type { Article } from '../../lib/types';

vi.mock('fs');
vi.mock('../config', () => ({
  DIST_DIR: '/mock/dist',
  ARTICLES_PER_INDEX: 3,
  ARTICLES_PER_PAGE: 2
}));

import { generateManifest, generateServiceWorker } from '../../lib/generators/pwa';

describe('pwa', () => {
  const mockArticles: Article[] = [
    {
      slug: 'article-1',
      title: "Nick Liffen's Blog | Article One | Blog Post",
      headline: 'Article One',
      description: 'Description 1',
      date: '2023-06-15',
      content: '<p>Content 1</p>',
      formattedDate: '15th June 2023',
      canonicalUrl: 'https://example.com/articles/article-1.html',
      datePublished: '2023-06-15',
      dateModified: '2023-06-15',
      tocLink: './articles/article-1.html'
    },
    {
      slug: 'article-2',
      title: "Nick Liffen's Blog | This Is A Very Long Article Title That Exceeds Forty Characters | Blog Post",
      headline: 'Long Title',
      description: 'Description 2',
      date: '2023-06-10',
      content: '<p>Content 2</p>',
      formattedDate: '10th June 2023',
      canonicalUrl: 'https://example.com/articles/article-2.html',
      datePublished: '2023-06-10',
      dateModified: '2023-06-10',
      tocLink: './articles/article-2.html'
    }
  ];

  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  describe('generateManifest', () => {
    it('writes manifest.webmanifest to dist', async () => {
      await generateManifest(mockArticles);

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        '/mock/dist/manifest.webmanifest',
        expect.any(String)
      );
    });

    it('generates valid JSON', async () => {
      await generateManifest(mockArticles);

      const content = vi.mocked(fs.writeFileSync).mock.calls[0][1] as string;
      expect(() => JSON.parse(content)).not.toThrow();
    });

    it('includes required PWA fields', async () => {
      await generateManifest(mockArticles);

      const content = vi.mocked(fs.writeFileSync).mock.calls[0][1] as string;
      const manifest = JSON.parse(content);

      expect(manifest.name).toBeDefined();
      expect(manifest.short_name).toBeDefined();
      expect(manifest.icons).toBeDefined();
      expect(manifest.start_url).toBeDefined();
      expect(manifest.display).toBe('standalone');
    });

    it('includes icons with correct sizes', async () => {
      await generateManifest(mockArticles);

      const content = vi.mocked(fs.writeFileSync).mock.calls[0][1] as string;
      const manifest = JSON.parse(content);

      expect(manifest.icons).toHaveLength(2);
      expect(manifest.icons[0].sizes).toBe('192x192');
      expect(manifest.icons[1].sizes).toBe('512x512');
    });

    it('includes home shortcut', async () => {
      await generateManifest(mockArticles);

      const content = vi.mocked(fs.writeFileSync).mock.calls[0][1] as string;
      const manifest = JSON.parse(content);

      expect(manifest.shortcuts[0].url).toBe('/');
      expect(manifest.shortcuts[0].short_name).toBe('Blog Home Page');
    });

    it('includes article shortcuts', async () => {
      await generateManifest(mockArticles);

      const content = vi.mocked(fs.writeFileSync).mock.calls[0][1] as string;
      const manifest = JSON.parse(content);

      // Home + 2 articles
      expect(manifest.shortcuts.length).toBe(3);
      expect(manifest.shortcuts[1].url).toBe('/articles/article-1.html');
    });

    it('cleans up title for short_name', async () => {
      await generateManifest(mockArticles);

      const content = vi.mocked(fs.writeFileSync).mock.calls[0][1] as string;
      const manifest = JSON.parse(content);

      // Should remove "Nick Liffen's Blog | " prefix and " | Blog Post" suffix
      expect(manifest.shortcuts[1].short_name).toBe('Article One');
    });

    it('truncates long short_names', async () => {
      await generateManifest(mockArticles);

      const content = vi.mocked(fs.writeFileSync).mock.calls[0][1] as string;
      const manifest = JSON.parse(content);

      // Second article has long title, should be truncated
      expect(manifest.shortcuts[2].short_name.length).toBeLessThanOrEqual(40);
      expect(manifest.shortcuts[2].short_name).toContain('...');
    });

    it('limits shortcuts to 6 articles', async () => {
      const manyArticles = Array(10).fill(null).map((_, i) => ({
        ...mockArticles[0],
        slug: `article-${i}`,
        title: `Article ${i}`
      }));

      await generateManifest(manyArticles);

      const content = vi.mocked(fs.writeFileSync).mock.calls[0][1] as string;
      const manifest = JSON.parse(content);

      // Home + 6 articles = 7 max
      expect(manifest.shortcuts.length).toBe(7);
    });

    it('logs generated file', async () => {
      const logSpy = vi.spyOn(console, 'log');
      await generateManifest(mockArticles);

      expect(logSpy).toHaveBeenCalledWith('Generated: manifest.webmanifest');
    });

    it('handles empty articles array', async () => {
      await generateManifest([]);

      const content = vi.mocked(fs.writeFileSync).mock.calls[0][1] as string;
      const manifest = JSON.parse(content);

      // Should still have home shortcut
      expect(manifest.shortcuts.length).toBe(1);
    });
  });

  describe('generateServiceWorker', () => {
    it('writes sw.js to dist', async () => {
      await generateServiceWorker(mockArticles);

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        '/mock/dist/sw.js',
        expect.any(String)
      );
    });

    it('includes version string', async () => {
      await generateServiceWorker(mockArticles);

      const content = vi.mocked(fs.writeFileSync).mock.calls[0][1] as string;
      expect(content).toMatch(/var VERSION = '[a-z0-9]+'/);
    });

    it('includes static cache URLs', async () => {
      await generateServiceWorker(mockArticles);

      const content = vi.mocked(fs.writeFileSync).mock.calls[0][1] as string;
      expect(content).toContain("'/'");
      expect(content).toContain("'/sw.js'");
      expect(content).toContain("'/index.html'");
      expect(content).toContain("'/404.html'");
      expect(content).toContain("'/css/hyde.css'");
      expect(content).toContain("'/css/poole.css'");
    });

    it('includes article URLs in cache', async () => {
      await generateServiceWorker(mockArticles);

      const content = vi.mocked(fs.writeFileSync).mock.calls[0][1] as string;
      expect(content).toContain("'/articles/article-1.html'");
      expect(content).toContain("'/articles/article-2.html'");
    });

    it('includes pagination URLs when needed', async () => {
      // 6 articles: 3 on index, 3 remaining = 2 pages
      const sixArticles = Array(6).fill(null).map((_, i) => ({
        ...mockArticles[0],
        slug: `article-${i}`
      }));

      await generateServiceWorker(sixArticles);

      const content = vi.mocked(fs.writeFileSync).mock.calls[0][1] as string;
      expect(content).toContain("'/articles/page/2.html'");
      expect(content).toContain("'/articles/page/3.html'");
    });

    it('includes install event listener', async () => {
      await generateServiceWorker(mockArticles);

      const content = vi.mocked(fs.writeFileSync).mock.calls[0][1] as string;
      expect(content).toContain("this.addEventListener('install'");
      expect(content).toContain('cache.addAll');
    });

    it('includes fetch event listener', async () => {
      await generateServiceWorker(mockArticles);

      const content = vi.mocked(fs.writeFileSync).mock.calls[0][1] as string;
      expect(content).toContain("this.addEventListener('fetch'");
    });

    it('includes activate event listener', async () => {
      await generateServiceWorker(mockArticles);

      const content = vi.mocked(fs.writeFileSync).mock.calls[0][1] as string;
      expect(content).toContain("this.addEventListener('activate'");
      expect(content).toContain('caches.delete');
    });

    it('includes helper functions', async () => {
      await generateServiceWorker(mockArticles);

      const content = vi.mocked(fs.writeFileSync).mock.calls[0][1] as string;
      expect(content).toContain('function fetchFromNetworkAndCache');
      expect(content).toContain('function handleNoCacheMatch');
    });

    it('logs generated file', async () => {
      const logSpy = vi.spyOn(console, 'log');
      await generateServiceWorker(mockArticles);

      expect(logSpy).toHaveBeenCalledWith('Generated: sw.js');
    });

    it('handles empty articles array', async () => {
      await generateServiceWorker([]);

      const content = vi.mocked(fs.writeFileSync).mock.calls[0][1] as string;
      expect(content).toContain("'/index.html'");
      expect(content).not.toContain('/articles/article-');
    });

    it('generates unique version on each call', async () => {
      await generateServiceWorker(mockArticles);
      const content1 = vi.mocked(fs.writeFileSync).mock.calls[0][1] as string;
      const version1 = content1.match(/VERSION = '([^']+)'/)?.[1];

      vi.resetAllMocks();
      
      // Small delay to ensure different timestamp
      await new Promise(resolve => setTimeout(resolve, 10));
      
      await generateServiceWorker(mockArticles);
      const content2 = vi.mocked(fs.writeFileSync).mock.calls[0][1] as string;
      const version2 = content2.match(/VERSION = '([^']+)'/)?.[1];

      expect(version1).not.toBe(version2);
    });
  });
});

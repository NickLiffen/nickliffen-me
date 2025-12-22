/**
 * Tests for feed generators (sitemap and RSS)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs';
import type { Article } from '../../lib/types';

vi.mock('fs');
vi.mock('../config', () => ({
  DIST_DIR: '/mock/dist',
  SITE_URL: 'https://example.com'
}));

import { generateSitemap, generateRSS } from '../../lib/generators/feeds';

describe('feeds', () => {
  const mockArticles: Article[] = [
    {
      slug: 'article-1',
      title: 'Article 1',
      headline: 'Headline 1',
      description: 'Description 1',
      date: '2023-06-15',
      content: '<p>Content 1</p>',
      formattedDate: '15th June 2023',
      canonicalUrl: 'https://example.com/articles/article-1.html',
      datePublished: '2023-06-15',
      dateModified: '2023-06-20',
      tocLink: './articles/article-1.html'
    },
    {
      slug: 'article-2',
      title: 'Article 2',
      headline: 'Headline 2',
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

  describe('generateSitemap', () => {
    it('writes sitemap.xml to dist', async () => {
      await generateSitemap(mockArticles);

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        '/mock/dist/sitemap.xml',
        expect.any(String)
      );
    });

    it('generates valid XML structure', async () => {
      await generateSitemap(mockArticles);

      const content = vi.mocked(fs.writeFileSync).mock.calls[0][1] as string;
      expect(content).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(content).toContain('<urlset');
      expect(content).toContain('</urlset>');
    });

    it('includes homepage URL', async () => {
      await generateSitemap(mockArticles);

      const content = vi.mocked(fs.writeFileSync).mock.calls[0][1] as string;
      expect(content).toContain('<loc>https://example.com/</loc>');
      expect(content).toContain('<priority>1.00</priority>');
    });

    it('includes article URLs', async () => {
      await generateSitemap(mockArticles);

      const content = vi.mocked(fs.writeFileSync).mock.calls[0][1] as string;
      expect(content).toContain('<loc>https://example.com/articles/article-1.html</loc>');
      expect(content).toContain('<loc>https://example.com/articles/article-2.html</loc>');
    });

    it('uses dateModified for lastmod', async () => {
      await generateSitemap(mockArticles);

      const content = vi.mocked(fs.writeFileSync).mock.calls[0][1] as string;
      expect(content).toContain('2023-06-20');
    });

    it('sets correct changefreq for articles', async () => {
      await generateSitemap(mockArticles);

      const content = vi.mocked(fs.writeFileSync).mock.calls[0][1] as string;
      expect(content).toContain('<changefreq>monthly</changefreq>');
    });

    it('logs generated file', async () => {
      const logSpy = vi.spyOn(console, 'log');
      await generateSitemap(mockArticles);

      expect(logSpy).toHaveBeenCalledWith('Generated: sitemap.xml');
    });

    it('handles empty articles array', async () => {
      await generateSitemap([]);

      const content = vi.mocked(fs.writeFileSync).mock.calls[0][1] as string;
      expect(content).toContain('<loc>https://example.com/</loc>');
      expect(content).not.toContain('article-');
    });
  });

  describe('generateRSS', () => {
    it('writes rss.xml to dist', async () => {
      await generateRSS(mockArticles);

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        '/mock/dist/rss.xml',
        expect.any(String)
      );
    });

    it('generates valid RSS structure', async () => {
      await generateRSS(mockArticles);

      const content = vi.mocked(fs.writeFileSync).mock.calls[0][1] as string;
      expect(content).toContain('<?xml version="1.0" encoding="UTF-8" ?>');
      expect(content).toContain('<rss version="2.0"');
      expect(content).toContain('<channel>');
      expect(content).toContain('</channel>');
      expect(content).toContain('</rss>');
    });

    it('includes atom self link', async () => {
      await generateRSS(mockArticles);

      const content = vi.mocked(fs.writeFileSync).mock.calls[0][1] as string;
      expect(content).toContain('<atom:link href="https://example.com/rss.xml"');
    });

    it('includes channel metadata', async () => {
      await generateRSS(mockArticles);

      const content = vi.mocked(fs.writeFileSync).mock.calls[0][1] as string;
      expect(content).toContain("<title>Nick Liffen's Blog");
      expect(content).toContain('<link>https://example.com</link>');
      expect(content).toContain('<language>en-GB</language>');
    });

    it('includes article items', async () => {
      await generateRSS(mockArticles);

      const content = vi.mocked(fs.writeFileSync).mock.calls[0][1] as string;
      expect(content).toContain('<item>');
      expect(content).toContain('<title>Article 1</title>');
      expect(content).toContain('<link>https://example.com/articles/article-1.html</link>');
      expect(content).toContain('<description>Description 1</description>');
    });

    it('includes guid for each item', async () => {
      await generateRSS(mockArticles);

      const content = vi.mocked(fs.writeFileSync).mock.calls[0][1] as string;
      expect(content).toContain('<guid>https://example.com/articles/article-1.html</guid>');
    });

    it('includes pubDate in RFC 822 format', async () => {
      await generateRSS(mockArticles);

      const content = vi.mocked(fs.writeFileSync).mock.calls[0][1] as string;
      expect(content).toMatch(/<pubDate>\w{3}, \d{2} \w{3} \d{4}/);
    });

    it('logs generated file', async () => {
      const logSpy = vi.spyOn(console, 'log');
      await generateRSS(mockArticles);

      expect(logSpy).toHaveBeenCalledWith('Generated: rss.xml');
    });

    it('handles empty articles array', async () => {
      await generateRSS([]);

      const content = vi.mocked(fs.writeFileSync).mock.calls[0][1] as string;
      expect(content).toContain('<channel>');
      expect(content).not.toContain('<item>');
    });
  });
});

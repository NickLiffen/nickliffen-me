/**
 * Tests for HTML page generators
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs';
import { mkdirp } from 'mkdirp';
import type { Article } from '../../lib/types';

vi.mock('fs');
vi.mock('mkdirp');
vi.mock('../config', () => ({
  DIST_DIR: '/mock/dist',
  ARTICLES_PER_INDEX: 3,
  ARTICLES_PER_PAGE: 2
}));
vi.mock('../templates', () => ({
  renderTemplate: vi.fn((name: string, data: Record<string, unknown>) => `<html>${name}:${JSON.stringify(data)}</html>`)
}));

import { generateArticles, generateIndex, generatePagination, generate404 } from '../../lib/generators/pages';
import { renderTemplate } from '../../lib/templates';

describe('pages', () => {
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
      dateModified: '2023-06-15',
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
      tocLink: './articles/article-2.html',
      hasYouTube: true
    }
  ];

  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(mkdirp).mockResolvedValue('/mock/dist');
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  describe('generateArticles', () => {
    it('creates articles directory', async () => {
      await generateArticles(mockArticles);

      expect(mkdirp).toHaveBeenCalledWith('/mock/dist/articles');
    });

    it('generates HTML file for each article', async () => {
      await generateArticles(mockArticles);

      expect(fs.writeFileSync).toHaveBeenCalledTimes(2);
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        '/mock/dist/articles/article-1.html',
        expect.any(String)
      );
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        '/mock/dist/articles/article-2.html',
        expect.any(String)
      );
    });

    it('renders article template with article data', async () => {
      await generateArticles([mockArticles[0]]);

      expect(renderTemplate).toHaveBeenCalledWith('article.ejs', mockArticles[0]);
    });

    it('logs generated files', async () => {
      const logSpy = vi.spyOn(console, 'log');
      await generateArticles(mockArticles);

      expect(logSpy).toHaveBeenCalledWith('Generated: articles/article-1.html');
      expect(logSpy).toHaveBeenCalledWith('Generated: articles/article-2.html');
    });

    it('handles empty articles array', async () => {
      await generateArticles([]);

      expect(mkdirp).toHaveBeenCalled();
      expect(fs.writeFileSync).not.toHaveBeenCalled();
    });
  });

  describe('generateIndex', () => {
    it('writes index.html to dist', async () => {
      await generateIndex(mockArticles);

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        '/mock/dist/index.html',
        expect.any(String)
      );
    });

    it('passes display articles and all articles to template', async () => {
      const fiveArticles = Array(5).fill(null).map((_, i) => ({
        ...mockArticles[0],
        slug: `article-${i}`,
        title: `Article ${i}`
      }));

      await generateIndex(fiveArticles);

      expect(renderTemplate).toHaveBeenCalledWith('index.ejs', expect.objectContaining({
        displayArticles: expect.arrayContaining([expect.objectContaining({ slug: 'article-0' })]),
        allArticles: expect.arrayContaining([expect.objectContaining({ slug: 'article-4' })])
      }));
    });

    it('limits display articles to ARTICLES_PER_INDEX', async () => {
      const fiveArticles = Array(5).fill(null).map((_, i) => ({
        ...mockArticles[0],
        slug: `article-${i}`
      }));

      await generateIndex(fiveArticles);

      const call = vi.mocked(renderTemplate).mock.calls[0];
      const data = call[1] as { displayArticles: Article[] };
      expect(data.displayArticles).toHaveLength(3);
    });

    it('logs generated file', async () => {
      const logSpy = vi.spyOn(console, 'log');
      await generateIndex(mockArticles);

      expect(logSpy).toHaveBeenCalledWith('Generated: index.html');
    });
  });

  describe('generatePagination', () => {
    it('creates pagination directory', async () => {
      const sixArticles = Array(6).fill(null).map((_, i) => ({
        ...mockArticles[0],
        slug: `article-${i}`
      }));

      await generatePagination(sixArticles);

      expect(mkdirp).toHaveBeenCalledWith('/mock/dist/articles/page');
    });

    it('generates correct number of pagination pages', async () => {
      // 6 articles: 3 on index, 3 remaining = 2 pagination pages (2 per page)
      const sixArticles = Array(6).fill(null).map((_, i) => ({
        ...mockArticles[0],
        slug: `article-${i}`
      }));

      await generatePagination(sixArticles);

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        '/mock/dist/articles/page/2.html',
        expect.any(String)
      );
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        '/mock/dist/articles/page/3.html',
        expect.any(String)
      );
    });

    it('sets hasNextPage correctly', async () => {
      const sixArticles = Array(6).fill(null).map((_, i) => ({
        ...mockArticles[0],
        slug: `article-${i}`
      }));

      await generatePagination(sixArticles);

      // First call (page 2) should have hasNextPage: true
      const firstCall = vi.mocked(renderTemplate).mock.calls[0];
      expect(firstCall[1]).toMatchObject({ hasNextPage: true, pageNumber: 2 });

      // Second call (page 3) should have hasNextPage: false
      const secondCall = vi.mocked(renderTemplate).mock.calls[1];
      expect(secondCall[1]).toMatchObject({ hasNextPage: false, pageNumber: 3 });
    });

    it('detects hasYouTube in articles', async () => {
      const articlesWithYouTube = [
        ...Array(3).fill(null).map((_, i) => ({ ...mockArticles[0], slug: `index-${i}` })),
        { ...mockArticles[0], slug: 'no-youtube', hasYouTube: false },
        { ...mockArticles[0], slug: 'with-youtube', hasYouTube: true }
      ];

      await generatePagination(articlesWithYouTube);

      const call = vi.mocked(renderTemplate).mock.calls[0];
      expect(call[1]).toMatchObject({ hasYouTube: true });
    });

    it('sets relative tocLinks for pagination', async () => {
      const fourArticles = Array(4).fill(null).map((_, i) => ({
        ...mockArticles[0],
        slug: `article-${i}`
      }));

      await generatePagination(fourArticles);

      const call = vi.mocked(renderTemplate).mock.calls[0];
      const data = call[1] as { allArticles: { tocLink: string }[] };
      expect(data.allArticles[0].tocLink).toBe('../article-0.html');
    });

    it('handles no pagination needed', async () => {
      await generatePagination(mockArticles); // Only 2 articles, 3 per index

      expect(fs.writeFileSync).not.toHaveBeenCalled();
    });
  });

  describe('generate404', () => {
    it('writes 404.html to dist', async () => {
      await generate404();

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        '/mock/dist/404.html',
        expect.any(String)
      );
    });

    it('renders 404 template with empty data', async () => {
      await generate404();

      expect(renderTemplate).toHaveBeenCalledWith('404.ejs', {});
    });

    it('logs generated file', async () => {
      const logSpy = vi.spyOn(console, 'log');
      await generate404();

      expect(logSpy).toHaveBeenCalledWith('Generated: 404.html');
    });
  });
});

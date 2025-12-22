/**
 * Tests for article loading and processing
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import { glob } from 'glob';

// Mock dependencies before importing module
vi.mock('fs');
vi.mock('glob');
vi.mock('./config', () => ({
  CONTENT_DIR: '/mock/content',
  SITE_URL: 'https://example.com',
  isDev: false
}));

// Import after mocks are set up
import { getArticles } from '../lib/articles';

describe('articles', () => {
  const mockArticleContent = `---
slug: "test-article"
title: "Test Article"
headline: "Test Headline"
description: "Test Description"
date: "2023-06-15"
modified: "2023-06-20"
keywords:
  - test
image: "https://example.com/img.jpg"
draft: false
---

# Test Content

This is **bold** text.
`;

  const mockDraftArticle = `---
slug: "draft-article"
title: "Draft Article"
headline: "Draft Headline"
description: "Draft Description"
date: "2023-06-10"
draft: true
---

Draft content.
`;

  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getArticles', () => {
    it('loads and processes markdown files', async () => {
      vi.mocked(glob).mockResolvedValue(['/mock/content/test-article.md']);
      vi.mocked(fs.readFileSync).mockReturnValue(mockArticleContent);

      const articles = await getArticles();

      expect(articles).toHaveLength(1);
      expect(articles[0].slug).toBe('test-article');
      expect(articles[0].title).toBe('Test Article');
      expect(articles[0].description).toBe('Test Description');
    });

    it('converts markdown to HTML', async () => {
      vi.mocked(glob).mockResolvedValue(['/mock/content/test-article.md']);
      vi.mocked(fs.readFileSync).mockReturnValue(mockArticleContent);

      const articles = await getArticles();

      expect(articles[0].content).toContain('<h1');
      expect(articles[0].content).toContain('<strong>bold</strong>');
    });

    it('formats date correctly', async () => {
      vi.mocked(glob).mockResolvedValue(['/mock/content/test-article.md']);
      vi.mocked(fs.readFileSync).mockReturnValue(mockArticleContent);

      const articles = await getArticles();

      expect(articles[0].formattedDate).toBe('15th June 2023');
    });

    it('generates canonical URL', async () => {
      vi.mocked(glob).mockResolvedValue(['/mock/content/test-article.md']);
      vi.mocked(fs.readFileSync).mockReturnValue(mockArticleContent);

      const articles = await getArticles();

      expect(articles[0].canonicalUrl).toBe('https://example.com/articles/test-article.html');
    });

    it('uses modified date for dateModified when available', async () => {
      vi.mocked(glob).mockResolvedValue(['/mock/content/test-article.md']);
      vi.mocked(fs.readFileSync).mockReturnValue(mockArticleContent);

      const articles = await getArticles();

      expect(articles[0].dateModified).toBe('2023-06-20');
    });

    it('uses date for dateModified when modified is not set', async () => {
      const contentWithoutModified = mockArticleContent.replace('modified: "2023-06-20"\n', '');
      vi.mocked(glob).mockResolvedValue(['/mock/content/test-article.md']);
      vi.mocked(fs.readFileSync).mockReturnValue(contentWithoutModified);

      const articles = await getArticles();

      expect(articles[0].dateModified).toBe('2023-06-15');
    });

    it('generates tocLink', async () => {
      vi.mocked(glob).mockResolvedValue(['/mock/content/test-article.md']);
      vi.mocked(fs.readFileSync).mockReturnValue(mockArticleContent);

      const articles = await getArticles();

      expect(articles[0].tocLink).toBe('./articles/test-article.html');
    });

    it('filters draft articles in production', async () => {
      vi.mocked(glob).mockResolvedValue([
        '/mock/content/test-article.md',
        '/mock/content/draft-article.md'
      ]);
      vi.mocked(fs.readFileSync)
        .mockReturnValueOnce(mockArticleContent)
        .mockReturnValueOnce(mockDraftArticle);

      const articles = await getArticles();

      expect(articles).toHaveLength(1);
      expect(articles[0].slug).toBe('test-article');
    });

    it('sorts articles by date descending', async () => {
      const olderArticle = mockArticleContent.replace('2023-06-15', '2023-01-01');
      vi.mocked(glob).mockResolvedValue([
        '/mock/content/older.md',
        '/mock/content/newer.md'
      ]);
      vi.mocked(fs.readFileSync)
        .mockReturnValueOnce(olderArticle)
        .mockReturnValueOnce(mockArticleContent);

      const articles = await getArticles();

      expect(articles[0].date).toBe('2023-06-15');
      expect(articles[1].date).toBe('2023-01-01');
    });

    it('returns empty array when no files found', async () => {
      vi.mocked(glob).mockResolvedValue([]);

      const articles = await getArticles();

      expect(articles).toHaveLength(0);
    });
  });
});

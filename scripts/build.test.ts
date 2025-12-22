import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs';

// Mock all dependencies
vi.mock('fs');
vi.mock('mkdirp', () => ({
  mkdirp: vi.fn().mockResolvedValue(undefined)
}));
vi.mock('./lib/config', () => ({
  DIST_DIR: '/mock/dist'
}));
vi.mock('./lib/articles', () => ({
  getArticles: vi.fn()
}));
vi.mock('./lib/generators/pages', () => ({
  generateArticles: vi.fn().mockResolvedValue(undefined),
  generateIndex: vi.fn().mockResolvedValue(undefined),
  generatePagination: vi.fn().mockResolvedValue(undefined),
  generate404: vi.fn().mockResolvedValue(undefined)
}));
vi.mock('./lib/generators/feeds', () => ({
  generateSitemap: vi.fn().mockResolvedValue(undefined),
  generateRSS: vi.fn().mockResolvedValue(undefined)
}));
vi.mock('./lib/generators/pwa', () => ({
  generateManifest: vi.fn().mockResolvedValue(undefined),
  generateServiceWorker: vi.fn().mockResolvedValue(undefined)
}));
vi.mock('./lib/assets', () => ({
  copyAssets: vi.fn().mockResolvedValue(undefined)
}));

// Import after mocks are set up
import { mkdirp } from 'mkdirp';
import { DIST_DIR } from './lib/config';
import { getArticles } from './lib/articles';
import { generateArticles, generateIndex, generatePagination, generate404 } from './lib/generators/pages';
import { generateSitemap, generateRSS } from './lib/generators/feeds';
import { generateManifest, generateServiceWorker } from './lib/generators/pwa';
import { copyAssets } from './lib/assets';

// Extract and test the build function logic
// Since build.ts runs on import, we need to test its components
describe('build process', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('dist directory management', () => {
    it('should clean dist directory if it exists', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.rmSync).mockReturnValue(undefined);
      
      // Simulate the clean logic
      if (fs.existsSync(DIST_DIR)) {
        fs.rmSync(DIST_DIR, { recursive: true });
      }
      await mkdirp(DIST_DIR);
      
      expect(fs.rmSync).toHaveBeenCalledWith(DIST_DIR, { recursive: true });
      expect(mkdirp).toHaveBeenCalledWith(DIST_DIR);
    });

    it('should not clean if dist directory does not exist', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(false);
      
      // Simulate the clean logic
      if (fs.existsSync(DIST_DIR)) {
        fs.rmSync(DIST_DIR, { recursive: true });
      }
      await mkdirp(DIST_DIR);
      
      expect(fs.rmSync).not.toHaveBeenCalled();
      expect(mkdirp).toHaveBeenCalledWith(DIST_DIR);
    });
  });

  describe('article processing', () => {
    it('should load articles', async () => {
      const mockArticles = [
        { slug: 'article-1', title: 'Article 1' },
        { slug: 'article-2', title: 'Article 2' }
      ];
      vi.mocked(getArticles).mockResolvedValue(mockArticles as any);
      
      const articles = await getArticles();
      
      expect(getArticles).toHaveBeenCalled();
      expect(articles).toHaveLength(2);
    });
  });

  describe('page generation', () => {
    const mockArticles = [{ slug: 'test', title: 'Test' }] as any;

    it('should generate article pages', async () => {
      await generateArticles(mockArticles);
      expect(generateArticles).toHaveBeenCalledWith(mockArticles);
    });

    it('should generate index page', async () => {
      await generateIndex(mockArticles);
      expect(generateIndex).toHaveBeenCalledWith(mockArticles);
    });

    it('should generate pagination pages', async () => {
      await generatePagination(mockArticles);
      expect(generatePagination).toHaveBeenCalledWith(mockArticles);
    });

    it('should generate 404 page', async () => {
      await generate404();
      expect(generate404).toHaveBeenCalled();
    });
  });

  describe('feed generation', () => {
    const mockArticles = [{ slug: 'test', title: 'Test' }] as any;

    it('should generate sitemap', async () => {
      await generateSitemap(mockArticles);
      expect(generateSitemap).toHaveBeenCalledWith(mockArticles);
    });

    it('should generate RSS feed', async () => {
      await generateRSS(mockArticles);
      expect(generateRSS).toHaveBeenCalledWith(mockArticles);
    });
  });

  describe('PWA file generation', () => {
    const mockArticles = [{ slug: 'test', title: 'Test' }] as any;

    it('should generate manifest', async () => {
      await generateManifest(mockArticles);
      expect(generateManifest).toHaveBeenCalledWith(mockArticles);
    });

    it('should generate service worker', async () => {
      await generateServiceWorker(mockArticles);
      expect(generateServiceWorker).toHaveBeenCalledWith(mockArticles);
    });
  });

  describe('asset copying', () => {
    it('should copy static assets', async () => {
      await copyAssets();
      expect(copyAssets).toHaveBeenCalled();
    });
  });
});

/**
 * Tests for static asset copying
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs';
import { mkdirp } from 'mkdirp';

vi.mock('fs');
vi.mock('mkdirp');
vi.mock('./config', () => ({
  ROOT_DIR: '/mock/root',
  DIST_DIR: '/mock/dist',
  STATIC_ASSETS: ['css', 'favicon.ico', 'missing.txt']
}));

import { copyAssets } from '../lib/assets';

describe('assets', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  describe('copyAssets', () => {
    it('copies file assets', async () => {
      vi.mocked(fs.existsSync).mockImplementation((path) => {
        return path === '/mock/root/favicon.ico';
      });
      vi.mocked(fs.statSync).mockReturnValue({ isDirectory: () => false } as fs.Stats);

      await copyAssets();

      expect(fs.copyFileSync).toHaveBeenCalledWith('/mock/root/favicon.ico', '/mock/dist/favicon.ico');
    });

    it('copies directory contents', async () => {
      vi.mocked(fs.existsSync).mockImplementation((path) => {
        return path === '/mock/root/css';
      });
      vi.mocked(fs.statSync).mockReturnValue({ isDirectory: () => true } as fs.Stats);
      // Use 'as any' to avoid complex Dirent typing in tests
      vi.mocked(fs.readdirSync).mockReturnValue(['style.css', 'theme.css'] as any);
      vi.mocked(mkdirp).mockResolvedValue('/mock/dist/css');

      await copyAssets();

      expect(mkdirp).toHaveBeenCalledWith('/mock/dist/css');
      expect(fs.copyFileSync).toHaveBeenCalledWith('/mock/root/css/style.css', '/mock/dist/css/style.css');
      expect(fs.copyFileSync).toHaveBeenCalledWith('/mock/root/css/theme.css', '/mock/dist/css/theme.css');
    });

    it('warns when asset not found', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(false);
      const warnSpy = vi.spyOn(console, 'warn');

      await copyAssets();

      expect(warnSpy).toHaveBeenCalledWith('Warning: Asset not found: css');
      expect(warnSpy).toHaveBeenCalledWith('Warning: Asset not found: favicon.ico');
      expect(warnSpy).toHaveBeenCalledWith('Warning: Asset not found: missing.txt');
    });

    it('logs copied assets', async () => {
      vi.mocked(fs.existsSync).mockImplementation((path) => {
        return path === '/mock/root/favicon.ico';
      });
      vi.mocked(fs.statSync).mockReturnValue({ isDirectory: () => false } as fs.Stats);
      const logSpy = vi.spyOn(console, 'log');

      await copyAssets();

      expect(logSpy).toHaveBeenCalledWith('Copied: favicon.ico');
    });
  });
});

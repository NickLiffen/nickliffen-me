import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';

// Mock dependencies
vi.mock('fs');
vi.mock('./lib/config', () => ({
  CONTENT_DIR: '/mock/content'
}));
vi.mock('./lib/dates', () => ({
  getToday: () => '2024-01-15'
}));

import { slugify, generateTemplate, createArticleFile, main } from './new-article';
import { CONTENT_DIR } from './lib/config';

describe('slugify', () => {
  it('should convert title to lowercase', () => {
    expect(slugify('My Article Title')).toBe('my-article-title');
  });

  it('should replace spaces with hyphens', () => {
    expect(slugify('hello world')).toBe('hello-world');
  });

  it('should remove special characters', () => {
    expect(slugify('Hello! World? #123')).toBe('hello-world-123');
  });

  it('should handle multiple consecutive special characters', () => {
    expect(slugify('hello!!!world')).toBe('hello-world');
  });

  it('should remove leading and trailing hyphens', () => {
    expect(slugify('---hello---')).toBe('hello');
  });

  it('should handle empty string', () => {
    expect(slugify('')).toBe('');
  });

  it('should handle numbers', () => {
    expect(slugify('Top 10 Tips for 2024')).toBe('top-10-tips-for-2024');
  });

  it('should handle apostrophes', () => {
    expect(slugify("What's New in TypeScript")).toBe('what-s-new-in-typescript');
  });
});

describe('generateTemplate', () => {
  it('should generate frontmatter with correct slug', () => {
    const template = generateTemplate('my-article', 'My Article', '2024-01-15');
    expect(template).toContain('slug: "my-article"');
  });

  it('should include title in blog post title', () => {
    const template = generateTemplate('my-article', 'My Article', '2024-01-15');
    expect(template).toContain('title: "Nick Liffen\'s Blog | My Article | Blog Post"');
  });

  it('should set headline to title', () => {
    const template = generateTemplate('my-article', 'My Article', '2024-01-15');
    expect(template).toContain('headline: "My Article"');
  });

  it('should include date and modified date', () => {
    const template = generateTemplate('my-article', 'My Article', '2024-01-15');
    expect(template).toContain('date: "2024-01-15"');
    expect(template).toContain('modified: "2024-01-15"');
  });

  it('should set draft to true by default', () => {
    const template = generateTemplate('my-article', 'My Article', '2024-01-15');
    expect(template).toContain('draft: true');
  });

  it('should include introduction and conclusion sections', () => {
    const template = generateTemplate('my-article', 'My Article', '2024-01-15');
    expect(template).toContain('## Introduction');
    expect(template).toContain('## Conclusion');
  });

  it('should include default keywords', () => {
    const template = generateTemplate('my-article', 'My Article', '2024-01-15');
    expect(template).toContain('- Nick');
    expect(template).toContain('- Liffen');
    expect(template).toContain('- Blog');
  });
});

describe('createArticleFile', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should create article file in content directory', () => {
    vi.mocked(fs.existsSync).mockReturnValue(false);
    vi.mocked(fs.writeFileSync).mockReturnValue(undefined);
    vi.mocked(fs.mkdirSync).mockReturnValue(undefined);

    const filePath = createArticleFile('My Test Article');

    expect(filePath).toBe(path.join(CONTENT_DIR, 'my-test-article.md'));
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      filePath,
      expect.stringContaining('slug: "my-test-article"')
    );
  });

  it('should throw error if article already exists', () => {
    vi.mocked(fs.existsSync).mockReturnValue(true);

    expect(() => createArticleFile('Existing Article')).toThrow(
      'Article already exists'
    );
  });

  it('should create content directory if it does not exist', () => {
    vi.mocked(fs.existsSync)
      .mockReturnValueOnce(false) // file doesn't exist
      .mockReturnValueOnce(false); // directory doesn't exist
    vi.mocked(fs.writeFileSync).mockReturnValue(undefined);
    vi.mocked(fs.mkdirSync).mockReturnValue(undefined);

    createArticleFile('New Article');

    expect(fs.mkdirSync).toHaveBeenCalledWith(CONTENT_DIR, { recursive: true });
  });

  it('should not create directory if it already exists', () => {
    vi.mocked(fs.existsSync)
      .mockReturnValueOnce(false) // file doesn't exist
      .mockReturnValueOnce(true); // directory exists
    vi.mocked(fs.writeFileSync).mockReturnValue(undefined);

    createArticleFile('Another Article');

    expect(fs.mkdirSync).not.toHaveBeenCalled();
  });

  it('should use getToday for date', () => {
    vi.mocked(fs.existsSync).mockReturnValue(false);
    vi.mocked(fs.writeFileSync).mockReturnValue(undefined);
    vi.mocked(fs.mkdirSync).mockReturnValue(undefined);

    createArticleFile('Date Test');

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      expect.any(String),
      expect.stringContaining('date: "2024-01-15"')
    );
  });
});

describe('main', () => {
  let originalArgv: string[];
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  let processExitSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    originalArgv = process.argv;
    vi.resetAllMocks();
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    processExitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit called');
    });
  });

  afterEach(() => {
    process.argv = originalArgv;
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    processExitSpy.mockRestore();
  });

  it('should show usage and exit if no arguments provided', () => {
    process.argv = ['node', 'new-article.ts'];

    expect(() => main()).toThrow('process.exit called');
    expect(consoleLogSpy).toHaveBeenCalledWith(
      'Usage: npm run new-article "My Article Title"'
    );
    expect(processExitSpy).toHaveBeenCalledWith(1);
  });

  it('should create article with provided title', () => {
    process.argv = ['node', 'new-article.ts', 'My New Article'];
    vi.mocked(fs.existsSync).mockReturnValue(false);
    vi.mocked(fs.writeFileSync).mockReturnValue(undefined);
    vi.mocked(fs.mkdirSync).mockReturnValue(undefined);

    main();

    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('Created new article:')
    );
  });

  it('should join multiple arguments as title', () => {
    process.argv = ['node', 'new-article.ts', 'Multi', 'Word', 'Title'];
    vi.mocked(fs.existsSync).mockReturnValue(false);
    vi.mocked(fs.writeFileSync).mockReturnValue(undefined);
    vi.mocked(fs.mkdirSync).mockReturnValue(undefined);

    main();

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      expect.stringContaining('multi-word-title.md'),
      expect.stringContaining('headline: "Multi Word Title"')
    );
  });

  it('should show error and exit if article exists', () => {
    process.argv = ['node', 'new-article.ts', 'Existing Article'];
    vi.mocked(fs.existsSync).mockReturnValue(true);

    expect(() => main()).toThrow('process.exit called');
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Article already exists')
    );
    expect(processExitSpy).toHaveBeenCalledWith(1);
  });

  it('should show next steps after creating article', () => {
    process.argv = ['node', 'new-article.ts', 'Success Article'];
    vi.mocked(fs.existsSync).mockReturnValue(false);
    vi.mocked(fs.writeFileSync).mockReturnValue(undefined);
    vi.mocked(fs.mkdirSync).mockReturnValue(undefined);

    main();

    expect(consoleLogSpy).toHaveBeenCalledWith('\nNext steps:');
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('Edit the frontmatter')
    );
  });
});

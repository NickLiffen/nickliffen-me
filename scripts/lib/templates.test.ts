/**
 * Tests for template rendering
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs';

vi.mock('fs');
vi.mock('./config', () => ({
  TEMPLATES_DIR: '/mock/templates'
}));

import { renderTemplate } from '../lib/templates';

describe('templates', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('renderTemplate', () => {
    it('renders simple template with data', () => {
      vi.mocked(fs.readFileSync).mockReturnValue('<h1><%= title %></h1>');

      const result = renderTemplate('test.ejs', { title: 'Hello World' });

      expect(result).toBe('<h1>Hello World</h1>');
    });

    it('renders template with multiple variables', () => {
      vi.mocked(fs.readFileSync).mockReturnValue('<div><h1><%= title %></h1><p><%= content %></p></div>');

      const result = renderTemplate('test.ejs', { title: 'Title', content: 'Content' });

      expect(result).toBe('<div><h1>Title</h1><p>Content</p></div>');
    });

    it('handles loops in templates', () => {
      vi.mocked(fs.readFileSync).mockReturnValue('<ul><% items.forEach(item => { %><li><%= item %></li><% }); %></ul>');

      const result = renderTemplate('test.ejs', { items: ['a', 'b', 'c'] });

      expect(result).toBe('<ul><li>a</li><li>b</li><li>c</li></ul>');
    });

    it('handles conditionals in templates', () => {
      vi.mocked(fs.readFileSync).mockReturnValue('<% if (show) { %><p>Visible</p><% } %>');

      expect(renderTemplate('test.ejs', { show: true })).toBe('<p>Visible</p>');
      expect(renderTemplate('test.ejs', { show: false })).toBe('');
    });

    it('escapes HTML by default', () => {
      vi.mocked(fs.readFileSync).mockReturnValue('<p><%= text %></p>');

      const result = renderTemplate('test.ejs', { text: '<script>alert("xss")</script>' });

      expect(result).not.toContain('<script>');
      expect(result).toContain('&lt;script&gt;');
    });

    it('allows unescaped output with <%- %>', () => {
      vi.mocked(fs.readFileSync).mockReturnValue('<div><%- html %></div>');

      const result = renderTemplate('test.ejs', { html: '<strong>bold</strong>' });

      expect(result).toBe('<div><strong>bold</strong></div>');
    });

    it('reads template from correct path', () => {
      vi.mocked(fs.readFileSync).mockReturnValue('<p>test</p>');

      renderTemplate('article.ejs', {});

      expect(fs.readFileSync).toHaveBeenCalledWith('/mock/templates/article.ejs', 'utf-8');
    });
  });
});

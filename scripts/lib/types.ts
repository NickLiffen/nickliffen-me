/**
 * Core type definitions for the static site generator
 */

export interface ArticleFrontmatter {
  slug: string;
  title: string;
  headline: string;
  description: string;
  date: string;
  modified?: string;
  keywords?: string[];
  image?: string;
  sections?: string[];
  articleBody?: string;
  hasYouTube?: boolean;
  draft?: boolean;
}

export interface Article extends ArticleFrontmatter {
  content: string;
  formattedDate: string;
  canonicalUrl: string;
  datePublished: string;
  dateModified: string;
  tocLink: string;
}

export interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: string;
}

export interface ManifestShortcut {
  name: string;
  url: string;
  short_name: string;
}

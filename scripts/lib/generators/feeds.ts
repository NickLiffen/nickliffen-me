/**
 * Feed generators: sitemap.xml and rss.xml
 */

import fs from 'fs';
import path from 'path';
import { DIST_DIR, SITE_URL } from '../config';
import { formatDateISO, formatDateRFC822 } from '../dates';
import type { Article, SitemapUrl } from '../types';

/** Generate sitemap.xml */
export async function generateSitemap(articles: Article[]): Promise<void> {
  const urls: SitemapUrl[] = [
    {
      loc: `${SITE_URL}/`,
      lastmod: formatDateISO('2021-01-31'),
      changefreq: 'weekly',
      priority: '1.00'
    },
    ...articles.map(a => ({
      loc: `${SITE_URL}/articles/${a.slug}.html`,
      lastmod: formatDateISO(a.dateModified),
      changefreq: 'monthly',
      priority: '0.80'
    }))
  ];
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

${urls.map(u => `<url>
  <loc>${u.loc}</loc>
  <lastmod>${u.lastmod}</lastmod>
  <changefreq>${u.changefreq}</changefreq>
  <priority>${u.priority}</priority>
</url>`).join('\n')}

</urlset>
`;
  
  fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemap);
  console.log('Generated: sitemap.xml');
}

/** Generate rss.xml */
export async function generateRSS(articles: Article[]): Promise<void> {
  const items = articles.map(a => `  <item>
    <title>${a.title}</title>
    <link>${SITE_URL}/articles/${a.slug}.html</link>
    <description>${a.description}</description>
    <guid>${SITE_URL}/articles/${a.slug}.html</guid>
    <pubDate>${formatDateRFC822(a.date)}</pubDate>
  </item>`).join('\n');
  
  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">

<channel>
  <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
  <title>Nick Liffen's Blog | Technology, DevOps and Developer Blog</title>
  <link>${SITE_URL}</link>
  <description>Nick Liffen's Blog | Focusing on DevOps, Developer Experience and all aspects of Technology</description>
  <category>Web Development</category>
  <language>en-GB</language>
${items}
</channel>

</rss>
`;
  
  fs.writeFileSync(path.join(DIST_DIR, 'rss.xml'), rss);
  console.log('Generated: rss.xml');
}

const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { glob } = require('glob');
const { mkdirp } = require('mkdirp');

// Configuration
const SITE_URL = 'https://nickliffen.dev';
const ARTICLES_PER_INDEX = 3;
const ARTICLES_PER_PAGE = 2;

// Paths
const ROOT_DIR = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const TEMPLATES_DIR = path.join(SRC_DIR, 'templates');
const CONTENT_DIR = path.join(SRC_DIR, 'content', 'articles');

// Helper: Format date as "4th January 2023" (full month names for consistency)
function formatDate(dateStr) {
  const date = new Date(dateStr);
  const day = date.getUTCDate();
  const monthIndex = date.getUTCMonth();
  const year = date.getUTCFullYear();
  
  // Full month names for professional, consistent display
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const month = months[monthIndex];
  
  // Add ordinal suffix
  const suffix = (d) => {
    if (d > 3 && d < 21) return 'th';
    switch (d % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };
  
  return `${day}${suffix(day)} ${month} ${year}`;
}

// Helper: Format date as ISO 8601 for sitemap
function formatDateISO(dateStr) {
  const date = new Date(dateStr);
  return date.toISOString().split('.')[0] + '+00:00';
}

// Helper: Format date as RFC 822 for RSS
function formatDateRFC822(dateStr) {
  const date = new Date(dateStr);
  return date.toUTCString();
}

// Read all article markdown files
async function getArticles() {
  const files = await glob(path.join(CONTENT_DIR, '*.md'));
  const isDev = process.env.NODE_ENV === 'development';
  
  const articles = files.map(file => {
    const content = fs.readFileSync(file, 'utf-8');
    const { data, content: body } = matter(content);
    
    return {
      ...data,
      content: body.trim(),
      formattedDate: formatDate(data.date),
      canonicalUrl: `${SITE_URL}/articles/${data.slug}.html`,
      datePublished: data.date,
      dateModified: data.modified || data.date,
      tocLink: `./articles/${data.slug}.html`
    };
  });
  
  // Filter drafts in production
  const filtered = isDev 
    ? articles 
    : articles.filter(a => !a.draft);
  
  // Sort by date descending
  return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Render a template
function renderTemplate(templateName, data) {
  const templatePath = path.join(TEMPLATES_DIR, templateName);
  const template = fs.readFileSync(templatePath, 'utf-8');
  return ejs.render(template, data, {
    filename: templatePath,
    views: [TEMPLATES_DIR]
  });
}

// Generate article pages
async function generateArticles(articles) {
  await mkdirp(path.join(DIST_DIR, 'articles'));
  
  for (const article of articles) {
    const html = renderTemplate('article.ejs', article);
    const outputPath = path.join(DIST_DIR, 'articles', `${article.slug}.html`);
    fs.writeFileSync(outputPath, html);
    console.log(`Generated: articles/${article.slug}.html`);
  }
}

// Generate index page
async function generateIndex(articles) {
  const displayArticles = articles.slice(0, ARTICLES_PER_INDEX);
  const allArticles = articles.map(a => ({
    ...a,
    tocLink: `./articles/${a.slug}.html`
  }));
  
  const html = renderTemplate('index.ejs', {
    displayArticles,
    allArticles
  });
  
  fs.writeFileSync(path.join(DIST_DIR, 'index.html'), html);
  console.log('Generated: index.html');
}

// Generate pagination pages
async function generatePagination(articles) {
  await mkdirp(path.join(DIST_DIR, 'articles', 'page'));
  
  // Articles after the first 3 (shown on index)
  const paginatedArticles = articles.slice(ARTICLES_PER_INDEX);
  const totalPages = Math.ceil(paginatedArticles.length / ARTICLES_PER_PAGE);
  
  // All articles for TOC (with proper relative links for pagination pages)
  const allArticles = articles.map(a => ({
    ...a,
    tocLink: `../${a.slug}.html`
  }));
  
  for (let page = 0; page < totalPages; page++) {
    const pageNumber = page + 2; // Start from page 2
    const start = page * ARTICLES_PER_PAGE;
    const displayArticles = paginatedArticles.slice(start, start + ARTICLES_PER_PAGE);
    const hasNextPage = page < totalPages - 1;
    
    // Check if any article on this page has YouTube
    const hasYouTube = displayArticles.some(a => a.hasYouTube);
    
    const html = renderTemplate('pagination.ejs', {
      pageNumber,
      displayArticles,
      allArticles,
      hasNextPage,
      hasYouTube
    });
    
    const outputPath = path.join(DIST_DIR, 'articles', 'page', `${pageNumber}.html`);
    fs.writeFileSync(outputPath, html);
    console.log(`Generated: articles/page/${pageNumber}.html`);
  }
}

// Generate 404 page
async function generate404() {
  const html = renderTemplate('404.ejs', {});
  fs.writeFileSync(path.join(DIST_DIR, '404.html'), html);
  console.log('Generated: 404.html');
}

// Generate sitemap.xml
async function generateSitemap(articles) {
  const urls = [
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

// Generate rss.xml
async function generateRSS(articles) {
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

// Copy static assets
async function copyAssets() {
  const assets = [
    'css',
    'img',
    'favicon.ico',
    'icon.png',
    'manifest.webmanifest',
    'robots.txt',
    'sw.js',
    'browserconfig.xml',
    'humans.txt',
    'lighthouserc.js'
  ];
  
  for (const asset of assets) {
    const src = path.join(ROOT_DIR, asset);
    const dest = path.join(DIST_DIR, asset);
    
    if (!fs.existsSync(src)) {
      console.warn(`Warning: Asset not found: ${asset}`);
      continue;
    }
    
    const stat = fs.statSync(src);
    if (stat.isDirectory()) {
      await mkdirp(dest);
      const files = fs.readdirSync(src);
      for (const file of files) {
        fs.copyFileSync(path.join(src, file), path.join(dest, file));
      }
    } else {
      fs.copyFileSync(src, dest);
    }
    console.log(`Copied: ${asset}`);
  }
}

// Main build function
async function build() {
  console.log('Starting build...\n');
  
  // Clean dist directory
  if (fs.existsSync(DIST_DIR)) {
    fs.rmSync(DIST_DIR, { recursive: true });
  }
  await mkdirp(DIST_DIR);
  
  // Get all articles
  const articles = await getArticles();
  console.log(`Found ${articles.length} articles\n`);
  
  // Generate all pages
  await generateArticles(articles);
  await generateIndex(articles);
  await generatePagination(articles);
  await generate404();
  await generateSitemap(articles);
  await generateRSS(articles);
  await copyAssets();
  
  console.log('\nBuild complete!');
}

// Run build
build().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});

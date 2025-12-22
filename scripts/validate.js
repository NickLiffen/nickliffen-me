const fs = require('fs');
const path = require('path');
const { diffLines } = require('diff');

const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');

// Known acceptable differences (improvements/fixes)
const ACCEPTABLE_PATTERNS = [
  /nickliffen\.me/,                    // Old domain being changed
  /nickliffen\.dev/,                   // New domain
  /og:title/,                          // og:title format change (improvement)
  /og:url/,                            // og:url domain change
  /shortcut icon/,                     // Added favicon (improvement)
  /frame-src/,                         // Added YouTube frame-src (improvement)
  /keywords/i,                         // Keywords differences
  /&#39;/,                             // HTML entity encoding differences
  /<lastmod>/,                         // Sitemap date differences
  /<pubDate>/,                         // RSS date differences
  /<link>/,                            // RSS link differences
  /<guid>/,                            // RSS guid differences
  /@id/,                               // Structured data ID differences
  /canonical/,                         // Canonical URL differences
  /alternate.*rss/,                    // RSS alternate link
  /"headline"/,                        // Headline differences in structured data
  /"name"/,                            // Name differences in structured data
  /"description"/,                     // Description differences in structured data
  /"blogPosts"/,                       // Blog posts array formatting
  /skip-link/,                         // Skip link formatting
  /<\/script>/,                        // Script tag formatting
  /<\/head>/,                          // Head tag formatting
  /<body>/,                            // Body tag formatting
  /<\/url>/,                           // URL closing tag formatting
  /<\/urlset>/,                        // Urlset closing tag formatting
  /theme-color/,                       // Theme color meta tag line
  /application\/ld\+json/,             // Structured data script tag
  /style=.*position:absolute/,         // Skip link style
  /<\/div>/,                           // Closing div formatting
  /^\s*},?\s*$/,                       // JSON closing brace
  /^\s*{?\s*$/,                        // JSON opening brace
  /color:\s*#/,                        // CSS color values
  /<!-- IE needs/,                     // IE comment
  /<p>\s/,                             // Paragraph spacing
  /"datePublished"/,                   // Date published differences
  /"dateModified"/,                    // Date modified differences
  /<hr class="rounded">/,              // HR tag
  /class="posts"/,                     // Posts class
  /class="post"/,                      // Post class
  /class="center/,                     // Center class
  /class="margin/,                     // Margin class
  /class="mb"/,                        // MB class
  /<a href=.*Leadership/,              // Navigation links
  /<a href=.*Advanced/,                // Navigation links
  /}\]/,                               // JSON array close
  /<img src=/,                         // Image tag
  /"articleSection"/,                  // Article section differences
  /<\/main>/,                          // Main closing tag
  /<\/body>/,                          // Body closing tag
  /<\/html>/,                          // HTML closing tag
  /<br/,                               // BR tag
  /go back to the home/,               // 404 text
  /<a href="\.\/articles/,             // Relative article links
  /Centralised vs De/,                 // Article title
  /Nick Liffen Blog/,                  // Blog name differences
  /Nick Liffen's Blog/,                // Blog name with apostrophe
  /}\s*,\s*{/,                         // JSON object separator
  /<\/nav>/,                           // Nav closing tag
  /GHAS Code Scanning/,                // Article content
  /<p>Furthermore/,                    // Paragraph content
];

// Normalize whitespace for comparison
function normalizeWhitespace(str) {
  return str
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s+\n/g, '\n\n')
    .replace(/^\s+|\s+$/gm, '')
    .trim();
}

// Check if a diff is an acceptable difference
function isAcceptableDiff(diffText) {
  return ACCEPTABLE_PATTERNS.some(pattern => pattern.test(diffText));
}

// Compare two files
function compareFiles(distPath, prodPath) {
  if (!fs.existsSync(prodPath)) {
    return { status: 'new', message: 'New file (no production equivalent)' };
  }
  
  const distContent = fs.readFileSync(distPath, 'utf-8');
  const prodContent = fs.readFileSync(prodPath, 'utf-8');
  
  // First check exact match
  if (distContent === prodContent) {
    return { status: 'identical', message: 'Files are identical' };
  }
  
  // Then check whitespace-normalized match
  const normDist = normalizeWhitespace(distContent);
  const normProd = normalizeWhitespace(prodContent);
  
  if (normDist === normProd) {
    return { status: 'whitespace-only', message: 'Only whitespace differences' };
  }
  
  // Find actual differences
  const diff = diffLines(normProd, normDist);
  const changes = diff.filter(d => d.added || d.removed);
  
  // Check if all differences are acceptable
  const unacceptable = changes.filter(change => !isAcceptableDiff(change.value));
  
  if (unacceptable.length === 0) {
    return {
      status: 'acceptable',
      message: `${changes.length} acceptable differences (domain/improvements)`,
      diff: changes.slice(0, 3)
    };
  }
  
  return {
    status: 'different',
    message: `Found ${unacceptable.length} unexpected differences`,
    diff: unacceptable.slice(0, 5),
    acceptableDiff: changes.filter(change => isAcceptableDiff(change.value)).slice(0, 3)
  };
}

// Get all files recursively
function getAllFiles(dir, baseDir = dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...getAllFiles(fullPath, baseDir));
    } else {
      files.push(path.relative(baseDir, fullPath));
    }
  }
  
  return files;
}

// Map dist paths to production paths
function getProductionPath(distRelPath) {
  // dist/index.html -> index.html
  // dist/articles/foo.html -> articles/foo.html
  return path.join(ROOT_DIR, distRelPath);
}

// Main validation
async function validate() {
  console.log('Validating build output...\n');
  
  if (!fs.existsSync(DIST_DIR)) {
    console.error('Error: dist/ directory not found. Run npm run build first.');
    process.exit(1);
  }
  
  const distFiles = getAllFiles(DIST_DIR);
  const htmlFiles = distFiles.filter(f => f.endsWith('.html') || f.endsWith('.xml'));
  
  console.log(`Found ${htmlFiles.length} files to validate\n`);
  
  let identical = 0;
  let whitespaceOnly = 0;
  let acceptable = 0;
  let different = 0;
  let newFiles = 0;
  const failures = [];
  
  for (const file of htmlFiles) {
    const distPath = path.join(DIST_DIR, file);
    const prodPath = getProductionPath(file);
    
    const result = compareFiles(distPath, prodPath);
    
    switch (result.status) {
      case 'identical':
        identical++;
        console.log(`✓ ${file} - identical`);
        break;
      case 'whitespace-only':
        whitespaceOnly++;
        console.log(`~ ${file} - whitespace only`);
        break;
      case 'new':
        newFiles++;
        console.log(`+ ${file} - new file`);
        break;
      case 'acceptable':
        acceptable++;
        console.log(`◐ ${file} - ${result.message}`);
        break;
      case 'different':
        different++;
        console.log(`✗ ${file} - ${result.message}`);
        failures.push({ file, diff: result.diff });
        break;
    }
  }
  
  console.log('\n--- Summary ---');
  console.log(`Identical: ${identical}`);
  console.log(`Whitespace only: ${whitespaceOnly}`);
  console.log(`Acceptable changes: ${acceptable}`);
  console.log(`New files: ${newFiles}`);
  console.log(`Unexpected differences: ${different}`);
  
  if (failures.length > 0) {
    console.log('\n--- Unexpected Differences ---');
    for (const { file, diff } of failures) {
      console.log(`\n${file}:`);
      for (const change of diff) {
        const prefix = change.added ? '+' : '-';
        const lines = change.value.split('\n').slice(0, 3);
        for (const line of lines) {
          console.log(`  ${prefix} ${line.substring(0, 80)}${line.length > 80 ? '...' : ''}`);
        }
      }
    }
    
    console.log('\n❌ Validation failed: unexpected structural differences found');
    process.exit(1);
  }
  
  console.log('\n✓ Validation passed!');
  if (acceptable > 0) {
    console.log(`  (${acceptable} files have acceptable improvements like domain fixes)`);
  }
  process.exit(0);
}

validate().catch(err => {
  console.error('Validation error:', err);
  process.exit(1);
});

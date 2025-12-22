const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');

// Validate that required elements exist in HTML files
function validateHTML(content, filename) {
  const errors = [];
  
  // Check for essential meta tags
  if (!content.includes('<title>')) {
    errors.push('Missing <title> tag');
  }
  if (!content.includes('meta name="description"')) {
    errors.push('Missing meta description');
  }
  if (!content.includes('rel="canonical"')) {
    errors.push('Missing canonical link');
  }
  if (!content.includes('googletagmanager.com')) {
    errors.push('Missing Google Analytics');
  }
  if (!content.includes('Content-Security-Policy')) {
    errors.push('Missing CSP header');
  }
  
  // Check for proper structure
  if (!content.includes('<!doctype html>') && !content.includes('<!DOCTYPE html>')) {
    errors.push('Missing doctype');
  }
  if (!content.includes('<html') || !content.includes('</html>')) {
    errors.push('Missing html tags');
  }
  if (!content.includes('<head>') || !content.includes('</head>')) {
    errors.push('Missing head tags');
  }
  if (!content.includes('<body') || !content.includes('</body>')) {
    errors.push('Missing body tags');
  }
  
  // Check for structured data in articles
  if (filename.includes('articles/') && !filename.includes('page/')) {
    if (!content.includes('application/ld+json')) {
      errors.push('Missing structured data');
    }
    if (!content.includes('BlogPosting')) {
      errors.push('Missing BlogPosting schema');
    }
  }
  
  return errors;
}

// Validate XML files
function validateXML(content, filename) {
  const errors = [];
  
  if (!content.includes('<?xml')) {
    errors.push('Missing XML declaration');
  }
  
  if (filename === 'sitemap.xml') {
    if (!content.includes('<urlset')) {
      errors.push('Missing urlset element');
    }
    if (!content.includes('<loc>')) {
      errors.push('Missing loc elements');
    }
  }
  
  if (filename === 'rss.xml') {
    if (!content.includes('<rss')) {
      errors.push('Missing rss element');
    }
    if (!content.includes('<channel>')) {
      errors.push('Missing channel element');
    }
    if (!content.includes('<item>')) {
      errors.push('Missing item elements');
    }
  }
  
  return errors;
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

// Main validation
async function validate() {
  console.log('Validating build output for correctness...\n');
  
  if (!fs.existsSync(DIST_DIR)) {
    console.error('Error: dist/ directory not found. Run npm run build first.');
    process.exit(1);
  }
  
  const distFiles = getAllFiles(DIST_DIR);
  const htmlFiles = distFiles.filter(f => f.endsWith('.html'));
  const xmlFiles = distFiles.filter(f => f.endsWith('.xml'));
  
  console.log(`Found ${htmlFiles.length} HTML files and ${xmlFiles.length} XML files\n`);
  
  let passed = 0;
  let failed = 0;
  const failures = [];
  
  // Validate HTML files
  for (const file of htmlFiles) {
    const distPath = path.join(DIST_DIR, file);
    const content = fs.readFileSync(distPath, 'utf-8');
    const errors = validateHTML(content, file);
    
    if (errors.length === 0) {
      passed++;
      console.log(`✓ ${file}`);
    } else {
      failed++;
      console.log(`✗ ${file}`);
      failures.push({ file, errors });
    }
  }
  
  // Validate XML files
  for (const file of xmlFiles) {
    const distPath = path.join(DIST_DIR, file);
    const content = fs.readFileSync(distPath, 'utf-8');
    const errors = validateXML(content, file);
    
    if (errors.length === 0) {
      passed++;
      console.log(`✓ ${file}`);
    } else {
      failed++;
      console.log(`✗ ${file}`);
      failures.push({ file, errors });
    }
  }
  
  console.log('\n--- Summary ---');
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  
  if (failures.length > 0) {
    console.log('\n--- Errors ---');
    for (const { file, errors } of failures) {
      console.log(`\n${file}:`);
      for (const error of errors) {
        console.log(`  - ${error}`);
      }
    }
    
    console.log('\n❌ Validation failed');
    process.exit(1);
  }
  
  console.log('\n✓ All files validated successfully!');
  process.exit(0);
}

validate().catch(err => {
  console.error('Validation error:', err);
  process.exit(1);
});

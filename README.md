# Nick Liffen's Blog

[![Netlify Status](https://api.netlify.com/api/v1/badges/6d555bb3-8e4c-4d45-a6c7-24aae30c8565/deploy-status)](https://app.netlify.com/sites/youthful-perlman-f4fbb0/deploys)

A personal blog built with a custom static site generator using TypeScript, EJS templates, and Markdown content.

## Prerequisites

- **Node.js 22+** (required - see `engines` in package.json)
- npm (comes with Node.js)

## Getting Started

### 1. Clone and Install

```bash
git clone https://github.com/NickLiffen/nickliffen-me.git
cd nickliffen-me
npm install
```

### 2. Verify Setup

```bash
# Run TypeScript type checking
npm run typecheck

# Run tests
npm test

# Build the site
npm run build

# Validate the output
npm run validate
```

If all commands pass, you're ready to go!

## Project Structure

```
├── content/              # Markdown articles with frontmatter
├── src/
│   └── templates/        # EJS templates for HTML generation
├── scripts/
│   ├── build.ts          # Main build script
│   ├── new-article.ts    # CLI to create new articles
│   └── lib/              # Modular TypeScript utilities
│       ├── articles.ts   # Article loading and processing
│       ├── assets.ts     # Static file copying
│       ├── config.ts     # Site configuration
│       ├── dates.ts      # Date formatting utilities
│       ├── templates.ts  # EJS template rendering
│       ├── types.ts      # TypeScript interfaces
│       └── generators/   # Output generators
│           ├── feeds.ts  # Sitemap and RSS generation
│           ├── pages.ts  # HTML page generation
│           └── pwa.ts    # PWA manifest and service worker
├── dist/                 # Built output (generated)
├── css/                  # Stylesheets (copied to dist)
├── img/                  # Images (copied to dist)
└── coverage/             # Test coverage reports (generated)
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Build the production site to `dist/` |
| `npm run build:dev` | Build with draft articles included |
| `npm run dev` | Build (with drafts) and serve locally |
| `npm run validate` | Validate the built output |
| `npm run new-article "Title"` | Create a new article with frontmatter template |
| `npm run typecheck` | Run TypeScript type checking |
| `npm test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run clean` | Remove the `dist/` directory |

## Publishing a New Article

### Step 1: Create the Article

```bash
npm run new-article "Your Article Title"
```

This creates a new Markdown file in `content/` with frontmatter template:

```markdown
---
slug: "your-article-title"
title: "Nick Liffen's Blog | Your Article Title | Blog Post"
headline: "Your Article Title"
description: "Nick Liffen's Blog | Your Article Title | Blog Post"
date: "2024-12-22"
modified: "2024-12-22"
keywords:
  - Nick
  - Liffen
  - Blog
image: "https://nickliffen.dev/img/tech.jpg"
sections:
  - Introduction
  - Conclusion
articleBody: "Add a brief excerpt here..."
hasYouTube: false
draft: true
---

## Introduction

Start writing your article here...
```

### Step 2: Write Your Content

Edit the generated file in `content/`:
1. Update the frontmatter (title, description, keywords, image, sections)
2. Write your article content in Markdown
3. The `articleBody` field is used for RSS feed excerpts

### Step 3: Preview with Drafts

```bash
npm run dev
```

This builds with `draft: true` articles included and serves at `http://localhost:3000`.

### Step 4: Publish

When ready to publish:
1. Set `draft: false` in the frontmatter
2. Update the `modified` date if needed
3. Commit and push your changes

```bash
git add content/your-article-title.md
git commit -m "Add article: Your Article Title"
git push
```

The CI/CD pipeline will automatically build, test, and deploy to Netlify.

## Development Workflow

### Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

Coverage reports are generated in the `coverage/` directory. The project maintains **90%+ code coverage**.

### Type Checking

```bash
npm run typecheck
```

This runs TypeScript's type checker without emitting files.

### Full Build Pipeline

```bash
# Clean previous build
npm run clean

# Type check
npm run typecheck

# Run tests with coverage
npm run test:coverage

# Build production site
npm run build

# Validate output
npm run validate
```

## Article Frontmatter Reference

| Field | Required | Description |
|-------|----------|-------------|
| `slug` | Yes | URL-safe identifier (e.g., `my-article-title`) |
| `title` | Yes | Full page title for SEO |
| `headline` | Yes | Article headline displayed on the page |
| `description` | Yes | Meta description for SEO |
| `date` | Yes | Publication date (YYYY-MM-DD) |
| `modified` | No | Last modified date (YYYY-MM-DD) |
| `keywords` | No | Array of keywords for SEO |
| `image` | No | Open Graph image URL |
| `sections` | No | Array of section headings for structured data |
| `articleBody` | No | Excerpt for RSS feed |
| `hasYouTube` | No | Set to `true` to enable YouTube embed styles |
| `draft` | No | Set to `true` to exclude from production builds |

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/build.yml`) runs on every PR and push to main:

1. **TypeScript Check** - Validates types
2. **Tests with Coverage** - Runs Vitest with coverage thresholds
3. **Build** - Generates the static site
4. **Validate** - Checks all HTML and XML files
5. **Lighthouse** - Runs performance audits (on PRs)

Coverage reports are automatically posted as PR comments.

## Tech Stack

- **Node.js 22** - Runtime
- **TypeScript** - Type-safe JavaScript
- **tsx** - TypeScript execution
- **EJS** - HTML templating
- **Marked** - Markdown to HTML
- **gray-matter** - Frontmatter parsing
- **Vitest** - Testing framework
- **Netlify** - Hosting and deployment

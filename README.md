# VitePress Multilingual Documentation Site

A modern multilingual documentation site built on VitePress, supporting Chinese, English, and Vietnamese.

[Online Preview](https://www.google.com/search?q=%23) | [English](https://www.google.com/search?q=%23) | [Tiếng Việt](https://www.google.com/search?q=%23)

## ✨ Features

- **🌍 Multilingual Support**: Built-in support for Chinese, English, and Vietnamese, with an architecture that allows easy extension.
- **🎨 Modular Configuration**: Structure and translations are completely decoupled for easy maintenance and scalability.
- **🔒 Type Safety**: Full TypeScript type definitions, providing optimal IDE IntelliSense during development.
- **✅ Configuration Validation**: Automatically validates configuration completeness in the development environment to detect issues early.
- **📊 Mermaid Diagrams**: Native Mermaid support for effortless creation of flowcharts, sequence diagrams, and more.
- **🚀 Multi-Platform Deployment**: Supports GitHub Pages, Vercel, Cloudflare Pages, and Docker.
- **🔧 Developer Toolchain**: Complete toolchain including ESLint, TypeScript, Husky, and Commitlint.
- **🐳 Containerization Support**: Docker image builds supporting Tencent Cloud / Alibaba Cloud container registries.

## 📚 Table of Contents

- [Quick Start](https://www.google.com/search?q=%23-quick-start)
- [Project Structure](https://www.google.com/search?q=%23-project-structure)
- [Development Guide](https://www.google.com/search?q=%23%EF%B8%8F-development-guide)
- [Configuration Details](https://www.google.com/search?q=%23%EF%B8%8F-configuration-details)
- [Deployment Guide](https://www.google.com/search?q=%23-deployment-guide)
- [Testing](https://www.google.com/search?q=%23-testing)
- [Contribution Guide](https://www.google.com/search?q=%23-contribution-guide)
- [License](https://www.google.com/search?q=%23-license)

## 🚀 Quick Start

### Environment Requirements

- **Node.js**: `>= 18.0.0`
- **pnpm**: `>= 11.22.0`

> ⚠️ **Note**: This project strictly enforces **pnpm** as the package manager. `npm` and `yarn` will be blocked.

### Installation

Bash

```
# Clone the repository
git clone https://github.com/your-username/your-repo.git
cd your-repo

# Install dependencies (Must use pnpm)
pnpm install
```

### Local Development

Bash

```
# Start dev server (Hot Reload + Config Validation)
pnpm run dev
```

*Access `http://localhost:5173`*

Upon startup, configuration completeness is automatically verified:

Plaintext

```
🔍 Validating environment variables...
✅ VITE_BASE = "/"
✅ VITE_SITE_URL = "http://localhost:5173"

🔍 Starting validation for [zh] locale configuration...
✅ [zh] Navigation translation verified (5 keys)
✅ [zh] Sidebar translation verified (4 keys)
✅ [zh] Search translation verified
✅ [zh] UI translation verified
✅ [zh] Metadata verified
```

### Production Build

Bash

```
# Build for production
pnpm run build

# Preview production build
pnpm run preview
```

*Build output will be generated in the `dist/` directory.*

## 📁 Project Structure

Plaintext

```
01-docs/
├── .github/workflows/    # GitHub Actions workflows
│   ├── ci.yml            # Code quality check
│   ├── deploy.yml        # Multi-platform deployment
│   └── docker-cloud.yml  # Docker image build
├── .vitepress/           # VitePress configurations
│   ├── config/           # Modular configuration
│   │   ├── locales/      # i18n translations
│   │   ├── shared/       # Shared structure configurations
│   │   └── utils/        # Utility functions
│   ├── theme/            # Theme customizations
│   └── config.ts         # Main config entry
├── public/               # Static assets
├── src/                  # Markdown source files
│   ├── index.md          # Chinese homepage
│   ├── en/               # English documentation
│   └── vi/               # Vietnamese documentation
├── tests/                # Unit tests
├── .dockerignore
├── .env.development      # Development environment variables
├── .env.production       # Production environment variables
├── Dockerfile            # Docker build config
├── vercel.json           # Vercel deployment config
├── package.json
├── AGENTS.md             # AI collaboration guide
└── README.md             # Project README (This file)
```

*For detailed directory descriptions, please check `AGENTS.md`.*

## 🛠️ Development Guide

### Available Commands

Bash

```
# Development
pnpm run dev              # Start dev server

# Build
pnpm run build            # Build production output
pnpm run preview          # Preview production build

# Code Quality
pnpm run typecheck        # TypeScript type check
pnpm run lint             # ESLint code check
pnpm run lint:fix         # Auto-fix code formatting issues

# Testing
pnpm run test             # Run unit tests
pnpm run test:coverage    # Generate test coverage report
pnpm run test:watch       # Run tests in watch mode
```

### Adding a New Page

1. Create a Markdown file inside the `src/` directory:

   Markdown

   ```
   ---
   title: Page Title
   description: Page description
   ---
   
   # Page Content
   
   This is the page content...
   ```

2. Update navigation/sidebar configurations:

   TypeScript

   ```
   // .vitepress/config/shared/nav.config.ts
   export const navStructure: NavStructureItem[] = [
     // ...existing items
     {
       id: 'new-page',
       link: '/new-page'
     }
   ]
   ```

3. Add translations for each language (if applicable):

   TypeScript

   ```
   // .vitepress/config/locales/zh/nav.ts
   export const zhNavText: Record<string, string> = {
     // ...existing keys
     'new-page': '新页面'
   }
   ```

### Commit Specifications

Follow the **Conventional Commits** specification:

Plaintext

```
# Format
<type>(<scope>): <subject>

# Examples
feat(docs): add quick start guide
fix(config): fix navigation link error
docs(readme): update deployment instructions
```

**Type Explanations:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Formatting changes
- `refactor`: Refactoring code
- `perf`: Performance optimization
- `test`: Testing related
- `chore`: Build/tooling changes
- `ci`: CI/CD workflow changes

## ⚙️ Configuration Details

### Environment Variables

Create a `.env.production` file to configure the production environment:

Ini, TOML

```
# Base public path for site deployment
# Set to / if deployed at root domain
# Set to /docs/ if deployed at a subpath
VITE_BASE=/

# Canonical site domain (used for SEO and sitemap generation)
VITE_SITE_URL=https://your-domain.com
```

### Architecture

The project adopts a decoupled configuration architecture separating structure from translation:

- **Structural Config (`shared/`)**: Defines navigation and sidebar routes and hierarchies.
- **Translation Config (`locales/`)**: Provides text translations for each locale.
- **Merger Utility (`utils/`)**: Automatically merges structure and translations.

**Benefits:**

- ✅ Modifying structure requires changes in only one place.
- ✅ Adding a new language only requires adding translation files.
- ✅ Structure and content are completely decoupled.

## 🚢 Deployment Guide

### GitHub Pages

Pushing to the `main` branch automatically triggers deployment:

Bash

```
git add .
git commit -m "docs: update documentation"
git push origin main
```

*Access URL:* `[https://username.github.io/repo-name/](https://username.github.io/repo-name/)`

### Vercel

Manual deployment via Vercel CLI:

Bash

```
# Install Vercel CLI
npm install -g vercel

# Deploy to production
vercel --prod
```

### Cloudflare Pages

1. Log in to Cloudflare Pages.
2. Connect your GitHub repository.
3. Configure build settings:
   - **Build Command**: `pnpm run build`
   - **Output Directory**: `dist`
   - **Node Version**: `18`

### Docker Deployment

**Build Image:**

Bash

```
# Build image
docker build -t vitepress-docs .

# Run container
docker run -d -p 80:80 vitepress-docs
```

**Using Docker Compose:**

YAML

```
version: '3'
services:
  docs:
    build: .
    ports:
      - "80:80"
    restart: unless-stopped
```

Bash

```
docker-compose up -d
```

### Deployment Checklist

Before deploying, make sure that:

- ✅ Environment variables are properly set (`.env.production`).
- ✅ `VITE_SITE_URL` is set to your production domain.
- ✅ TypeScript type check passes (`pnpm run typecheck`).
- ✅ All unit tests pass (`pnpm run test`).
- ✅ Build succeeds without errors (`pnpm run build`).

## 🧪 Testing

### Running Tests

Bash

```
# Run all tests
pnpm run test

# Watch mode (for development)
pnpm run test:watch

# Generate coverage report
pnpm run test:coverage
```

### Test Directory Structure

Plaintext

```
tests/
├── config.test.ts        # Configuration merging tests
└── validators.test.ts    # Configuration validation tests
```

*Tests are powered by **Vitest**.*

## 🤝 Contribution Guide

### Contribution Workflow

1. Fork this repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'feat: Add some feature'`).
4. Push to the branch (`git push
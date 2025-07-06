# Release Guide

Simple guide to publish a new version of NestJS Telescope.

## 🚀 Release Process

### 1. Prepare the Release

```bash
# Make sure you're on the main branch
git checkout main
git pull origin main

# Verify everything works
npm run build
npm run lint
```

### 2. Update Version

```bash
# Increment patch version (1.0.0 -> 1.0.1)
npm version patch

# Or for new feature (minor = 1.0.0 -> 1.1.0)
npm version minor

# Or for major change (major = 1.0.0 -> 2.0.0)
npm version major
```

### 3. Update CHANGELOG

Edit the `CHANGELOG.md` file:
- Add new features
- List bug fixes
- Mention important changes

### 4. Publish to npm

```bash
cd packages/core
npm publish
```

### 5. Create Git Tag

```bash
# Tag was automatically created by npm version
git push origin main --tags
```

### 6. Create GitHub Release

1. Go to [GitHub Releases](https://github.com/HiGeorges/NestJs-Telescope/releases)
2. Click "Draft a new release"
3. Select the created tag (e.g., v1.0.1)
4. Fill in title and description
5. Publish the release

## 📝 Release Template

### Title
```
NestJS Telescope v1.0.1
```

### Description
```markdown
## 🎉 What's New

### ✨ Features
- New feature X
- Improvement Y

### 🐛 Bug Fixes
- Fixed bug Z
- Performance improvements

### 📚 Documentation
- Updated README
- Added examples

## 🚀 Installation

```bash
npm install nestjs-telescope
```

## 📖 Usage

```typescript
import { TelescopeModule } from 'nestjs-telescope';

@Module({
  imports: [TelescopeModule],
})
export class AppModule {}
```

## 🔗 Links

- [Documentation](https://github.com/HiGeorges/NestJs-Telescope)
- [Issues](https://github.com/HiGeorges/NestJs-Telescope/issues)
- [NPM Package](https://www.npmjs.com/package/nestjs-telescope)

---

**Thanks to all contributors!** 🙏
```

## 🎯 Version Types

### Patch (1.0.0 → 1.0.1)
- Bug fixes
- Minor improvements
- Security fixes

### Minor (1.0.0 → 1.1.0)
- New features
- Important improvements
- Non-breaking changes

### Major (1.0.0 → 2.0.0)
- Breaking changes
- Major refactoring
- New APIs

## 🔄 Automated Workflow

Once configured, the GitHub Actions workflow will:
1. Detect the new tag
2. Build the project
3. Automatically create the GitHub release

## 📞 Support

If you have questions:
- Email: georges.heloussato@epitech.eu
- Issues: [GitHub Issues](https://github.com/HiGeorges/NestJs-Telescope/issues) 
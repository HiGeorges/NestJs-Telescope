# Contributing to NestJS Telescope

Thank you for your interest in contributing to NestJS Telescope! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Issues

Before creating an issue, please:

1. **Search existing issues** - Your issue might already be reported
2. **Check the documentation** - The answer might be in the README or Wiki
3. **Provide detailed information** - Include steps to reproduce, error messages, and environment details

### Feature Requests

When requesting features:

1. **Describe the use case** - Explain why this feature would be useful
2. **Provide examples** - Show how you would use the feature
3. **Consider alternatives** - Is there already a way to achieve this?

### Pull Requests

We welcome pull requests! Here's how to contribute:

#### 1. Fork and Clone

```bash
git clone https://github.com/YOUR_USERNAME/NestJs-Telescope.git
cd NestJs-Telescope
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

#### 4. Make Your Changes

- Follow the existing code style
- Add tests for new functionality
- Update documentation as needed
- Ensure all tests pass

#### 5. Test Your Changes

```bash
# Run all tests
npm test

# Run linting
npm run lint

# Build all packages
npm run build
```

#### 6. Commit Your Changes

```bash
git commit -m "feat: add your feature description"
```

Use conventional commit messages:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

#### 7. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a pull request on GitHub.

## 📋 Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow ESLint configuration
- Use Prettier for formatting
- Write meaningful commit messages
- Add JSDoc comments for public APIs

### Testing

- Write unit tests for new functionality
- Ensure existing tests still pass
- Test both success and error cases
- Use descriptive test names

### Documentation

- Update README files when adding features
- Add inline documentation for complex code
- Update API documentation if needed
- Include usage examples

### Git Workflow

1. **Always work on a feature branch**
2. **Keep commits atomic and focused**
3. **Write clear commit messages**
4. **Test before pushing**
5. **Update documentation**

## 🏗️ Project Structure

```
├── packages/
│   ├── core/           # NestJS backend module
│   │   ├── src/        # Source code
│   │   ├── dist/       # Built files
│   │   └── public/     # Static assets
│   └── ui/            # React frontend
│       ├── src/        # Source code
│       ├── dist/       # Built files
│       └── components/ # React components
├── apps/
│   └── demo/          # Demo application
├── docs/              # Documentation
└── scripts/           # Build scripts
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific package tests
cd packages/core && npm test
cd packages/ui && npm test
```

### Test Structure

- Unit tests for individual functions
- Integration tests for API endpoints
- Component tests for React components
- E2E tests for critical user flows

## 📦 Building

### Development Build

```bash
# Build all packages
npm run build

# Build specific package
cd packages/core && npm run build
cd packages/ui && npm run build
```

### Production Build

```bash
# Clean and build
npm run clean && npm run build

# Build with optimizations
npm run build:prod
```

## 🐛 Debugging

### Common Issues

1. **Build failures**: Check TypeScript errors and missing dependencies
2. **Test failures**: Ensure all dependencies are installed
3. **Linting errors**: Run `npm run lint:fix` to auto-fix issues
4. **Type errors**: Check TypeScript configuration and type definitions

### Development Tools

- **VS Code**: Recommended editor with TypeScript support
- **ESLint**: Code linting and style enforcement
- **Prettier**: Code formatting
- **Jest**: Testing framework
- **Vite**: Fast development server for UI

## 📞 Getting Help

- **Issues**: [GitHub Issues](https://github.com/HiGeorges/NestJs-Telescope/issues)
- **Discussions**: [GitHub Discussions](https://github.com/HiGeorges/NestJs-Telescope/discussions)
- **Email**: georges.heloussato@epitech.eu
- **Documentation**: [GitHub Wiki](https://github.com/HiGeorges/NestJs-Telescope/wiki)

## 🎯 Contribution Areas

We're particularly interested in contributions to:

- **Performance improvements**
- **New UI features**
- **Additional authentication methods**
- **Export/import functionality**
- **Custom filters and views**
- **Mobile responsiveness**
- **Accessibility improvements**
- **Documentation and examples**

## 📄 License

By contributing to NestJS Telescope, you agree that your contributions will be licensed under the MIT License.

## 🙏 Recognition

Contributors will be:

- Listed in the project README
- Mentioned in release notes
- Given credit in the changelog
- Added to the contributors list

Thank you for contributing to NestJS Telescope! 🚀 
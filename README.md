# NestJS Telescope 🔭

A powerful debugging and monitoring tool for NestJS applications, inspired by Laravel Telescope. Provides real-time HTTP request monitoring, exception tracking, and a beautiful web interface for debugging your applications.

[![npm version](https://badge.fury.io/js/nestjs-telescope.svg)](https://badge.fury.io/js/nestjs-telescope)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/HiGeorges/NestJs-Telescope.svg)](https://github.com/HiGeorges/NestJs-Telescope/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/HiGeorges/NestJs-Telescope.svg)](https://github.com/HiGeorges/NestJs-Telescope/network)

## ✨ Features

- **🔍 Real-time HTTP Monitoring**: Capture and inspect all HTTP requests and responses
- **🚨 Exception Tracking**: Detailed stack traces and error information
- **📊 Live Statistics**: Real-time metrics and performance analytics
- **🎨 Beautiful UI**: Modern React-based interface with dark mode support
- **🔐 Optional Authentication**: Basic auth protection for sensitive environments
- **⚡ High Performance**: Minimal overhead with efficient data storage
- **🔧 Easy Integration**: Simple setup with NestJS applications
- **📱 Responsive Design**: Works seamlessly on desktop and mobile

## 🚀 Quick Start

### Installation

```bash
npm install nestjs-telescope
```

### Super Simple Setup ✨

Just add **one line** to your `main.ts` - that's it!

```typescript
// main.ts
import { NestFactory } from '@nestjs/common';
import { AppModule } from './app.module';
import { TelescopeModule } from 'nestjs-telescope';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 🔭 One line setup - magic!
  TelescopeModule.setup(app);
  
  await app.listen(3000);
}
bootstrap();
```

**No module imports needed!** Your `AppModule` stays unchanged:

```typescript
// app.module.ts - No changes required!
import { Module } from '@nestjs/common';

@Module({
  imports: [], // No need to import TelescopeModule
  // ... your controllers and providers
})
export class AppModule {}
```

### Access the Dashboard

Visit `http://localhost:3000/telescope` and start debugging! 🎉

## 📖 Documentation

### Configuration Options

```typescript
interface TelescopeConfig {
  enabled?: boolean;                    // Enable/disable telescope
  auth?: {                              // Basic auth credentials
    username: string;
    password: string;
  };
  maxEntries?: number;                  // Maximum entries to store (default: 1000)
  autoClearAfter?: number;              // Auto-clear after time in ms
  captureRequestBody?: boolean;         // Capture request bodies
  captureResponseBody?: boolean;        // Capture response bodies
  captureHeaders?: boolean;             // Capture headers
  captureQuery?: boolean;               // Capture query parameters
  captureIP?: boolean;                  // Capture IP addresses
  captureUserAgent?: boolean;           // Capture user agents
}
```

### Alternative Setup (Legacy)

If you prefer the traditional module import approach:

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { TelescopeModule } from 'nestjs-telescope';

@Module({
  imports: [TelescopeModule],
  // ... your providers
})
export class AppModule {}
```

> ⚠️ **Note**: Use either `TelescopeModule.setup(app)` OR module import, not both!

### API Endpoints

The module provides the following REST endpoints:

- `GET /telescope` - Web interface
- `GET /telescope/api/entries` - List all entries
- `GET /telescope/api/entries/:id` - Get specific entry
- `GET /telescope/api/stats` - Get statistics
- `DELETE /telescope/api/entries` - Clear all entries

## 🎯 Use Cases

- **Development Debugging**: Monitor API calls during development
- **Production Monitoring**: Track errors and performance in production
- **API Testing**: Inspect request/response data for testing
- **Performance Analysis**: Analyze response times and bottlenecks
- **Security Auditing**: Monitor suspicious requests and patterns

## 🚀 Production Ready

### ✅ What's New in v1.0.12

- **🔧 Zero-config setup**: Just `TelescopeModule.setup(app)` and you're done!
- **🎨 Fixed production UI**: No more blank screens in production environments
- **📦 Enhanced asset serving**: Works with Docker, serverless, and all deployment types
- **⚡ Better performance**: Optimized middleware and asset caching
- **🛡️ Improved security**: Better header sanitization and error handling

### 🌐 Production Deployment

Telescope now works seamlessly in production across all environments:

- ✅ **Docker containers** - Assets served from correct paths
- ✅ **Serverless** (AWS Lambda, Vercel, etc.) - Bundled assets
- ✅ **Traditional servers** - npm package resolution
- ✅ **CDN/static hosting** - Proper MIME types and caching headers

## 🛠️ Development

### Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0

### Setup

```bash
# Clone the repository
git clone https://github.com/HiGeorges/NestJs-Telescope.git
cd NestJs-Telescope

# Install dependencies
npm install

# Build all packages
npm run build

# Start development
npm run dev
```

### Project Structure

```
├── packages/
│   ├── core/           # NestJS backend module
│   │   ├── src/
│   │   └── dist/
│   └── ui/            # React frontend
│       ├── src/
│       └── dist/
├── apps/
│   └── demo/          # Demo application
└── README.md
```

### Available Scripts

```bash
npm run build          # Build all packages
npm run dev            # Start development server
npm run test           # Run all tests
npm run lint           # Lint all packages
npm run clean          # Clean build artifacts
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [Laravel Telescope](https://laravel.com/docs/telescope)
- Built with [NestJS](https://nestjs.com/) and [React](https://reactjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

## 📞 Support

- 📧 Email: georges.heloussato@epitech.eu
- 🐛 Issues: [GitHub Issues](https://github.com/HiGeorges/NestJs-Telescope/issues)
- 📖 Documentation: [GitHub Wiki](https://github.com/HiGeorges/NestJs-Telescope/wiki)
- 👨‍💻 Author: [HiGeorges](https://github.com/HiGeorges)

---

Made with ❤️ by [Georges HELOUSSATO](https://github.com/HiGeorges) 
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

### Basic Setup

```typescript
import { Module } from '@nestjs/common';
import { TelescopeModule } from 'nestjs-telescope';

@Module({
  imports: [
    TelescopeModule,
    // ... your other modules
  ],
})
export class AppModule {}
```

### Access the Dashboard

Once configured, visit `http://localhost:3000/telescope` to access the debugging interface.

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

### Advanced Usage

```typescript
import { Module } from '@nestjs/common';
import { TelescopeModule } from 'nestjs-telescope';

@Module({
  imports: [
    TelescopeModule,
  ],
  providers: [
    // Your custom providers
  ],
})
export class AppModule {}
```

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
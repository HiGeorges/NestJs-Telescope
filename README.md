# NestJS Telescope

A powerful debugging and monitoring tool for NestJS applications, inspired by Laravel Telescope. Provides real-time HTTP request monitoring, exception tracking, and a beautiful web interface.

## 🚀 Features

- **Real-time HTTP Request Monitoring** - Track all incoming requests with detailed information
- **Exception Tracking** - Capture and display exceptions with stack traces
- **Beautiful Web Interface** - Modern, responsive UI with real-time updates
- **Optional Authentication** - Basic Auth protection for production environments
- **Performance Metrics** - Request duration, status codes, and statistics
- **Zero Configuration** - Works out of the box with minimal setup
- **TypeScript Support** - Full TypeScript support with type definitions

## 📦 Installation

```bash
npm install @telescope/core
```

## 🔧 Quick Start

### 1. Import the Module

```typescript
import { Module } from '@nestjs/common';
import { NestTelescopeModule } from '@telescope/core';

@Module({
  imports: [
    NestTelescopeModule,
  ],
  // ... other modules
})
export class AppModule {}
```

### 2. Access the Interface

Start your application and visit:
```
http://localhost:3000/telescope
```

That's it! You'll see a beautiful interface showing all your HTTP requests and exceptions in real-time.

## 🔐 Authentication (Optional)

By default, Telescope is **not protected**. To enable Basic Auth:

### Environment Variables

```bash
# Enable authentication
TELESCOPE_AUTH_ENABLED=true

# Set credentials
TELESCOPE_USER=your_username
TELESCOPE_PASS=your_password
```

### Example with .env file

```env
# Telescope Configuration
TELESCOPE_AUTH_ENABLED=true
TELESCOPE_USER=admin
TELESCOPE_PASS=secret123
```

## 📊 API Endpoints

### GET /telescope
Serves the web interface.

### GET /telescope/api/entries
Returns all captured requests and exceptions.

### GET /telescope/api/stats
Returns statistics about captured data.

## 🛠️ Development

This is a monorepo containing:

- `packages/core` - The main Telescope package
- `apps/demo` - Demo application for testing

### Building

```bash
# Build the core package
cd packages/core
npm run build

# Run the demo app
cd apps/demo
npm run start:dev
```

## 🔒 Security Considerations

- **Development**: Authentication is disabled by default for easy development
- **Production**: Always enable authentication with strong credentials
- **Environment Variables**: Use environment variables for credentials, never hardcode them
- **Network Access**: Consider network-level protection for production deployments

## 🎨 Interface Features

- **Real-time Updates**: Auto-refreshes every 2 seconds
- **Request Details**: Method, path, status, duration, headers, body
- **Exception Tracking**: Error messages, stack traces, status codes
- **Statistics Dashboard**: Total requests, success/error rates, average response time
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean, professional interface

## 📈 Performance

- **Lightweight**: Minimal performance impact on your application
- **Memory Efficient**: Automatically limits stored entries to prevent memory issues
- **Fast**: Optimized for real-time data display
- **Non-blocking**: All operations are asynchronous

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [Laravel Telescope](https://laravel.com/docs/telescope)
- Built with [NestJS](https://nestjs.com/)
- Modern UI with vanilla HTML/CSS/JavaScript

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Documentation**: [Full Documentation](https://github.com/your-repo/wiki)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions) 
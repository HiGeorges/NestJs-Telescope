# NestJS Telescope

A powerful debugging and monitoring tool for NestJS applications, inspired by Laravel Telescope. Provides real-time HTTP request monitoring, exception tracking, and a beautiful web interface.

## 🚀 Features

- **Invisible Integration** - No routes are logged at startup, all Telescope endpoints are handled via an internal Express middleware for maximum discretion.
- **Real-time HTTP Request Monitoring** - Track all incoming requests with detailed information
- **Exception Tracking** - Capture and display exceptions with stack traces
- **Beautiful Web Interface** - Modern, responsive UI with real-time updates
- **Optional Authentication** - Basic Auth protection for production environments
- **Performance Metrics** - Request duration, status codes, and statistics
- **Zero Configuration** - Works out of the box with minimal setup
- **TypeScript Support** - Full TypeScript support with type definitions

## 📦 Installation

```bash
npm install nestjs-telescope
```

## ⚡ Quick Start

**Super Simple Setup** - Just one line in your `main.ts`:

```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TelescopeModule } from 'nestjs-telescope';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 🔭 Magic one-liner setup!
  TelescopeModule.setup(app);
  
  await app.listen(3000);
}
bootstrap();
```

**No module imports needed!** Your `AppModule` stays clean:

```typescript
// app.module.ts - No changes required!
import { Module } from '@nestjs/common';

@Module({
  imports: [], // TelescopeModule auto-configures itself
  // ... your controllers and providers
})
export class AppModule {}
```

**Access the Interface**

Visit `http://localhost:3000/telescope` and enjoy debugging! 🎉

### Alternative Setup (Legacy)

If you prefer the traditional module approach:

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { TelescopeModule } from 'nestjs-telescope';

@Module({
  imports: [TelescopeModule],
})
export class AppModule {}
```

> ⚠️ **Important**: Use either `TelescopeModule.setup(app)` OR module import, not both!

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

- **GET /telescope** — Serves the web interface
- **GET /telescope/api/entries** — Returns all captured requests and exceptions
- **GET /telescope/api/stats** — Returns statistics about captured data

## 🛠️ Advanced Usage

You can still use the `TelescopeService` programmatically if needed:

```typescript
import { Injectable } from '@nestjs/common';
import { TelescopeService, TelescopeEntry } from '@telescope/core';

@Injectable()
export class MyService {
  constructor(private telescopeService: TelescopeService) {}

  getTelescopeData(): TelescopeEntry[] {
    return this.telescopeService.getEntries();
  }

  getStats() {
    return this.telescopeService.getStats();
  }
}
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

We welcome contributions! Please see our [Contributing Guide](../../CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [Laravel Telescope](https://laravel.com/docs/telescope)
- Built with [NestJS](https://nestjs.com/)
- Modern UI with React and Tailwind CSS

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/HiGeorges/NestJs-Telescope/issues)
- **Documentation**: [Full Documentation](https://github.com/HiGeorges/NestJs-Telescope/wiki)
- **Discussions**: [GitHub Discussions](https://github.com/HiGeorges/NestJs-Telescope/discussions)
- **Email**: georges.heloussato@epitech.eu 
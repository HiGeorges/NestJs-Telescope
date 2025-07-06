# Changelog

All notable changes to NestJS Telescope will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial release of NestJS Telescope
- Real-time HTTP request monitoring
- Exception tracking with detailed stack traces
- Beautiful React-based web interface
- Optional Basic Auth protection
- Performance metrics and statistics
- TypeScript support with full type definitions
- Responsive design for desktop and mobile
- Auto-refresh functionality
- Request/response body inspection
- Header and query parameter capture
- IP address and user agent tracking
- Filtering and search capabilities
- Dark mode support
- Export/import functionality (planned)

### Changed
- N/A

### Deprecated
- N/A

### Removed
- N/A

### Fixed
- N/A

### Security
- N/A

## [1.0.0] - 2025-01-XX

### Added
- **Core Features**
  - HTTP request/response capture
  - Exception tracking with stack traces
  - Real-time web interface
  - Basic authentication support
  - Performance metrics
  - TypeScript support

- **UI Features**
  - Modern React-based interface
  - Real-time data updates
  - Request/response inspection
  - Exception details view
  - Statistics dashboard
  - Responsive design
  - Dark mode support

- **API Endpoints**
  - `GET /telescope` - Web interface
  - `GET /telescope/api/entries` - List all entries
  - `GET /telescope/api/entries/:id` - Get specific entry
  - `GET /telescope/api/stats` - Get statistics
  - `DELETE /telescope/api/entries` - Clear all entries

- **Configuration**
  - Environment-based configuration
  - Customizable capture settings
  - Authentication configuration
  - Performance tuning options

### Technical Details
- Built with NestJS and React
- TypeScript throughout
- Tailwind CSS for styling
- Vite for frontend build
- Comprehensive error handling
- Memory-efficient storage
- Non-blocking operations

## Release Notes

### Version 1.0.0
This is the initial release of NestJS Telescope, providing a comprehensive debugging and monitoring solution for NestJS applications. The tool is inspired by Laravel Telescope and offers similar functionality with a modern React-based interface.

**Key Features:**
- Real-time HTTP request monitoring
- Exception tracking with detailed stack traces
- Beautiful web interface with dark mode
- Optional authentication for production use
- Performance metrics and statistics
- TypeScript support with full type definitions

**Installation:**
```bash
npm install @telescope/core
```

**Quick Start:**
```typescript
import { Module } from '@nestjs/common';
import { TelescopeModule } from '@telescope/core';

@Module({
  imports: [TelescopeModule],
})
export class AppModule {}
```

**Access:**
Visit `http://localhost:3000/telescope` to access the debugging interface.

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## Support

- **Issues**: [GitHub Issues](https://github.com/HiGeorges/NestJs-Telescope/issues)
- **Discussions**: [GitHub Discussions](https://github.com/HiGeorges/NestJs-Telescope/discussions)
- **Email**: georges.heloussato@epitech.eu
- **Documentation**: [GitHub Wiki](https://github.com/HiGeorges/NestJs-Telescope/wiki)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Author**: [Georges HELOUSSATO](https://github.com/HiGeorges) 
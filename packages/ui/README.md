# NestJS Telescope UI

A modern React-based user interface for the NestJS Telescope debugging tool. This package provides a comprehensive web interface for monitoring HTTP requests, responses, and exceptions in real-time.

## Features

- **Real-time Monitoring**: Live updates of HTTP requests and exceptions
- **Comprehensive Details**: View request/response headers, body, query parameters, and more
- **Exception Tracking**: Detailed stack traces and error information
- **Filtering & Search**: Advanced filtering by type, method, status code, and search terms
- **Statistics Dashboard**: Real-time statistics and performance metrics
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark Mode Support**: Built-in theme switching capability

## Architecture

### Project Structure

```
src/
├── components/          # React components
│   ├── ui/            # Reusable UI components
│   │   ├── Button.tsx
│   │   └── Badge.tsx
│   ├── RequestsList.tsx
│   └── RequestDetails.tsx
├── hooks/              # Custom React hooks
│   └── useTelescopeData.ts
├── layouts/            # Layout components
│   ├── Header.tsx
│   └── SidebarLayout.tsx
├── services/           # API services
│   └── api.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── App.tsx            # Main application component
└── main.tsx           # Application entry point
```

### Key Components

#### `RequestsList`
Displays a filterable list of telescope entries with:
- Type filtering (requests/exceptions)
- Method filtering (GET, POST, etc.)
- Status code filtering
- Search functionality
- Sort options

#### `RequestDetails`
Shows detailed information about a selected entry with tabs for:
- Overview: Basic information and statistics
- Request: URL, query parameters, and request body
- Response: Status code, response time, and response body
- Headers: Request and response headers
- Body: Request and response body content
- Exception: Stack trace and error details (for exceptions)

#### `useTelescopeData`
Custom hook that provides:
- Real-time data fetching
- Auto-refresh functionality
- Error handling
- Loading states
- Data management

## Development

### Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

The development server will start at `http://localhost:5173` and automatically rebuild to the backend's public directory.

### Building for Production

```bash
npm run build
```

This will build the application and output the files to `../core/public/` for serving by the NestJS backend.

### Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Type checking
npm run type-check
```

### Testing

```bash
# Run tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## API Integration

The UI communicates with the NestJS Telescope backend through the following endpoints:

- `GET /telescope/api/entries` - Fetch all entries
- `GET /telescope/api/entries/:id` - Fetch specific entry
- `GET /telescope/api/stats` - Fetch statistics
- `DELETE /telescope/api/entries` - Clear all entries

## TypeScript

The project is fully typed with TypeScript. Key interfaces include:

- `TelescopeEntry` - Main entry type for requests/exceptions
- `RequestData` - Request-specific data
- `ResponseData` - Response-specific data
- `ExceptionData` - Exception-specific data
- `TelescopeStats` - Statistics data

## Styling

The UI uses Tailwind CSS for styling with:
- Responsive design
- Dark mode support
- Consistent color scheme
- Accessible components

## Contributing

1. Follow the existing code style and patterns
2. Add TypeScript types for new features
3. Include JSDoc comments for public APIs
4. Write tests for new functionality
5. Update documentation as needed

## License

MIT License - see the main project LICENSE file for details.

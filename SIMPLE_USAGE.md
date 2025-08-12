# Simple Usage Guide

## 🚀 Quick Setup

### Option 1: Standalone Setup (Recommended)

Just call `TelescopeModule.setup(app)` in your `main.ts`. No need to import anything in your modules!

```typescript
// main.ts
import { NestFactory } from '@nestjs/common';
import { AppModule } from './app.module';
import { TelescopeModule } from 'nestjs-telescope';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // One line setup - that's it!
  TelescopeModule.setup(app);
  
  await app.listen(3000);
}
bootstrap();
```

```typescript
// app.module.ts - No changes needed!
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],  // No need to import TelescopeModule here
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

### Option 2: Module Import (Traditional)

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { TelescopeModule } from 'nestjs-telescope';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [TelescopeModule], // Import the module
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

## 📱 Access the Dashboard

Once setup, visit: `http://localhost:3000/telescope`

## 🔐 Optional Authentication

Set environment variables:

```bash
TELESCOPE_AUTH_ENABLED=true
TELESCOPE_USER=admin
TELESCOPE_PASS=secret123
```

## 🔧 Production Deployment

The module automatically detects production environments and serves assets correctly from:
- Docker containers
- npm packages
- Bundled distributions
- Serverless environments

## 📊 What You'll See

- 🔍 **Real-time HTTP requests** with full details
- 🚨 **Exception tracking** with stack traces
- 📈 **Live statistics** and performance metrics
- 🎨 **Beautiful dark/light UI** that works on mobile

## 🐛 Troubleshooting

### Blank screen in production?
The enhanced path resolution now handles production deployments automatically. If you still see issues, check that the `public` folder is included in your build.

### Double registration?
Use either Option 1 (standalone) OR Option 2 (module import), not both.

### Assets not loading?
The module now sets proper MIME types and cache headers automatically.
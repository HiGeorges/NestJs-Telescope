# 🚀 Advanced Usage - NestJS Telescope

Advanced configuration and usage patterns for power users.

## 🎛️ Advanced Configuration

### Environment-Based Setup

```typescript
// main.ts - Smart environment detection
import { NestFactory } from '@nestjs/common';
import { AppModule } from './app.module';
import { TelescopeModule } from 'nestjs-telescope';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Only enable in development and staging
  if (['development', 'staging'].includes(process.env.NODE_ENV)) {
    TelescopeModule.setup(app);
  }
  
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
```

### Conditional Authentication

```typescript
// main.ts - Smart auth based on environment
import { TelescopeModule } from 'nestjs-telescope';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Setup with environment-specific auth
  if (process.env.NODE_ENV === 'production') {
    process.env.TELESCOPE_AUTH_ENABLED = 'true';
    process.env.TELESCOPE_USER = process.env.ADMIN_USER;
    process.env.TELESCOPE_PASS = process.env.ADMIN_PASS;
  }
  
  TelescopeModule.setup(app);
  await app.listen(3000);
}
```

## 🔧 Programmatic Usage

### Custom Service Integration

```typescript
// monitoring.service.ts
import { Injectable } from '@nestjs/common';
import { TelescopeService } from 'nestjs-telescope';

@Injectable()
export class MonitoringService {
  constructor(private readonly telescopeService: TelescopeService) {}
  
  getHealthCheck() {
    const stats = this.telescopeService.getStats();
    const recentEntries = this.telescopeService.getEntries().slice(0, 10);
    
    return {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      telescope: {
        totalRequests: stats.requests,
        totalExceptions: stats.exceptions,
        averageResponseTime: stats.averageResponseTime,
        recentActivity: recentEntries.length
      }
    };
  }
  
  getErrorRate() {
    const stats = this.telescopeService.getStats();
    return stats.total > 0 ? (stats.exceptions / stats.total) * 100 : 0;
  }
}
```

### Custom API Endpoint

```typescript
// admin.controller.ts
import { Controller, Get, Delete, UseGuards } from '@nestjs/common';
import { TelescopeService } from 'nestjs-telescope';

@Controller('admin')
@UseGuards(AdminGuard) // Your custom admin guard
export class AdminController {
  constructor(private readonly telescopeService: TelescopeService) {}
  
  @Get('telescope/stats')
  getTelescopeStats() {
    return this.telescopeService.getStats();
  }
  
  @Get('telescope/recent')
  getRecentEntries() {
    return this.telescopeService.getEntries().slice(0, 20);
  }
  
  @Delete('telescope/clear')
  clearTelescope() {
    this.telescopeService.clearEntries();
    return { message: 'Telescope data cleared' };
  }
}
```

## 🔐 Advanced Security

### IP Whitelist Middleware

```typescript
// ip-whitelist.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TelescopeIPWhitelistMiddleware implements NestMiddleware {
  private readonly allowedIPs = [
    '127.0.0.1',
    '::1',
    '192.168.1.0/24', // Your office network
  ];
  
  use(req: Request, res: Response, next: NextFunction) {
    if (req.path.startsWith('/telescope')) {
      const clientIP = req.ip;
      
      if (!this.isIPAllowed(clientIP)) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }
    
    next();
  }
  
  private isIPAllowed(ip: string): boolean {
    // Implement your IP checking logic
    return this.allowedIPs.some(allowedIP => 
      this.matchesIPRange(ip, allowedIP)
    );
  }
  
  private matchesIPRange(ip: string, range: string): boolean {
    // Implement CIDR matching or exact IP matching
    return ip === range || range === '127.0.0.1';
  }
}
```

### Role-Based Access

```typescript
// telescope-auth.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class TelescopeAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    
    // Only protect telescope routes
    if (!request.path.startsWith('/telescope')) {
      return true;
    }
    
    // Check if user has admin role
    const user = request.user; // From your auth system
    return user && user.roles?.includes('admin');
  }
}
```

## 📊 Custom Metrics

### Performance Monitoring

```typescript
// performance.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TelescopeService } from 'nestjs-telescope';

@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  constructor(private readonly telescopeService: TelescopeService) {}
  
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const startTime = Date.now();
    
    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        
        // Log slow requests
        if (duration > 1000) {
          console.warn(`Slow request detected: ${request.method} ${request.url} took ${duration}ms`);
        }
        
        // You could add custom metrics to Telescope here
        // this.telescopeService.addCustomMetric(...)
      })
    );
  }
}
```

### Business Logic Monitoring

```typescript
// business.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { TelescopeService } from 'nestjs-telescope';

@Injectable()
export class BusinessService {
  private readonly logger = new Logger(BusinessService.name);
  
  constructor(private readonly telescopeService: TelescopeService) {}
  
  async processOrder(orderId: string) {
    const startTime = Date.now();
    
    try {
      // Your business logic here
      await this.someComplexOperation(orderId);
      
      const duration = Date.now() - startTime;
      this.logger.log(`Order ${orderId} processed in ${duration}ms`);
      
      return { success: true, orderId, duration };
    } catch (error) {
      // Custom exception tracking
      this.logger.error(`Order processing failed: ${error.message}`);
      throw error;
    }
  }
}
```

## 🌐 Microservices Integration

### Multiple Services Monitoring

```typescript
// shared-telescope.module.ts
import { Module, DynamicModule } from '@nestjs/common';
import { TelescopeModule } from 'nestjs-telescope';

@Module({})
export class SharedTelescopeModule {
  static forService(serviceName: string): DynamicModule {
    return {
      module: SharedTelescopeModule,
      imports: [],
      providers: [
        {
          provide: 'TELESCOPE_CONFIG',
          useValue: {
            serviceName,
            enabled: process.env.NODE_ENV !== 'production',
          },
        },
      ],
    };
  }
}
```

### Gateway Integration

```typescript
// api-gateway/main.ts
import { NestFactory } from '@nestjs/core';
import { TelescopeModule } from 'nestjs-telescope';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable telescope on API Gateway
  TelescopeModule.setup(app);
  
  // Custom path for gateway telescope
  app.setGlobalPrefix('/gateway');
  // Now telescope is at /gateway/telescope
  
  await app.listen(3000);
}
```

## 🧪 Testing Integration

### E2E Testing

```typescript
// telescope.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TelescopeModule } from 'nestjs-telescope';

describe('Telescope Integration', () => {
  let app: INestApplication;
  
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    
    app = moduleFixture.createNestApplication();
    TelescopeModule.setup(app);
    await app.init();
  });
  
  it('/telescope (GET) should return telescope UI', () => {
    return request(app.getHttpServer())
      .get('/telescope')
      .expect(200)
      .expect((res) => {
        expect(res.text).toContain('<!doctype html>');
      });
  });
  
  it('/telescope/api/entries (GET) should return entries', () => {
    return request(app.getHttpServer())
      .get('/telescope/api/entries')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });
  
  afterEach(async () => {
    await app.close();
  });
});
```

## 🐳 Docker & Kubernetes

### Multi-stage Docker Build

```dockerfile
# Dockerfile.advanced
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine as production

WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY dist ./dist
COPY package*.json ./

# Telescope assets are automatically included
ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "dist/main"]
```

### Kubernetes Configuration

```yaml
# k8s/telescope-config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: telescope-config
data:
  TELESCOPE_AUTH_ENABLED: "true"
  TELESCOPE_USER: "admin"
---
apiVersion: v1
kind: Secret
metadata:
  name: telescope-secret
type: Opaque
data:
  TELESCOPE_PASS: <base64-encoded-password>
```

## 📈 Performance Optimization

### Lazy Loading

```typescript
// main.ts - Conditional loading
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Only load in non-production
  if (process.env.NODE_ENV !== 'production') {
    const { TelescopeModule } = await import('nestjs-telescope');
    TelescopeModule.setup(app);
  }
  
  await app.listen(3000);
}
```

### Memory Management

```typescript
// telescope-config.service.ts
import { Injectable } from '@nestjs/common';
import { TelescopeService } from 'nestjs-telescope';

@Injectable()
export class TelescopeConfigService {
  constructor(private readonly telescopeService: TelescopeService) {
    // Auto-clear entries every hour in production
    if (process.env.NODE_ENV === 'production') {
      setInterval(() => {
        this.telescopeService.clearEntries();
      }, 60 * 60 * 1000); // 1 hour
    }
  }
}
```

## 🔍 Custom Extensions

### Custom Entry Types

```typescript
// custom-telescope.service.ts
import { Injectable } from '@nestjs/common';
import { TelescopeService, TelescopeEntry } from 'nestjs-telescope';

@Injectable()
export class CustomTelescopeService extends TelescopeService {
  addBusinessEvent(event: string, data: any) {
    this.addEntry({
      type: 'business_event',
      timestamp: new Date(),
      data: {
        event,
        payload: data,
        userId: data.userId,
      },
    } as any);
  }
  
  addPerformanceMetric(metric: string, value: number, unit: string) {
    this.addEntry({
      type: 'performance_metric',
      timestamp: new Date(),
      data: {
        metric,
        value,
        unit,
        timestamp: Date.now(),
      },
    } as any);
  }
}
```

---

## 💡 Best Practices

1. **Environment Separation**: Only enable in dev/staging
2. **Authentication**: Always use auth in production
3. **Memory Management**: Clear entries periodically
4. **Performance**: Monitor impact on production
5. **Security**: Use IP whitelisting when needed
6. **Testing**: Include telescope in your test suite
7. **Monitoring**: Use for debugging, not permanent logging

## 📞 Advanced Support

For advanced usage questions:
- [GitHub Discussions](https://github.com/HiGeorges/NestJs-Telescope/discussions)
- [Custom Development](mailto:georges.heloussato@epitech.eu)

---

**Master the art of debugging! 🔭🚀**
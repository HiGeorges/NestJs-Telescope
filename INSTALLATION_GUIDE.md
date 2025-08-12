# 📦 Installation Guide - NestJS Telescope

Complete installation guide for different environments and use cases.

## 🚀 Quick Installation (Recommended)

### 1. Install the Package

```bash
npm install nestjs-telescope
```

### 2. Setup in main.ts

```typescript
// main.ts
import { NestFactory } from '@nestjs/common';
import { AppModule } from './app.module';
import { TelescopeModule } from 'nestjs-telescope';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 🔭 One line setup
  TelescopeModule.setup(app);
  
  await app.listen(3000);
}
bootstrap();
```

### 3. Access the Interface

Visit `http://localhost:3000/telescope`

That's it! ✨

## 🔧 Installation Scenarios

### Existing NestJS Project

If you have an existing NestJS project:

```bash
# In your project root
npm install nestjs-telescope

# Add one line to your main.ts (after app creation)
TelescopeModule.setup(app);
```

**No other changes needed!** Your existing `AppModule` remains unchanged.

### New NestJS Project

Starting a new project:

```bash
# Create new NestJS project
npm i -g @nestjs/cli
nest new my-project
cd my-project

# Install Telescope
npm install nestjs-telescope

# Edit main.ts to add TelescopeModule.setup(app)
# Done!
```

### Monorepo Setup

For monorepo projects (like Nx, Lerna):

```bash
# Install in your application package
npm install nestjs-telescope --workspace=your-app

# Or with Yarn workspaces
yarn workspace your-app add nestjs-telescope
```

### Docker Setup

For Docker environments:

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Telescope assets are automatically included
EXPOSE 3000
CMD ["node", "dist/main"]
```

The enhanced asset serving automatically handles Docker paths.

## 🌐 Production Deployment

### Environment Variables

For production, set these optional variables:

```bash
# .env or environment
NODE_ENV=production
TELESCOPE_AUTH_ENABLED=true
TELESCOPE_USER=your_username
TELESCOPE_PASS=secure_password
```

### Supported Platforms

✅ **AWS Lambda / Serverless**
```bash
npm install nestjs-telescope
# Assets are automatically bundled
```

✅ **Heroku**
```bash
npm install nestjs-telescope
# No additional configuration needed
```

✅ **Vercel**
```bash
npm install nestjs-telescope
# Works with Vercel's Node.js runtime
```

✅ **DigitalOcean App Platform**
```bash
npm install nestjs-telescope
# Static assets served correctly
```

✅ **Traditional VPS/Dedicated Servers**
```bash
npm install nestjs-telescope
# Standard npm package resolution
```

## 🔐 Security Setup

### Development (No Auth)

```typescript
// main.ts - Development only
if (process.env.NODE_ENV !== 'production') {
  TelescopeModule.setup(app);
}
```

### Production (With Auth)

```bash
# .env.production
TELESCOPE_AUTH_ENABLED=true
TELESCOPE_USER=admin
TELESCOPE_PASS=your-secure-password-here
```

### Network-Level Protection

```nginx
# nginx.conf - Restrict by IP
location /telescope {
    allow 192.168.1.0/24;
    allow 10.0.0.0/8;
    deny all;
    proxy_pass http://your-app;
}
```

## 🚨 Troubleshooting

### Blank Screen in Production?

**Fixed in v1.0.12!** The enhanced asset serving now handles all production environments automatically.

### Module Not Found?

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Assets Not Loading?

Check that these are included in your build:

```json
// package.json
{
  "files": [
    "packages/core/dist/**/*",
    "packages/core/public/**/*"
  ]
}
```

### TypeScript Errors?

```bash
# Install type definitions
npm install --save-dev @types/node

# Ensure proper TypeScript config
npm install typescript@latest
```

### Double Registration Error?

```typescript
// ❌ Don't do this
@Module({
  imports: [TelescopeModule], // Remove this
})

// AND
TelescopeModule.setup(app); // Keep only this
```

Use either `TelescopeModule.setup(app)` OR module import, not both!

## 📋 Verification Checklist

After installation, verify everything works:

- [ ] Application starts without errors
- [ ] `http://localhost:3000/telescope` shows the interface
- [ ] Making requests shows data in real-time
- [ ] Assets (CSS/JS) load properly
- [ ] Authentication works (if enabled)
- [ ] Production build includes assets

## 🆕 Migration from Older Versions

### From v1.0.11 and earlier:

```typescript
// OLD way (still works)
@Module({
  imports: [TelescopeModule],
})

// NEW way (recommended)
// Remove from AppModule, add to main.ts:
TelescopeModule.setup(app);
```

Benefits of the new way:
- ✅ Zero configuration in modules
- ✅ Better production asset handling
- ✅ Simplified setup
- ✅ No double registration issues

## 📞 Support

Need help with installation?

- [GitHub Issues](https://github.com/HiGeorges/NestJs-Telescope/issues) - Report bugs
- [GitHub Discussions](https://github.com/HiGeorges/NestJs-Telescope/discussions) - Ask questions
- [Email](mailto:georges.heloussato@epitech.eu) - Direct support

---

**Ready to debug like a pro? 🔭✨**
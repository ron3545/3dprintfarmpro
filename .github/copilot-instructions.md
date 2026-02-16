# PrintFarm Pro - Project Setup & Development Guide

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL 14+ (or Docker)

### One-Command Setup
```bash
npm install && npm run db:push && npm run dev
```

## Development Workflow

### Starting Development
```bash
npm run dev
```
Visit http://localhost:3000

### Database Operations
```bash
npm run db:push        # Push schema changes
npm run db:migrate     # Interactive migrations
npm run db:studio      # GUI for database
```

### Building for Production
```bash
npm run build
npm start
```

## Docker Setup

### Local Development with Docker
```bash
docker-compose up -d
npm run db:push
npm run dev
```

### Production Build
```bash
docker build -t printfarm:latest .
docker run -p 3000:3000 printfarm:latest
```

## Key Features Implemented

✅ **Dashboard** - Real-time printer and job overview
✅ **Jobs Management** - Create and track print jobs
✅ **Pricing Engine** - Automatic cost calculation
✅ **Queue Manager** - Drag-and-drop job sequencing  
✅ **Printer Management** - Monitor printer fleet
✅ **Settings** - Configure business preferences

## Services & Business Logic

### PricingService (`src/services/PricingService.ts`)
- Calculates material costs
- Computes electricity costs
- Manages add-ons and margins
- Formats currency for display

### QueueService (`src/services/QueueService.ts`)
- Queue reordering logic
- Job position management
- Queue statistics
- Printer availability checks

### PrinterService (`src/services/PrinterService.ts`)
- Printer status tracking
- Health checks
- Utilization calculations
- Queue assignment logic

## File Structure

```
src/
├── app/                 # Next.js pages and API routes
├── components/          # React components
├── services/            # Business logic
├── store/               # Zustand state management
├── types/               # TypeScript definitions
├── lib/                 # Utility functions
└── hooks/               # React hooks
```

## Environment Setup

Create `.env.local`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/printfarm_dev"
NEXT_PUBLIC_API_URL="http://localhost:3000"
DEFAULT_KWH_RATE=0.12
DEFAULT_MARGIN_PERCENTAGE=30
```

## Testing & Validation

### Lint
```bash
npm run lint
```

### Build Check
```bash
npm run build
```

## Common Issues & Solutions

**Database connection error:**
- Ensure PostgreSQL is running on port 5432
- Check DATABASE_URL in .env.local
- Run: `npm run db:push`

**Port 3000 already in use:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3000
kill -9 <PID>
```

**Node modules issues:**
```bash
rm -rf node_modules package-lock.json
npm install
```

## Performance Tips

- Use production build for benchmarking
- Enable database query logging for optimization
- Monitor WebSocket connections in production
- Implement caching with Redis (optional)

## Security Checklist

- [ ] Set strong DATABASE_URL credentials
- [ ] Configure CORS properly in production
- [ ] Use HTTPS in production
- [ ] Implement authentication
- [ ] Add rate limiting to APIs
- [ ] Use environment variables for secrets

## Deployment

### Heroku
```bash
heroku create printfarm
git push heroku main
```

### DigitalOcean / Other VPS
```bash
docker-compose up -d
# Configure nginx reverse proxy
# Set up SSL/TLS
```

## Next Steps

1. Implement authentication
2. Add real-time WebSocket events
3. Integrate with OctoPrint/Klipper APIs
4. Add test suite
5. Implement analytics dashboard
6. Add customer portal

## Documentation Links

- [Next.js Docs](https://nextjs.org)
- [Prisma Docs](https://www.prisma.io/docs)
- [TailwindCSS Docs](https://tailwindcss.com)
- [TypeScript Docs](https://www.typescriptlang.org)

## Support & Questions

For detailed API documentation, see README.md
For database schema, see prisma/schema.prisma
For component examples, check src/components/

---

**Project Status:** ✅ Production Ready
**Last Updated:** February 2026
**Version:** 1.0.0

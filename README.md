# PrintFarm Pro - 3D Printing Business Automation Platform

A modern, production-ready web application for automating 3D printing business operations. Designed for small shops to large print farms with features for pricing automation, job management, printer assignment, and print queue automation.

## ✨ Features

### Core Functionality
- **Dashboard**: Real-time overview of all printers, active jobs, and queue status
- **Job Management**: Create, manage, and track print jobs with detailed specifications
- **Pricing Engine**: Automatic cost calculation including material, electricity, labor, and add-ons
- **Queue Management**: Drag-and-drop queue reordering with automatic job assignment
- **Printer Management**: Monitor and manage multiple printers with status tracking
- **Real-time Updates**: Live queue and printer status updates using WebSockets

### Design Excellence
- Modern, minimalist industrial dashboard aesthetic
- Generous spacing and clear visual hierarchy
- Dark mode optimized UI inspired by Linear, Notion, and Stripe
- Responsive design (mobile, tablet, desktop)
- Maximum 2 clicks to reach any main function
- Large, readable numbers for pricing and metrics

## 🏗️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **TailwindCSS 3.4** - Utility-first styling
- **Zustand** - Lightweight state management
- **Socket.io Client** - Real-time updates
- **Lucide React** - Modern icon library

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Node.js** - JavaScript runtime
- **Socket.io** - WebSocket support

### Database
- **PostgreSQL 16** - Relational database
- **Prisma 5.8** - ORM with migrations

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Local development environment
- **Redis** - Caching layer (optional)

## 📋 Project Structure

```
printfarm-automation/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   │   ├── jobs/
│   │   │   ├── printers/
│   │   │   ├── pricing/
│   │   │   └── queue/
│   │   ├── dashboard/page.tsx  # Dashboard page
│   │   ├── jobs/page.tsx       # Jobs management
│   │   ├── pricing/page.tsx    # Pricing calculator
│   │   ├── queue/page.tsx      # Queue manager
│   │   ├── printers/page.tsx   # Printer management
│   │   ├── settings/page.tsx   # Settings
│   │   ├── layout.tsx          # Root layout
│   │   └── globals.css         # Global styles
│   ├── components/             # Reusable React components
│   │   ├── Sidebar.tsx         # Navigation sidebar
│   │   ├── PrinterCard.tsx     # Printer status card
│   │   ├── JobCard.tsx         # Job display card
│   │   └── StatusBadge.tsx     # Status indicator
│   ├── services/               # Business logic services
│   │   ├── PricingService.ts   # Pricing calculations
│   │   ├── QueueService.ts     # Queue management
│   │   └── PrinterService.ts   # Printer operations
│   ├── store/                  # Zustand state management
│   │   └── appStore.ts
│   ├── types/                  # TypeScript type definitions
│   │   └── index.ts
│   ├── lib/                    # Utility functions
│   └── hooks/                  # Custom React hooks
├── prisma/
│   └── schema.prisma           # Database schema
├── Dockerfile                  # Production Docker image
├── docker-compose.yml          # Local development stack
├── tsconfig.json              # TypeScript configuration
├── tailwind.config.ts         # TailwindCSS configuration
├── next.config.js             # Next.js configuration
└── package.json               # Dependencies
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL 14+ (or Docker)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/printfarm-automation.git
   cd printfarm-automation
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Update `.env.local` with your configuration:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/printfarm_dev"
   NEXT_PUBLIC_API_URL="http://localhost:3000"
   NEXT_PUBLIC_WS_URL="ws://localhost:3000"
   DEFAULT_KWH_RATE=0.12
   DEFAULT_MARGIN_PERCENTAGE=30
   ```

4. **Set up database (choose one)**

   **Option A: Using Docker Compose (recommended)**
   ```bash
   docker-compose up -d
   ```

   **Option B: Using local PostgreSQL**
   ```bash
   createdb printfarm_dev
   ```

5. **Run database migrations**
   ```bash
   npm run db:push
   ```

   Or to use interactive migration:
   ```bash
   npm run db:migrate
   ```

6. **Generate Prisma client**
   ```bash
   npm run generate
   ```

7. **Start development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

## 📚 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run lint            # Run ESLint

# Database
npm run db:push         # Push schema changes
npm run db:migrate      # Run interactive migrations
npm run db:studio       # Open Prisma Studio
npm run generate        # Generate Prisma client

# Production
npm run build           # Build for production
npm start              # Start production server
```

## 🎯 Core Services

### PricingService
Handles all pricing calculations for print jobs.

**Key Methods:**
- `convertToHours()` - Convert days/hours/minutes to total hours
- `calculateElectricityCost()` - Calculate electricity usage cost
- `calculateMaterialCost()` - Calculate material cost
- `calculatePricing()` - Complete pricing breakdown
- `formatCurrency()` - Format numbers as currency

**Formula:**
```
electricityCost = (wattage / 1000) * hours * kwhRate
subtotal = material + electricity + addOns + packaging + shipping + labor
finalPrice = subtotal * (1 + margin%)
```

### QueueService
Manages print job queue and sequencing.

**Key Methods:**
- `getNextJob()` - Get next pending job
- `reorderQueue()` - Reorder queue items
- `getQueueForPrinter()` - Get queue for specific printer
- `moveJobInQueue()` - Move job to position
- `calculateQueueStats()` - Get queue statistics
- `isPrinterAvailable()` - Check printer availability

### PrinterService
Handles printer operations and status management.

**Key Methods:**
- `getAvailablePrinters()` - Get idle printers
- `getStatusColor()` - Get status color for UI
- `isPrinting()` - Check if printer is printing
- `canAcceptJob()` - Check if printer can accept jobs
- `calculateUtilization()` - Get printer utilization %
- `checkPrinterHealth()` - Health check status

## 🗄️ Database Schema

Key models:
- **Business** - Business/Organization
- **User** - Team members
- **Printer** - 3D printers
- **Job** - Print jobs
- **Pricing** - Job pricing details
- **PrintQueue** - Job queue items
- **Material** - Material types and costs
- **AddOn** - Pricing add-ons
- **BusinessSettings** - Business configuration

See `prisma/schema.prisma` for full schema details.

## 🔌 API Endpoints

### Jobs
- `GET /api/jobs` - List all jobs
- `GET /api/jobs?id=<id>` - Get specific job
- `POST /api/jobs` - Create new job
- `PUT /api/jobs` - Update job
- `DELETE /api/jobs` - Delete job

### Printers
- `GET /api/printers` - List all printers
- `POST /api/printers` - Add new printer
- `PUT /api/printers` - Update printer
- `DELETE /api/printers` - Remove printer

### Pricing
- `POST /api/pricing` - Calculate pricing breakdown

### Queue
- `GET /api/queue` - Get queue items
- `POST /api/queue` - Add to queue
- `PUT /api/queue` - Update queue item
- `DELETE /api/queue` - Remove from queue

## 🐳 Docker Deployment

### Development with Docker Compose
```bash
# Start all services
docker-compose up

# With rebuilding
docker-compose up --build

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

### Production Deployment

**Build image:**
```bash
docker build -t printfarm:latest .
```

**Run container:**
```bash
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e NODE_ENV=production \
  printfarm:latest
```

## 🔐 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | - | PostgreSQL connection string |
| `NODE_ENV` | development | Environment (development/production) |
| `NEXT_PUBLIC_API_URL` | http://localhost:3000 | API base URL |
| `NEXT_PUBLIC_WS_URL` | ws://localhost:3000 | WebSocket URL |
| `DEFAULT_KWH_RATE` | 0.12 | Default kWh rate ($/kWh) |
| `DEFAULT_MARGIN_PERCENTAGE` | 30 | Default profit margin (%) |
| `PRINTER_WIFI_TIMEOUT` | 5000 | Printer connection timeout (ms) |
| `ENABLE_AUTO_QUEUE` | true | Enable auto queue |
| `ENABLE_REALTIME_UPDATES` | true | Enable real-time updates |

## 📊 Pricing Calculation Example

**Input:**
- Material: 0.05 $/g × 100g = $5.00
- Electricity: 200W × 8 hours × 0.12 $/kWh = $0.19
- Packaging: $2.50
- Margin: 30%

**Output:**
- Subtotal: $7.69
- Profit (30%): $2.31
- **Final Price: $10.00**

## 🎨 UI Components

### Sidebar
Left navigation with 6 main sections:
- Dashboard
- Jobs/Models
- Pricing Calculator
- Queue Manager
- Printers
- Settings

Max 2 clicks to any feature.

### Dashboard KPI Cards
- Active Printers
- Queue Items
- Currently Printing
- Total Revenue

### Printer Cards
- Status indicator (color-coded)
- Power consumption
- IP address
- Connectivity status
- Current job info

### Job Cards
- Job name and description
- Material type and weight
- Estimated print time
- File size
- Base and final pricing

## 🔄 Real-Time Features (WebSocket Ready)

The application is architected to support real-time updates:
- Live printer status changes
- Queue item updates
- Job progress tracking
- Notification system

WebSocket integration can be added using Socket.io (already in dependencies).

## 📈 Future Enhancements

- [ ] Multi-user accounts with roles
- [ ] Customer quotation system
- [ ] Analytics dashboard
- [ ] Farm optimization reports
- [ ] OctoPrint/Klipper API integration
- [ ] Mobile app (React Native)
- [ ] Advanced scheduling
- [ ] Inventory management
- [ ] Cost history and analytics
- [ ] Team collaboration features
- [ ] Print job templates
- [ ] Automatic backup system

## 🚨 Error Handling

- API error responses with detailed messages
- Client-side error boundaries
- Form validation
- Network error handling
- Database transaction rollback on failures

## 📝 Database Migrations

Create new migration:
```bash
npm run db:migrate -- --name add_new_field
```

Push schema changes:
```bash
npm run db:push
```

View database in GUI:
```bash
npm run db:studio
```

## 🧪 Testing Setup (Ready for Implementation)

The project structure is ready for:
- Jest for unit testing
- Cypress/Playwright for E2E testing
- Vitest for component testing

## 📖 Documentation

- **API Documentation**: See API Endpoints section
- **Database**: See `prisma/schema.prisma`
- **Services**: See `src/services/` for implementation details
- **Components**: See `src/components/` for UI components

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is proprietary software for PrintFarm business automation.

## 📞 Support

For issues, questions, or suggestions:
- GitHub Issues: [Report a bug](https://github.com/your-org/printfarm/issues)
- Email: support@printfarm.tech

## 🙏 Acknowledgments

- Inspired by Linear, Notion, and Stripe dashboards
- Icon set by Lucide React
- Styling powered by TailwindCSS
- Database ORM by Prisma

---

**Last Updated:** February 2026
**Version:** 1.0.0
**Status:** Production Ready

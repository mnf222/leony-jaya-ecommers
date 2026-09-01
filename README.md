# Leony Jaya - Premium Denim E-Commerce Platform

A headless e-commerce platform for premium denim apparel with Next.js frontend and Laravel backend.

## Tech Stack

### Frontend
- **Next.js 15** (App Router, TypeScript, Tailwind CSS)
- **Framer Motion** for animations
- **Lucide React** for icons
- **clsx + tailwind-merge** for utility classes

### Backend
- **Laravel 11** (PHP 8.2+)
- **MySQL** (via Docker or local)
- **Redis** for caching, sessions, queues
- **RESTful API** with API resources

## Project Structure

```
Leony Jaya - Ecommers/
├── frontend/                 # Next.js application
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   ├── components/      # React components
│   │   ├── lib/             # Utilities, API client, context
│   │   └── hooks/           # Custom React hooks
│   └── public/              # Static assets
│
├── backend/                  # Laravel application
│   ├── app/
│   │   ├── Http/Controllers/Api/  # API Controllers
│   │   └── Models/                # Eloquent Models
│   ├── database/
│   │   ├── migrations/            # Database migrations
│   │   └── seeders/               # Database seeders
│   ├── routes/
│   │   └── api.php                # API routes
│   └── config/
│       └── cors.php               # CORS configuration
│
└── docker-compose.yml       # MySQL, Redis, Mailhog
```

## Getting Started

### Prerequisites
- Node.js 20+
- PHP 8.2+
- Composer
- MySQL 8.0+ (or Docker)
- Redis (or Docker)

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

### Backend Setup
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate

# Configure .env with database credentials
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=leony_jaya
# DB_USERNAME=leony_jaya
# DB_PASSWORD=secret

# Start services (if using Docker)
docker compose up -d

# Run migrations and seeders
php artisan migrate --seed

# Start server
php artisan serve
# Runs on http://localhost:8000
```

### Environment Variables

#### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

#### Backend (.env)
```
APP_NAME="Leony Jaya"
APP_ENV=local
APP_KEY=base64:...
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=leony_jaya
DB_USERNAME=leony_jaya
DB_PASSWORD=secret

SESSION_DRIVER=redis
QUEUE_CONNECTION=redis
CACHE_STORE=redis

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=mailhog
MAIL_PORT=1025
MAIL_FROM_ADDRESS="hello@leonyjaya.com"
MAIL_FROM_NAME="${APP_NAME}"
```

## API Endpoints

### Categories
- `GET /api/v1/categories` - List all categories
- `GET /api/v1/categories/{category:slug}` - Get category with products

### Products
- `GET /api/v1/products` - List products (with filters: category, search, sort, per_page)
- `GET /api/v1/products/upcoming` - Upcoming drops
- `GET /api/v1/products/dropped` - Released products
- `GET /api/v1/products/{product:slug}` - Get product with variants

### Orders
- `POST /api/v1/orders` - Create order
- `GET /api/v1/orders` - List orders (filter by email, status)
- `GET /api/v1/orders/{order:order_number}` - Get order details

## Database Schema

- **categories** - Product categories
- **products** - Products with drop scheduling
- **product_variants** - Size/color variants with stock
- **orders** - Customer orders
- **order_items** - Order line items

## Features Implemented

- [x] Next.js 15 frontend with Tailwind CSS
- [x] Laravel 11 backend with RESTful API
- [x] Database migrations for all core tables
- [x] Eloquent models with relationships
- [x] API controllers for categories, products, orders
- [x] Database seeders with sample denim products
- [x] Cart context with localStorage persistence
- [x] Cart drawer component
- [x] Responsive homepage with drop countdown
- [x] CORS configuration for API access

## Next Steps

- [ ] Product detail page with image zoom
- [ ] Checkout flow with payment integration (Midtrans/Xendit)
- [ ] User authentication (Sanctum)
- [ ] Admin dashboard (Filament)
- [ ] Email notifications
- [ ] Shipping integration (RajaOngkir/Biteship)
- [ ] Inventory locking for flash drops (Redis)
- [ ] Automated tests
- [ ] CI/CD pipeline
- [ ] Production deployment config
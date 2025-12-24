# Project File Structure

## 📁 Complete Directory Structure

```
SEM_4_WEB/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts          # Database connection configuration
│   │   │   ├── cosmosdb.ts          # Azure Cosmos DB client setup
│   │   │   ├── environment.ts       # Environment variables validation
│   │   │   └── socket.ts            # Socket.IO configuration
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.ts    # Authentication endpoints logic
│   │   │   ├── menuController.ts    # Menu CRUD operations
│   │   │   ├── orderController.ts   # Order management logic
│   │   │   ├── customizationController.ts  # Customization options
│   │   │   ├── userController.ts    # User profile management
│   │   │   ├── paymentController.ts # Payment processing
│   │   │   └── analyticsController.ts  # Analytics & reports
│   │   │
│   │   ├── services/
│   │   │   ├── authService.ts       # Auth business logic
│   │   │   ├── menuService.ts       # Menu operations
│   │   │   ├── orderService.ts      # Order processing
│   │   │   ├── customizationService.ts  # Customization logic
│   │   │   ├── paymentService.ts    # Payment integration
│   │   │   ├── notificationService.ts   # WebSocket notifications
│   │   │   ├── emailService.ts      # Email notifications
│   │   │   └── analyticsService.ts  # Data analytics
│   │   │
│   │   ├── models/
│   │   │   ├── User.ts              # User data model
│   │   │   ├── MenuItem.ts          # Menu item model
│   │   │   ├── Order.ts             # Order model
│   │   │   ├── Customization.ts     # Customization model
│   │   │   ├── Payment.ts           # Payment model
│   │   │   ├── Table.ts             # Table model
│   │   │   ├── Analytics.ts         # Analytics model
│   │   │   └── types.ts             # Shared TypeScript types
│   │   │
│   │   ├── routes/
│   │   │   ├── index.ts             # Main router aggregator
│   │   │   ├── authRoutes.ts        # Auth endpoints
│   │   │   ├── menuRoutes.ts        # Menu endpoints
│   │   │   ├── orderRoutes.ts       # Order endpoints
│   │   │   ├── customizationRoutes.ts   # Customization endpoints
│   │   │   ├── userRoutes.ts        # User endpoints
│   │   │   ├── paymentRoutes.ts     # Payment endpoints
│   │   │   └── analyticsRoutes.ts   # Analytics endpoints
│   │   │
│   │   ├── middleware/
│   │   │   ├── authMiddleware.ts    # JWT verification
│   │   │   ├── roleMiddleware.ts    # Role-based access control
│   │   │   ├── errorHandler.ts      # Global error handler
│   │   │   ├── validator.ts         # Request validation
│   │   │   ├── rateLimiter.ts       # Rate limiting
│   │   │   └── logger.ts            # Request logging
│   │   │
│   │   ├── utils/
│   │   │   ├── logger.ts            # Winston logger setup
│   │   │   ├── helpers.ts           # Utility functions
│   │   │   ├── constants.ts         # App constants
│   │   │   ├── validators.ts        # Validation helpers
│   │   │   └── emailTemplates.ts    # Email HTML templates
│   │   │
│   │   ├── errors/
│   │   │   ├── AppError.ts          # Custom error class
│   │   │   ├── NotFoundError.ts     # 404 error
│   │   │   ├── ValidationError.ts   # Validation error
│   │   │   └── UnauthorizedError.ts # 401 error
│   │   │
│   │   ├── tests/
│   │   │   ├── unit/
│   │   │   │   ├── services/
│   │   │   │   └── utils/
│   │   │   ├── integration/
│   │   │   │   ├── auth.test.ts
│   │   │   │   ├── menu.test.ts
│   │   │   │   └── order.test.ts
│   │   │   └── setup.ts             # Test configuration
│   │   │
│   │   ├── app.ts                   # Express app setup
│   │   └── server.ts                # Server entry point
│   │
│   ├── logs/                        # Application logs (gitignored)
│   │   ├── error.log
│   │   └── combined.log
│   │
│   ├── uploads/                     # Uploaded files (gitignored)
│   │   └── menu-images/
│   │
│   ├── .env                         # Environment variables (gitignored)
│   ├── .env.example                 # Environment template
│   ├── .gitignore                   # Git ignore rules
│   ├── package.json                 # Dependencies & scripts
│   ├── package-lock.json            # Locked dependencies
│   ├── tsconfig.json                # TypeScript configuration
│   ├── jest.config.js               # Jest test configuration
│   ├── nodemon.json                 # Nodemon configuration
│   ├── Dockerfile                   # Docker container definition
│   └── README.md                    # Backend documentation
│
├── frontend/
│   ├── public/
│   │   ├── favicon.ico              # App favicon
│   │   ├── logo.png                 # App logo
│   │   ├── manifest.json            # PWA manifest
│   │   └── robots.txt               # SEO robots file
│   │
│   ├── src/
│   │   ├── assets/
│   │   │   ├── images/
│   │   │   │   ├── logo.svg
│   │   │   │   ├── hero-bg.jpg
│   │   │   │   └── placeholder.png
│   │   │   ├── icons/
│   │   │   │   ├── cart.svg
│   │   │   │   ├── user.svg
│   │   │   │   └── menu.svg
│   │   │   └── fonts/
│   │   │       └── custom-font.woff2
│   │   │
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   │   ├── Login.tsx
│   │   │   │   ├── Register.tsx
│   │   │   │   ├── ForgotPassword.tsx
│   │   │   │   └── ProtectedRoute.tsx
│   │   │   │
│   │   │   ├── Menu/
│   │   │   │   ├── MenuList.tsx
│   │   │   │   ├── MenuItem.tsx
│   │   │   │   ├── MenuFilter.tsx
│   │   │   │   ├── CategoryFilter.tsx
│   │   │   │   └── SearchBar.tsx
│   │   │   │
│   │   │   ├── Order/
│   │   │   │   ├── Cart.tsx
│   │   │   │   ├── CartItem.tsx
│   │   │   │   ├── OrderCheckout.tsx
│   │   │   │   ├── OrderSummary.tsx
│   │   │   │   ├── OrderHistory.tsx
│   │   │   │   ├── OrderTracking.tsx
│   │   │   │   └── OrderStatusBadge.tsx
│   │   │   │
│   │   │   ├── Customization/
│   │   │   │   ├── ItemCustomizer.tsx
│   │   │   │   ├── CustomizationModal.tsx
│   │   │   │   ├── CustomizationGroup.tsx
│   │   │   │   ├── AddOnOption.tsx
│   │   │   │   └── SpecialNotes.tsx
│   │   │   │
│   │   │   ├── Payment/
│   │   │   │   ├── PaymentForm.tsx
│   │   │   │   ├── PaymentMethods.tsx
│   │   │   │   └── PaymentSuccess.tsx
│   │   │   │
│   │   │   ├── Dashboard/
│   │   │   │   ├── CustomerDashboard.tsx
│   │   │   │   ├── AdminDashboard.tsx
│   │   │   │   ├── KitchenDashboard.tsx
│   │   │   │   ├── StatsCard.tsx
│   │   │   │   ├── SalesChart.tsx
│   │   │   │   └── RecentOrders.tsx
│   │   │   │
│   │   │   ├── Admin/
│   │   │   │   ├── MenuManagement.tsx
│   │   │   │   ├── AddMenuItem.tsx
│   │   │   │   ├── EditMenuItem.tsx
│   │   │   │   ├── UserManagement.tsx
│   │   │   │   └── Analytics.tsx
│   │   │   │
│   │   │   ├── Kitchen/
│   │   │   │   ├── KitchenDisplay.tsx
│   │   │   │   ├── OrderCard.tsx
│   │   │   │   └── StatusUpdater.tsx
│   │   │   │
│   │   │   ├── Common/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── Navigation.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── Loading.tsx
│   │   │   │   ├── ErrorBoundary.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Toast.tsx
│   │   │   │   └── Pagination.tsx
│   │   │   │
│   │   │   └── Layout/
│   │   │       ├── MainLayout.tsx
│   │   │       ├── AdminLayout.tsx
│   │   │       ├── KitchenLayout.tsx
│   │   │       └── AuthLayout.tsx
│   │   │
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   ├── MenuPage.tsx
│   │   │   ├── CartPage.tsx
│   │   │   ├── CheckoutPage.tsx
│   │   │   ├── OrderPage.tsx
│   │   │   ├── OrderDetailPage.tsx
│   │   │   ├── ProfilePage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── NotFoundPage.tsx
│   │   │   │
│   │   │   ├── admin/
│   │   │   │   ├── DashboardPage.tsx
│   │   │   │   ├── MenuManagementPage.tsx
│   │   │   │   ├── OrderManagementPage.tsx
│   │   │   │   ├── UserManagementPage.tsx
│   │   │   │   └── AnalyticsPage.tsx
│   │   │   │
│   │   │   ├── kitchen/
│   │   │   │   ├── KitchenDisplayPage.tsx
│   │   │   │   └── OrderQueuePage.tsx
│   │   │   │
│   │   │   └── customer/
│   │   │       ├── MenuBrowsePage.tsx
│   │   │       ├── OrderHistoryPage.tsx
│   │   │       └── OrderTrackingPage.tsx
│   │   │
│   │   ├── services/
│   │   │   ├── api.ts               # Axios instance setup
│   │   │   ├── authService.ts       # Auth API calls
│   │   │   ├── menuService.ts       # Menu API calls
│   │   │   ├── orderService.ts      # Order API calls
│   │   │   ├── customizationService.ts  # Customization API
│   │   │   ├── paymentService.ts    # Payment API calls
│   │   │   ├── userService.ts       # User API calls
│   │   │   └── socket.ts            # Socket.IO client
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.ts           # Authentication hook
│   │   │   ├── useCart.ts           # Cart management hook
│   │   │   ├── useOrder.ts          # Order operations hook
│   │   │   ├── useMenu.ts           # Menu data hook
│   │   │   ├── useSocket.ts         # WebSocket connection hook
│   │   │   ├── useFetch.ts          # Data fetching hook
│   │   │   ├── useLocalStorage.ts   # Local storage hook
│   │   │   ├── useDebounce.ts       # Debounce hook
│   │   │   └── useToast.ts          # Toast notification hook
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.tsx      # Authentication state
│   │   │   ├── CartContext.tsx      # Shopping cart state
│   │   │   ├── OrderContext.tsx     # Order state
│   │   │   ├── ThemeContext.tsx     # Theme (light/dark mode)
│   │   │   └── NotificationContext.tsx  # Notifications
│   │   │
│   │   ├── styles/
│   │   │   ├── global.css           # Global styles
│   │   │   ├── variables.css        # CSS variables
│   │   │   ├── responsive.css       # Media queries
│   │   │   ├── animations.css       # CSS animations
│   │   │   ├── Menu.css
│   │   │   ├── MenuItem.css
│   │   │   ├── CategoryFilter.css
│   │   │   └── index.css            # Main entry
│   │   │
│   │   ├── utils/
│   │   │   ├── validators.ts        # Form validation
│   │   │   ├── formatters.ts        # Data formatters
│   │   │   ├── constants.ts         # App constants
│   │   │   ├── helpers.ts           # Utility functions
│   │   │   └── storage.ts           # LocalStorage helpers
│   │   │
│   │   ├── types/
│   │   │   ├── index.ts             # Main type exports
│   │   │   ├── user.types.ts        # User types
│   │   │   ├── menu.types.ts        # Menu types
│   │   │   ├── order.types.ts       # Order types
│   │   │   ├── payment.types.ts     # Payment types
│   │   │   └── api.types.ts         # API response types
│   │   │
│   │   ├── App.tsx                  # Root component
│   │   ├── main.tsx                 # App entry point
│   │   └── vite-env.d.ts            # Vite type declarations
│   │
│   ├── .env                         # Environment variables (gitignored)
│   ├── .env.example                 # Environment template
│   ├── .gitignore                   # Git ignore rules
│   ├── package.json                 # Dependencies & scripts
│   ├── package-lock.json            # Locked dependencies
│   ├── tsconfig.json                # TypeScript configuration
│   ├── tsconfig.app.json            # App TypeScript config
│   ├── tsconfig.node.json           # Node TypeScript config
│   ├── vite.config.ts               # Vite configuration
│   ├── eslint.config.js             # ESLint configuration
│   ├── tailwind.config.js           # Tailwind CSS config
│   ├── postcss.config.js            # PostCSS configuration
│   ├── index.html                   # HTML entry point
│   ├── Dockerfile                   # Docker container definition
│   └── README.md                    # Frontend documentation
│
├── Docs/
│   ├── README.md                    # Project overview
│   ├── ARCHITECTURE.md              # System architecture
│   ├── DATABASE_SCHEMA.md           # Data models
│   ├── API_DOCUMENTATION.md         # API endpoints
│   ├── SETUP_GUIDE.md               # Installation guide
│   ├── FILE_STRUCTURE.md            # This file
│   ├── DEPLOYMENT.md                # Deployment guide
│   ├── TROUBLESHOOTING.md           # Common issues
│   ├── CONTRIBUTING.md              # Contribution guide
│   └── diagrams/                    # Architecture diagrams
│       ├── system-architecture.png
│       ├── data-flow.png
│       └── database-erd.png
│
├── .github/
│   ├── workflows/
│   │   ├── deploy-backend.yml       # Backend CI/CD
│   │   ├── deploy-frontend.yml      # Frontend CI/CD
│   │   └── tests.yml                # Run tests
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   └── pull_request_template.md
│
├── docker-compose.yml               # Multi-container setup
├── .gitignore                       # Root git ignore
├── package.json                     # Root package file
├── README.md                        # Project README
└── LICENSE                          # Project license
```

---

## 📂 Directory Descriptions

### Backend Structure

#### `/src/config`
Configuration files for database, environment variables, and third-party services.

#### `/src/controllers`
Request handlers that process HTTP requests and return responses. Handle request/response cycle.

#### `/src/services`
Business logic layer. Contains core application logic separated from HTTP concerns.

#### `/src/models`
Data models and TypeScript interfaces/types for database documents.

#### `/src/routes`
API route definitions. Maps URLs to controller functions.

#### `/src/middleware`
Express middleware for authentication, validation, error handling, and logging.

#### `/src/utils`
Utility functions, helpers, constants, and shared code.

#### `/src/errors`
Custom error classes for consistent error handling.

#### `/src/tests`
Unit and integration tests using Jest.

---

### Frontend Structure

#### `/src/components`
Reusable React components organized by feature:
- **Auth**: Login, registration, password reset
- **Menu**: Menu display and filtering
- **Order**: Cart, checkout, order tracking
- **Customization**: Food customization interface
- **Dashboard**: Role-specific dashboards
- **Common**: Shared UI components
- **Layout**: Page layout wrappers

#### `/src/pages`
Full page components that compose multiple components.

#### `/src/services`
API communication layer using Axios and WebSocket clients.

#### `/src/hooks`
Custom React hooks for reusable logic (auth, cart, data fetching).

#### `/src/context`
React Context providers for global state management.

#### `/src/styles`
CSS files including global styles, variables, and component styles.

#### `/src/utils`
Utility functions for validation, formatting, and helpers.

#### `/src/types`
TypeScript type definitions and interfaces.

---

## 🎯 Key Files

### Backend Key Files

| File | Purpose |
|------|---------|
| `src/server.ts` | Application entry point |
| `src/app.ts` | Express app configuration |
| `src/config/database.ts` | Database connection setup |
| `src/middleware/authMiddleware.ts` | JWT authentication |
| `src/routes/index.ts` | Route aggregator |

### Frontend Key Files

| File | Purpose |
|------|---------|
| `src/main.tsx` | Application entry point |
| `src/App.tsx` | Root component with routing |
| `src/services/api.ts` | Axios configuration |
| `src/context/AuthContext.tsx` | Authentication state |
| `src/context/CartContext.tsx` | Shopping cart state |

---

## 📋 Configuration Files

### Backend Configuration

- **tsconfig.json**: TypeScript compiler options
- **package.json**: Dependencies, scripts, project metadata
- **nodemon.json**: Auto-reload configuration for development
- **jest.config.js**: Testing framework configuration
- **.env**: Environment variables (not committed to git)

### Frontend Configuration

- **vite.config.ts**: Vite build tool configuration
- **tsconfig.json**: TypeScript settings for the app
- **tailwind.config.js**: Tailwind CSS customization
- **eslint.config.js**: Code linting rules
- **package.json**: Dependencies and build scripts

---

## 🚫 Ignored Files (.gitignore)

Files that should NOT be committed:

```
# Dependencies
node_modules/
package-lock.json (optional)

# Environment
.env
.env.local

# Logs
logs/
*.log

# Build output
dist/
build/

# Uploads
uploads/

# IDE
.vscode/
.idea/
*.swp

# OS
.DS_Store
Thumbs.db
```

---

## 📦 Build Output

### Backend Build
- **dist/**: Compiled TypeScript → JavaScript
- Production-ready Node.js code

### Frontend Build
- **dist/**: Bundled HTML, CSS, JS
- Optimized static files for deployment

---

## 🔄 File Naming Conventions

### Components
- PascalCase: `MenuItem.tsx`, `OrderCard.tsx`
- Co-located styles: `MenuItem.css`

### Services & Utilities
- camelCase: `authService.ts`, `validators.ts`

### Types & Interfaces
- PascalCase with `.types.ts`: `User.types.ts`

### Constants
- UPPER_SNAKE_CASE in files: `constants.ts`

---

## 📌 Best Practices

✅ **Keep components small**: Single responsibility principle
✅ **Colocation**: Keep related files together (component + styles)
✅ **Separation of concerns**: Services separate from UI logic
✅ **Type safety**: Use TypeScript interfaces consistently
✅ **Modularity**: Reusable, composable components
✅ **Testing**: Tests alongside source files or in `/tests`

---

## 🔗 Related Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - System design
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - API endpoints
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Installation steps
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Development guidelines

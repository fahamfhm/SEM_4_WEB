# System Architecture

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER (React + Vite)             │
├─────────────┬──────────────┬──────────────┬─────────────────┤
│  Customer   │   Kitchen    │    Admin     │   Staff         │
│  Dashboard  │   Display    │   Dashboard  │   Dashboard     │
└──────────┬──────────────────────────────────────────────────┘
           │
           │ HTTP/WebSocket (Axios + Socket.IO)
           │
┌──────────▼──────────────────────────────────────────────────┐
│                   API LAYER (Express.js)                    │
├────────────┬──────────────┬──────────────┬─────────────────┤
│  Auth      │  Menu        │  Order       │  Customization  │
│  Routes    │  Routes      │  Routes      │  Routes         │
└──────────┬──────────────────────────────────────────────────┘
           │
           │ Data Access Layer
           │
┌──────────▼──────────────────────────────────────────────────┐
│              SERVICE LAYER (Business Logic)                 │
├────────────┬──────────────┬──────────────┬─────────────────┤
│  Auth      │  Menu        │  Order       │  Notification   │
│  Service   │  Service     │  Service     │  Service        │
└──────────┬──────────────────────────────────────────────────┘
           │
           │ Document Operations (SDK)
           │
┌──────────▼──────────────────────────────────────────────────┐
│         DATA LAYER (Azure Cosmos DB / MongoDB)              │
├────────────┬──────────────┬──────────────┬─────────────────┤
│  Users     │  MenuItems   │  Orders      │  Customizations │
│  Container │  Container   │  Container   │  Container      │
└────────────┴──────────────┴──────────────┴─────────────────┘
```

## 🔄 Data Flow

### Order Placement Flow
1. Customer selects menu item
2. Customization modal opens (Context API manages state)
3. Price updates based on customizations
4. Item added to cart (CartContext)
5. Checkout → Payment processing
6. Order created in Cosmos DB
7. WebSocket event triggers kitchen display
8. Real-time status updates to customer

### Real-time Update Flow
1. Admin/Staff updates order status
2. Socket.IO emits `order:statusChanged` event
3. All connected clients receive update
4. UI re-renders with new status
5. Customer notified of change

## 🏛️ Service Architecture

### Backend Services

**AuthService**
- User registration & login
- JWT token generation & validation
- Password hashing (bcrypt)
- Role assignment & verification

**MenuService**
- CRUD operations for menu items
- Category management
- Image upload handling
- Availability status management
- Search & filter functionality

**OrderService**
- Order creation & management
- Status workflow management
- Order validation
- Price calculation with customizations
- Order history retrieval

**CustomizationService**
- Customization option management
- Price calculation logic
- Ingredient/extra/removal handling
- Special notes processing

**NotificationService**
- WebSocket event broadcasting
- Real-time order updates
- User notifications
- Email notifications (optional)

## 🔐 Authentication & Authorization

**JWT Flow:**
1. User login → Credentials validated
2. JWT token generated (access + refresh)
3. Token stored in secure HttpOnly cookie
4. Protected routes verified via middleware
5. Token refresh on expiration

**Role-Based Access Control (RBAC):**
- **Customer:** Browse menu, place orders, track status
- **Kitchen Staff:** View assigned orders, update preparation status
- **Admin:** Full system access, analytics, menu management

## 🌐 API Layer Design

**RESTful Endpoints:**
- `/api/auth/*` - Authentication
- `/api/menu/*` - Menu operations
- `/api/orders/*` - Order management
- `/api/customizations/*` - Customization templates
- `/api/users/*` - User profiles

**WebSocket Events:**
- `order:created` - New order notification
- `order:statusChanged` - Status update
- `order:accepted` - Order accepted by kitchen
- `kitchen:busy` - Kitchen status

## 💾 Data Consistency & Cosmos DB Best Practices

### Partition Key Strategy
- **Orders Collection:** Partitioned by `customerId` for customer-centric queries
- **MenuItems Collection:** Partitioned by `category` for efficient filtering
- **Users Collection:** Partitioned by `email` for unique user identification

### Minimizing Cross-Partition Queries
- Embed customization details within order items to avoid joins
- Store price history with order to avoid dependent lookups
- Denormalize frequently accessed data (menu prices, item names)

### Handling Large Datasets
- Use **Hierarchical Partition Keys (HPK)** for Orders if single partition exceeds 20GB
- Implement pagination with continuation tokens
- Archive old orders to separate container with TTL

### Request Unit (RU) Optimization
- Point reads (single partition): ~1 RU
- Query operations: Optimize with indexed partition key
- Bulk operations: Batch writes for better throughput
- Monitor RU consumption via diagnostic logging

### Error Handling & Retries
- Handle `429 (Too Many Requests)` with exponential backoff
- Implement retry-after header from Cosmos DB
- Log diagnostic information for latency analysis

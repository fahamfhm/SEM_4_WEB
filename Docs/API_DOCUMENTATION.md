# API Documentation

Base URL: `http://localhost:5000/api`

## 🔐 Authentication Endpoints

### POST `/auth/register`
Register new user

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe",
  "phone": "+94123456789",
  "role": "customer"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "customer"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Error:** `400 Bad Request`
```json
{
  "success": false,
  "error": "Email already exists"
}
```

---

### POST `/auth/login`
User login with credentials

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "customer"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Error:** `401 Unauthorized`
```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

---

### POST `/auth/refresh`
Refresh JWT token

**Request:** (Include expired token in Authorization header)
```bash
Authorization: Bearer <expired_token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

## 🍽️ Menu Endpoints

### GET `/menu/items`
Fetch all menu items with filtering

**Query Parameters:**
- `category` (optional) - "Burgers", "Hot Dogs", "Drinks", "Desserts"
- `search` (optional) - Search by name/description
- `page` (optional, default: 1) - Pagination
- `limit` (optional, default: 10) - Items per page
- `inStock` (optional) - true/false

**Example:**
```bash
GET /menu/items?category=Burgers&page=1&limit=10
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "menu-item-uuid",
      "name": "Classic Burger",
      "basePrice": 450.00,
      "category": "Burgers",
      "image": "https://...",
      "isVegetarian": false,
      "customizationGroups": [...]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25
  }
}
```

---

### GET `/menu/items/:itemId`
Get single menu item details

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "menu-item-uuid",
    "name": "Classic Burger",
    "description": "Juicy beef patty with fresh toppings",
    "basePrice": 450.00,
    "customizationGroups": [...]
  }
}
```

---

### GET `/menu/categories`
Get all menu categories

**Response:** `200 OK`
```json
{
  "success": true,
  "data": ["Burgers", "Hot Dogs", "Drinks", "Desserts"]
}
```

---

### POST `/menu/items` (Admin Only)
Create new menu item

**Authorization:** Bearer token (Admin role required)

**Request:**
```json
{
  "name": "Deluxe Burger",
  "description": "Premium beef with special sauce",
  "category": "Burgers",
  "basePrice": 550.00,
  "isVegetarian": false,
  "preparationTime": 15,
  "customizationGroups": [
    {
      "name": "Add-ons",
      "type": "addons",
      "options": [
        { "name": "Extra Cheese", "price": 50 },
        { "name": "Bacon", "price": 80 }
      ]
    }
  ]
}
```

**Response:** `201 Created`

---

### PATCH `/menu/items/:itemId` (Admin Only)
Update menu item

**Request:**
```json
{
  "basePrice": 600.00,
  "availability": { "inStock": false, "outOfStockReason": "Ingredient shortage" }
}
```

**Response:** `200 OK`

---

## 📦 Order Endpoints

### POST `/orders`
Create new order (Authenticated)

**Authorization:** Bearer token

**Request:**
```json
{
  "items": [
    {
      "menuItemId": "menu-item-uuid",
      "quantity": 2,
      "customizations": [
        {
          "groupId": "group-1",
          "selectedOptions": ["cheese", "bacon"]
        }
      ]
    }
  ],
  "orderType": "dine-in",
  "tableNumber": 5,
  "specialNotes": "No onions"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "order": {
    "id": "order-uuid",
    "orderNumber": "ORD-2025-12-001",
    "status": "placed",
    "total": 1150.00,
    "items": [...]
  }
}
```

**WebSocket Event Emitted:**
```javascript
socket.emit('order:created', {
  id: 'order-uuid',
  orderNumber: 'ORD-2025-12-001',
  customerId: 'user-uuid',
  status: 'placed'
});
```

---

### GET `/orders`
Get user's orders (Authenticated)

**Query Parameters:**
- `status` (optional) - Filter by status
- `page` (optional) - Pagination
- `limit` (optional) - Items per page

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "order-uuid",
      "orderNumber": "ORD-2025-12-001",
      "status": "preparing",
      "total": 1150.00,
      "createdAt": "2025-12-22T10:45:00Z"
    }
  ]
}
```

---

### GET `/orders/:orderId`
Get order details (Authenticated)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "order-uuid",
    "orderNumber": "ORD-2025-12-001",
    "items": [...],
    "status": "preparing",
    "statusHistory": [
      {
        "status": "placed",
        "timestamp": "2025-12-22T10:45:00Z"
      }
    ],
    "total": 1150.00
  }
}
```

---

### PATCH `/orders/:orderId/status` (Staff/Admin Only)
Update order status

**Authorization:** Bearer token (Staff/Admin role required)

**Request:**
```json
{
  "status": "ready",
  "notes": "Order is ready for pickup"
}
```

**Response:** `200 OK`

**WebSocket Event Emitted:**
```javascript
socket.emit('order:statusChanged', {
  orderId: 'order-uuid',
  status: 'ready',
  timestamp: '2025-12-22T10:50:00Z',
  updatedBy: 'staff-uuid'
});
```

---

### PATCH `/orders/:orderId/cancel`
Cancel order (if not started) - (Authenticated)

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Order cancelled successfully"
}
```

---

## 💳 Payment Endpoints

### POST `/payments`
Process payment (Authenticated)

**Request:**
```json
{
  "orderId": "order-uuid",
  "method": "card",
  "amount": 1150.00,
  "stripeToken": "tok_visa"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "payment": {
    "id": "payment-uuid",
    "orderId": "order-uuid",
    "status": "completed",
    "transactionId": "txn-123456"
  }
}
```

---

## 🔔 WebSocket Events

### Connection
```javascript
const socket = io('http://localhost:5000', {
  auth: {
    token: 'jwt_token'
  }
});

socket.on('connect', () => {
  console.log('Connected to server');
});
```

### Listen Events

**Order Created (Kitchen Staff)**
```javascript
socket.on('order:created', (order) => {
  console.log('New order:', order);
  // Update kitchen display
});
```

**Order Status Changed (All)**
```javascript
socket.on('order:statusChanged', (data) => {
  console.log('Order updated:', data.orderId, data.status);
  // Update customer dashboard & kitchen display
});
```

**Kitchen Busy Status (Admin)**
```javascript
socket.on('kitchen:busy', (status) => {
  console.log('Kitchen is busy:', status);
});
```

---

## ❌ Error Handling

All endpoints return consistent error format:

```json
{
  "success": false,
  "error": "Invalid email format",
  "statusCode": 400,
  "timestamp": "2025-12-22T10:30:00Z"
}
```

**HTTP Status Codes:**
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limit)
- `500` - Server Error

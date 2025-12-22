# Database Schema & Data Models

## 📊 Collections Overview

Azure Cosmos DB (NoSQL document database) with optimized partition keys following best practices.

### 1. Users Collection

**Partition Key:** `email` (High Cardinality - Unique)

```json
{
  "id": "user-uuid",
  "email": "customer@example.com",
  "name": "John Doe",
  "password": "hashed_password",
  "role": "customer",
  "phone": "+94123456789",
  "address": {
    "street": "123 Main St",
    "city": "Colombo",
    "postalCode": "00700",
    "country": "Sri Lanka"
  },
  "preferences": {
    "language": "en",
    "notifications": true,
    "darkMode": false
  },
  "createdAt": "2025-12-22T10:30:00Z",
  "updatedAt": "2025-12-22T10:30:00Z",
  "isActive": true
}
```

**Indexes:**
```
id, email, createdAt
```

---

### 2. MenuItems Collection

**Partition Key:** `category` (Low-Medium Cardinality)

```json
{
  "id": "menu-item-uuid",
  "name": "Classic Burger",
  "description": "Juicy beef patty with fresh toppings",
  "category": "Burgers",
  "basePrice": 450.00,
  "currency": "LKR",
  "image": "url-to-cloudinary-image",
  "isVegetarian": false,
  "availability": {
    "inStock": true,
    "outOfStockReason": null
  },
  "customizationGroups": [
    {
      "id": "group-1",
      "name": "Add-ons",
      "type": "addons",
      "isRequired": false,
      "options": [
        {
          "id": "cheese",
          "name": "Extra Cheese",
          "price": 50
        },
        {
          "id": "bacon",
          "name": "Bacon",
          "price": 80
        }
      ]
    },
    {
      "id": "group-2",
      "name": "Spice Level",
      "type": "single_select",
      "isRequired": true,
      "options": [
        { "id": "mild", "name": "Mild", "price": 0 },
        { "id": "medium", "name": "Medium", "price": 0 },
        { "id": "hot", "name": "Hot", "price": 0 }
      ]
    }
  ],
  "preparationTime": 15,
  "tags": ["popular", "bestseller"],
  "createdAt": "2025-12-22T10:30:00Z",
  "updatedAt": "2025-12-22T10:30:00Z"
}
```

**Indexes:**
```
id, category, name, tags
```

---

### 3. Orders Collection

**Partition Key:** `customerId` (Very High Cardinality - Customer-Centric)

```json
{
  "id": "order-uuid",
  "customerId": "user-uuid",
  "orderNumber": "ORD-2025-12-001",
  "items": [
    {
      "id": "order-item-1",
      "menuItemId": "menu-item-uuid",
      "name": "Classic Burger",
      "basePrice": 450.00,
      "quantity": 2,
      "customizations": [
        {
          "groupName": "Add-ons",
          "groupType": "addons",
          "selectedOptions": [
            {
              "id": "cheese",
              "name": "Extra Cheese",
              "price": 50
            }
          ],
          "customizationPrice": 50.00
        }
      ],
      "itemTotal": 1000.00
    }
  ],
  "orderType": "dine-in",
  "tableNumber": 5,
  "pickupTime": null,
  "status": "preparing",
  "statusHistory": [
    {
      "status": "placed",
      "timestamp": "2025-12-22T10:45:00Z",
      "updatedBy": "system"
    },
    {
      "status": "accepted",
      "timestamp": "2025-12-22T10:46:00Z",
      "updatedBy": "staff-uuid"
    }
  ],
  "subtotal": 1000.00,
  "tax": 150.00,
  "deliveryFee": 0,
  "total": 1150.00,
  "paymentStatus": "pending",
  "paymentMethod": "cash",
  "specialNotes": "No onions, extra sauce",
  "createdAt": "2025-12-22T10:45:00Z",
  "updatedAt": "2025-12-22T10:46:00Z",
  "completedAt": null
}
```

**Indexes:**
```
id, customerId, status, createdAt
```

**Query Pattern Benefits:**
- Fast customer order history: `SELECT * FROM orders WHERE customerId = @customerId`
- Status filtering: `SELECT * FROM orders WHERE customerId = @customerId AND status = @status`
- Minimal cross-partition queries

---

### 4. Customizations Collection

**Partition Key:** `type` (Low Cardinality - Template Storage)

```json
{
  "id": "customization-uuid",
  "name": "Add-ons",
  "type": "addons",
  "applicableCategories": ["Burgers", "Hot Dogs", "Sandwiches"],
  "options": [
    {
      "id": "cheese",
      "name": "Extra Cheese",
      "price": 50.00,
      "available": true
    },
    {
      "id": "bacon",
      "name": "Bacon",
      "price": 80.00,
      "available": true
    }
  ],
  "isRequired": false,
  "allowMultiple": true,
  "createdAt": "2025-12-22T10:30:00Z",
  "updatedAt": "2025-12-22T10:30:00Z"
}
```

---

### 5. Tables Collection

**Partition Key:** `section` (Low-Medium Cardinality)

```json
{
  "id": "table-uuid",
  "tableNumber": 5,
  "capacity": 4,
  "section": "Main Hall",
  "qrCode": "https://qr-code-url.png",
  "status": "available",
  "currentOrderId": null,
  "createdAt": "2025-12-22T10:30:00Z"
}
```

---

### 6. Payments Collection

**Partition Key:** `customerId` (Very High Cardinality - User-Centric)

```json
{
  "id": "payment-uuid",
  "orderId": "order-uuid",
  "customerId": "user-uuid",
  "amount": 1150.00,
  "currency": "LKR",
  "method": "card",
  "status": "completed",
  "transactionId": "txn-123456",
  "provider": "stripe",
  "metadata": {
    "last4": "4242",
    "cardBrand": "visa"
  },
  "createdAt": "2025-12-22T10:45:00Z",
  "completedAt": "2025-12-22T10:46:00Z"
}
```

---

### 7. Analytics Collection

**Partition Key:** `date` (Medium Cardinality - Time-Series)
**TTL:** 7776000 seconds (90 days)

```json
{
  "id": "analytics-uuid",
  "date": "2025-12-22",
  "totalOrders": 45,
  "totalRevenue": 54855.00,
  "averageOrderValue": 1219.00,
  "topItems": [
    {
      "itemId": "menu-item-1",
      "name": "Classic Burger",
      "quantity": 23,
      "revenue": 10350.00
    }
  ],
  "ordersByHour": {
    "11": 8,
    "12": 15,
    "13": 22
  },
  "ordersByType": {
    "dine-in": 30,
    "takeaway": 15
  },
  "customizationPopularity": {
    "cheese": 38,
    "bacon": 25,
    "extra-sauce": 42
  },
  "paymentMethods": {
    "cash": 25,
    "card": 18,
    "online": 2
  },
  "ttl": 7776000,
  "createdAt": "2025-12-22T23:59:00Z"
}
```

---

## 🔑 Partition Key Strategy Summary

| Collection | Partition Key | Cardinality | Query Pattern | RU Efficiency |
|-----------|---------------|-------------|---------------|---------------|
| Users | `email` | Very High | Auth, profile lookup | Excellent |
| MenuItems | `category` | Low-Medium | Browse by category | Good |
| Orders | `customerId` | Very High | Order history, status | Excellent |
| Customizations | `type` | Low | Template lookups | Good |
| Tables | `section` | Low-Medium | Section management | Good |
| Payments | `customerId` | Very High | Payment history | Excellent |
| Analytics | `date` | Medium | Daily reports | Good |

---

## 🎯 Data Modeling Best Practices Applied

✅ **Minimized Cross-Partition Queries:**
- Customization details embedded in order items
- Price history stored with order (no dependent lookups)
- User addresses embedded in user document

✅ **Avoided Large Documents:**
- Order items array managed (2MB limit safe)
- Status history keeps only essential fields
- Old analytics archived with TTL

✅ **High Cardinality Partition Keys:**
- `customerId` ensures even distribution
- `email` provides unique user identification
- Avoids hot partition bottlenecks

✅ **Query Optimization:**
- Indexed on frequently filtered fields
- Supporting most common access patterns
- Reduced RU consumption per operation

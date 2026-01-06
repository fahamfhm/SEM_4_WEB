# Menu Management API

Complete implementation of the Menu Management system for the Smart Restaurant application.

## Features Implemented ✅

1. **CRUD Operations** - Full Create, Read, Update, Delete for menu items
2. **Category-based Filtering** - Filter items by category (Burgers, Hot Dogs, Drinks, etc.)
3. **Image Upload Handling** - Multer + Cloudinary integration for image management
4. **Availability Status Tracking** - Track in-stock/out-of-stock status with reasons
5. **Search Functionality** - Full-text search across name, description, and tags
6. **Customization Groups** - Support for add-ons, spice levels, removals, and more

## API Endpoints

### Public Endpoints

#### Get All Menu Items
```http
GET /api/menu/items
```

**Query Parameters:**
- `category` - Filter by category (Burgers, Hot Dogs, Drinks, Desserts, Sides, Specials)
- `search` - Full-text search query
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `inStock` - Filter by availability (true/false)
- `isVegetarian` - Filter vegetarian items (true/false)
- `sortBy` - Sort field (default: createdAt)
- `order` - Sort order (asc/desc, default: desc)

**Example:**
```bash
GET /api/menu/items?category=Burgers&page=1&limit=10&inStock=true
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

#### Get Single Menu Item
```http
GET /api/menu/items/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Classic Burger",
    "description": "Juicy beef patty...",
    "category": "Burgers",
    "basePrice": 450,
    "image": "https://...",
    "customizationGroups": [...]
  }
}
```

#### Get All Categories
```http
GET /api/menu/categories
```

**Response:**
```json
{
  "success": true,
  "data": ["Burgers", "Hot Dogs", "Drinks", "Desserts"]
}
```

### Admin Endpoints

#### Create Menu Item
```http
POST /api/menu/items
Content-Type: multipart/form-data
```

**Form Data:**
- `name` - Item name (required)
- `description` - Item description (required)
- `category` - Category (required)
- `basePrice` - Base price (required)
- `image` - Image file (optional)
- `isVegetarian` - Boolean (optional)
- `preparationTime` - Minutes (optional)
- `tags` - Array of strings (optional)
- `customizationGroups` - JSON array (optional)

**Example using curl:**
```bash
curl -X POST http://localhost:5000/api/menu/items \
  -F "name=Classic Burger" \
  -F "description=Juicy beef patty with fresh toppings" \
  -F "category=Burgers" \
  -F "basePrice=450" \
  -F "image=@/path/to/image.jpg" \
  -F "isVegetarian=false"
```

#### Update Menu Item
```http
PUT /api/menu/items/:id
Content-Type: multipart/form-data
```

Same form data as create, all fields optional.

#### Delete Menu Item
```http
DELETE /api/menu/items/:id
```

**Response:**
```json
{
  "success": true,
  "data": {},
  "message": "Menu item deleted successfully"
}
```

#### Update Availability
```http
PATCH /api/menu/items/:id/availability
Content-Type: application/json
```

**Body:**
```json
{
  "inStock": false,
  "outOfStockReason": "Ingredient shortage"
}
```

#### Bulk Update Availability
```http
PATCH /api/menu/items/bulk-availability
Content-Type: application/json
```

**Body:**
```json
{
  "itemIds": ["id1", "id2", "id3"],
  "inStock": false,
  "outOfStockReason": "Maintenance"
}
```

### Customization Management

#### Add Customization Group
```http
POST /api/menu/items/:id/customizations
Content-Type: application/json
```

**Body:**
```json
{
  "id": "spice-level",
  "name": "Spice Level",
  "type": "single_select",
  "isRequired": true,
  "options": [
    { "id": "mild", "name": "Mild", "price": 0 },
    { "id": "medium", "name": "Medium", "price": 0 },
    { "id": "hot", "name": "Hot", "price": 0 }
  ]
}
```

#### Update Customization Group
```http
PUT /api/menu/items/:id/customizations/:groupId
Content-Type: application/json
```

#### Delete Customization Group
```http
DELETE /api/menu/items/:id/customizations/:groupId
```

## Customization Types

1. **addons** - Multiple selection add-ons (Extra cheese, Bacon, etc.)
2. **single_select** - Single choice options (Spice level, Size, etc.)
3. **multi_select** - Multiple choice options (Toppings, Extras)
4. **removals** - Items to remove (No onions, No pickles, etc.)

## Data Model

### MenuItem Schema
```javascript
{
  name: String (required, max 100 chars),
  description: String (required, max 500 chars),
  category: Enum (required),
  basePrice: Number (required, min 0),
  currency: String (default: "LKR"),
  image: String (URL),
  imagePublicId: String (Cloudinary ID),
  isVegetarian: Boolean,
  availability: {
    inStock: Boolean,
    outOfStockReason: String
  },
  customizationGroups: [CustomizationGroup],
  preparationTime: Number (minutes),
  tags: [String],
  calories: Number,
  allergens: [String],
  spiceLevel: Enum,
  timestamps: true
}
```

## Image Upload

### Supported Formats
- JPEG, JPG, PNG, WEBP, GIF

### Size Limit
- Maximum: 5MB per image

### Storage
- Images automatically uploaded to Cloudinary
- Transformed to 800x600 with quality optimization
- Local temporary files cleaned up after upload

## Search & Filtering

### Text Search
MongoDB text index on: `name`, `description`, `tags`

```http
GET /api/menu/items?search=burger
```

### Category Filter
```http
GET /api/menu/items?category=Burgers
```

### Availability Filter
```http
GET /api/menu/items?inStock=true
```

### Combined Filters
```http
GET /api/menu/items?category=Burgers&inStock=true&isVegetarian=false&search=cheese
```

## Environment Variables

Add these to your `.env` file:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/restaurant_db

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## Testing the API

### Using Postman or Thunder Client

1. **Get all items:**
   ```
   GET http://localhost:5000/api/menu/items
   ```

2. **Search for burgers:**
   ```
   GET http://localhost:5000/api/menu/items?search=burger&category=Burgers
   ```

3. **Create new item (with image):**
   - Method: POST
   - URL: http://localhost:5000/api/menu/items
   - Body: form-data
   - Add fields and image file

4. **Update availability:**
   ```
   PATCH http://localhost:5000/api/menu/items/:id/availability
   Body: { "inStock": false, "outOfStockReason": "Sold out" }
   ```

## Error Handling

All endpoints return errors in this format:

```json
{
  "success": false,
  "error": "Error message here",
  "stack": "Stack trace (dev only)"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Server Error

## Next Steps

- [ ] Add authentication middleware
- [ ] Implement role-based access control
- [ ] Add rate limiting
- [ ] Set up automated tests
- [ ] Add caching layer (Redis)
- [ ] Implement soft deletes
- [ ] Add audit logging
- [ ] Set up monitoring and alerts

## Dependencies

```json
{
  "express": "^5.2.1",
  "mongoose": "^9.1.1",
  "multer": "File upload middleware",
  "cloudinary": "Image hosting service",
  "express-validator": "Input validation",
  "cors": "Cross-origin requests",
  "dotenv": "Environment variables"
}
```

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # MongoDB connection
│   │   └── cloudinary.js        # Cloudinary setup
│   ├── controllers/
│   │   └── menuController.js    # Menu logic (14 functions)
│   ├── models/
│   │   └── MenuItem.js          # Menu item schema
│   ├── routes/
│   │   └── menuRoutes.js        # API routes
│   ├── middleware/
│   │   ├── upload.js            # Multer config
│   │   └── errorHandler.js      # Error handling
│   └── utils/
│       └── validators.js        # Input validation
├── uploads/
│   └── menu-images/             # Temporary image storage
└── server.js                    # Entry point
```

## Notes

- Images are stored on Cloudinary, not locally
- Local uploads folder is for temporary storage only
- Authentication is commented out for development
- Add `protect` and `authorize` middleware for production
- Validation is implemented using express-validator
- All queries are optimized with MongoDB indexes

# Setup Guide - Menu Management System

## ✅ Implementation Complete!

All menu management features have been successfully implemented:

- ✅ CRUD operations for menu items
- ✅ Category-based filtering
- ✅ Image upload handling (Multer + Cloudinary)
- ✅ Availability status tracking
- ✅ Search functionality
- ✅ Customization groups (add-ons, spice levels, removals)

## 📝 Files Created

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          ✅ MongoDB connection
│   │   └── cloudinary.js        ✅ Cloudinary setup
│   ├── controllers/
│   │   └── menuController.js    ✅ 14 controller functions
│   ├── models/
│   │   └── MenuItem.js          ✅ Complete schema with validation
│   ├── routes/
│   │   └── menuRoutes.js        ✅ All API routes
│   ├── middleware/
│   │   ├── upload.js            ✅ Multer configuration
│   │   └── errorHandler.js      ✅ Error handling
│   └── utils/
│       └── validators.js        ✅ Input validation
├── uploads/menu-images/         ✅ Created
├── MENU_API.md                  ✅ Complete API documentation
└── .gitignore                   ✅ Updated
```

## 🚀 Next Steps to Run the Application

### Option 1: Use MongoDB Atlas (Cloud - Recommended)

1. **Create MongoDB Atlas Account**
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free tier

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose FREE tier
   - Select a region close to you
   - Click "Create"

3. **Setup Database Access**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Create username and password
   - Grant "Read and Write" privileges

4. **Setup Network Access**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)

5. **Get Connection String**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string

6. **Update .env file**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/restaurant_db?retryWrites=true&w=majority
   ```
   Replace `username`, `password`, and `cluster` with your details

### Option 2: Use Local MongoDB

1. **Install MongoDB**
   - Download from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
   - Run installer
   - Start MongoDB service

2. **Verify MongoDB is Running**
   ```powershell
   mongosh
   ```

3. **.env is already configured** for local MongoDB:
   ```env
   MONGODB_URI=mongodb://localhost:27017/restaurant_db
   ```

### Setup Cloudinary (Required for Image Uploads)

1. **Create Cloudinary Account**
   - Go to [cloudinary.com](https://cloudinary.com)
   - Sign up for free

2. **Get Your Credentials**
   - Go to Dashboard
   - Copy: Cloud Name, API Key, API Secret

3. **Update .env**
   ```env
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

## 🏃 Run the Server

```powershell
cd F:\Projects\Web\2025\SEM_4_WEB\backend
npm start
```

You should see:
```
Server running on port 5000
MongoDB Connected: localhost
```

## 🧪 Test the API

### 1. Using Browser
```
http://localhost:5000
```

### 2. Get All Categories
```
http://localhost:5000/api/menu/categories
```

### 3. Using Thunder Client / Postman

**Create a Menu Item:**
```
POST http://localhost:5000/api/menu/items
Body: form-data

name: Classic Burger
description: Juicy beef patty with fresh toppings
category: Burgers
basePrice: 450
isVegetarian: false
preparationTime: 15
image: [upload a file]
```

**Get All Menu Items:**
```
GET http://localhost:5000/api/menu/items
```

**Search Items:**
```
GET http://localhost:5000/api/menu/items?search=burger&category=Burgers
```

**Update Availability:**
```
PATCH http://localhost:5000/api/menu/items/:id/availability
Content-Type: application/json

{
  "inStock": false,
  "outOfStockReason": "Ingredient shortage"
}
```

## 📚 Documentation

Complete API documentation is available in:
- [MENU_API.md](./MENU_API.md)

## 🔧 Development Scripts

Add these to `package.json` for better development experience:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

Then install nodemon (already installed):
```powershell
# Run with auto-reload
npm run dev
```

## 🎯 API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/menu/items` | Get all menu items (with filters) |
| GET | `/api/menu/items/:id` | Get single menu item |
| GET | `/api/menu/categories` | Get all categories |
| POST | `/api/menu/items` | Create new menu item |
| PUT | `/api/menu/items/:id` | Update menu item |
| DELETE | `/api/menu/items/:id` | Delete menu item |
| PATCH | `/api/menu/items/:id/availability` | Update availability |
| PATCH | `/api/menu/items/bulk-availability` | Bulk update availability |
| POST | `/api/menu/items/:id/customizations` | Add customization group |
| PUT | `/api/menu/items/:id/customizations/:groupId` | Update customization |
| DELETE | `/api/menu/items/:id/customizations/:groupId` | Delete customization |

## 🎨 Example Menu Item with Customizations

```json
{
  "name": "Classic Burger",
  "description": "Juicy beef patty with fresh lettuce, tomatoes, and our special sauce",
  "category": "Burgers",
  "basePrice": 450,
  "isVegetarian": false,
  "preparationTime": 15,
  "tags": ["popular", "bestseller"],
  "customizationGroups": [
    {
      "id": "addons",
      "name": "Add-ons",
      "type": "addons",
      "isRequired": false,
      "options": [
        { "id": "cheese", "name": "Extra Cheese", "price": 50 },
        { "id": "bacon", "name": "Bacon", "price": 80 },
        { "id": "egg", "name": "Fried Egg", "price": 60 }
      ]
    },
    {
      "id": "spice",
      "name": "Spice Level",
      "type": "single_select",
      "isRequired": true,
      "options": [
        { "id": "mild", "name": "Mild", "price": 0 },
        { "id": "medium", "name": "Medium", "price": 0 },
        { "id": "hot", "name": "Hot", "price": 0 }
      ]
    },
    {
      "id": "removals",
      "name": "Remove Items",
      "type": "removals",
      "isRequired": false,
      "options": [
        { "id": "no-onions", "name": "No Onions", "price": 0 },
        { "id": "no-pickles", "name": "No Pickles", "price": 0 },
        { "id": "no-lettuce", "name": "No Lettuce", "price": 0 }
      ]
    }
  ]
}
```

## ⚠️ Important Notes

1. **Authentication**: Auth middleware is commented out for development. Uncomment in production.
2. **Image Storage**: Images are uploaded to Cloudinary, not stored locally
3. **Validation**: All inputs are validated using express-validator
4. **Error Handling**: Centralized error handler catches all errors
5. **Indexes**: MongoDB indexes are created for search and filtering performance

## 🔐 Production Checklist

Before deploying to production:

- [ ] Set up MongoDB Atlas with proper network restrictions
- [ ] Add authentication middleware
- [ ] Implement role-based access control (RBAC)
- [ ] Add rate limiting
- [ ] Enable HTTPS only
- [ ] Set up monitoring and logging
- [ ] Configure proper CORS origins
- [ ] Add input sanitization
- [ ] Set up automated backups
- [ ] Configure environment-specific settings

## 💡 Tips

1. **Search Performance**: Text indexes are created on name, description, and tags
2. **Image Optimization**: Cloudinary automatically optimizes images to 800x600
3. **Pagination**: Default is 10 items per page, adjustable via query params
4. **Filtering**: Combine multiple filters for precise results
5. **Bulk Operations**: Use bulk endpoints for updating multiple items

## 🐛 Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is running (local) or Atlas cluster is active
- Check connection string in .env
- Verify network access (Atlas)

**Image Upload Error:**
- Check Cloudinary credentials in .env
- Ensure file size is under 5MB
- Verify file format (jpeg, jpg, png, webp, gif)

**Validation Errors:**
- Check required fields are provided
- Verify data types match schema
- Ensure category is valid

## 📞 Support

For issues or questions, refer to:
- [MENU_API.md](./MENU_API.md) - Complete API documentation
- [Mongoose Docs](https://mongoosejs.com/) - Database queries
- [Multer Docs](https://github.com/expressjs/multer) - File uploads
- [Cloudinary Docs](https://cloudinary.com/documentation) - Image management

---

**Status:** ✅ Ready for Development & Testing

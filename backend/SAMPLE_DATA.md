# Sample Menu Items

Use these sample data to test your API. You can import them using Postman, Thunder Client, or curl.

## Sample Data JSON

```json
[
  {
    "name": "Classic Burger",
    "description": "Juicy beef patty with fresh lettuce, tomatoes, pickles, and our special sauce on a toasted bun",
    "category": "Burgers",
    "basePrice": 450,
    "currency": "LKR",
    "isVegetarian": false,
    "preparationTime": 15,
    "tags": ["popular", "bestseller"],
    "spiceLevel": "mild",
    "calories": 650,
    "allergens": ["gluten", "dairy"],
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
      }
    ]
  },
  {
    "name": "Veggie Delight Burger",
    "description": "Plant-based patty with avocado, caramelized onions, mushrooms, and chipotle mayo",
    "category": "Burgers",
    "basePrice": 420,
    "currency": "LKR",
    "isVegetarian": true,
    "preparationTime": 18,
    "tags": ["vegetarian", "healthy"],
    "spiceLevel": "medium",
    "calories": 520,
    "allergens": ["gluten", "soy"],
    "customizationGroups": [
      {
        "id": "extras",
        "name": "Extra Toppings",
        "type": "addons",
        "isRequired": false,
        "options": [
          { "id": "avocado", "name": "Extra Avocado", "price": 70 },
          { "id": "mushrooms", "name": "Extra Mushrooms", "price": 50 },
          { "id": "cheese", "name": "Vegan Cheese", "price": 60 }
        ]
      }
    ]
  },
  {
    "name": "Double Cheese Burger",
    "description": "Two beef patties with double cheddar cheese, crispy bacon, and BBQ sauce",
    "category": "Burgers",
    "basePrice": 650,
    "currency": "LKR",
    "isVegetarian": false,
    "preparationTime": 20,
    "tags": ["popular", "indulgent"],
    "spiceLevel": "mild",
    "calories": 890,
    "allergens": ["gluten", "dairy"],
    "customizationGroups": [
      {
        "id": "size",
        "name": "Size",
        "type": "single_select",
        "isRequired": true,
        "options": [
          { "id": "regular", "name": "Regular", "price": 0 },
          { "id": "large", "name": "Large (+1 patty)", "price": 200 }
        ]
      }
    ]
  },
  {
    "name": "Classic Hot Dog",
    "description": "Premium beef sausage with mustard, ketchup, and relish in a soft bun",
    "category": "Hot Dogs",
    "basePrice": 320,
    "currency": "LKR",
    "isVegetarian": false,
    "preparationTime": 10,
    "tags": ["quick", "classic"],
    "spiceLevel": "mild",
    "calories": 450,
    "allergens": ["gluten"],
    "customizationGroups": [
      {
        "id": "toppings",
        "name": "Toppings",
        "type": "multi_select",
        "isRequired": false,
        "options": [
          { "id": "cheese", "name": "Cheese Sauce", "price": 40 },
          { "id": "chili", "name": "Chili", "price": 50 },
          { "id": "onions", "name": "Crispy Onions", "price": 30 }
        ]
      }
    ]
  },
  {
    "name": "Spicy Chicken Hot Dog",
    "description": "Grilled chicken sausage with jalapeños, pepper jack cheese, and sriracha mayo",
    "category": "Hot Dogs",
    "basePrice": 380,
    "currency": "LKR",
    "isVegetarian": false,
    "preparationTime": 12,
    "tags": ["spicy", "chicken"],
    "spiceLevel": "hot",
    "calories": 520,
    "allergens": ["gluten", "dairy"]
  },
  {
    "name": "Coca-Cola",
    "description": "Classic Coca-Cola soft drink",
    "category": "Drinks",
    "basePrice": 120,
    "currency": "LKR",
    "isVegetarian": true,
    "preparationTime": 2,
    "tags": ["cold", "carbonated"],
    "spiceLevel": "none",
    "calories": 140,
    "customizationGroups": [
      {
        "id": "size",
        "name": "Size",
        "type": "single_select",
        "isRequired": true,
        "options": [
          { "id": "regular", "name": "Regular (330ml)", "price": 0 },
          { "id": "large", "name": "Large (500ml)", "price": 50 }
        ]
      },
      {
        "id": "ice",
        "name": "Ice",
        "type": "single_select",
        "isRequired": false,
        "options": [
          { "id": "no-ice", "name": "No Ice", "price": 0 },
          { "id": "regular-ice", "name": "Regular Ice", "price": 0 },
          { "id": "extra-ice", "name": "Extra Ice", "price": 0 }
        ]
      }
    ]
  },
  {
    "name": "Mango Smoothie",
    "description": "Fresh mango blended with yogurt and honey",
    "category": "Drinks",
    "basePrice": 280,
    "currency": "LKR",
    "isVegetarian": true,
    "preparationTime": 5,
    "tags": ["cold", "healthy", "fruit"],
    "spiceLevel": "none",
    "calories": 220,
    "allergens": ["dairy"]
  },
  {
    "name": "Chocolate Lava Cake",
    "description": "Warm chocolate cake with a molten chocolate center, served with vanilla ice cream",
    "category": "Desserts",
    "basePrice": 380,
    "currency": "LKR",
    "isVegetarian": true,
    "preparationTime": 8,
    "tags": ["hot", "chocolate", "popular"],
    "spiceLevel": "none",
    "calories": 480,
    "allergens": ["gluten", "dairy", "eggs"],
    "customizationGroups": [
      {
        "id": "extras",
        "name": "Add Extra",
        "type": "addons",
        "isRequired": false,
        "options": [
          { "id": "ice-cream", "name": "Extra Ice Cream Scoop", "price": 60 },
          { "id": "whipped-cream", "name": "Whipped Cream", "price": 40 }
        ]
      }
    ]
  },
  {
    "name": "Cheesecake Slice",
    "description": "Creamy New York-style cheesecake with graham cracker crust and berry compote",
    "category": "Desserts",
    "basePrice": 350,
    "currency": "LKR",
    "isVegetarian": true,
    "preparationTime": 5,
    "tags": ["cold", "creamy"],
    "spiceLevel": "none",
    "calories": 420,
    "allergens": ["gluten", "dairy", "eggs"]
  },
  {
    "name": "French Fries",
    "description": "Crispy golden fries seasoned with sea salt",
    "category": "Sides",
    "basePrice": 180,
    "currency": "LKR",
    "isVegetarian": true,
    "preparationTime": 8,
    "tags": ["crispy", "popular"],
    "spiceLevel": "mild",
    "calories": 320,
    "customizationGroups": [
      {
        "id": "size",
        "name": "Size",
        "type": "single_select",
        "isRequired": true,
        "options": [
          { "id": "regular", "name": "Regular", "price": 0 },
          { "id": "large", "name": "Large", "price": 80 }
        ]
      },
      {
        "id": "seasoning",
        "name": "Seasoning",
        "type": "single_select",
        "isRequired": false,
        "options": [
          { "id": "plain", "name": "Plain", "price": 0 },
          { "id": "cajun", "name": "Cajun", "price": 20 },
          { "id": "cheese", "name": "Cheese Powder", "price": 30 }
        ]
      }
    ]
  },
  {
    "name": "Onion Rings",
    "description": "Crispy battered onion rings served with ranch dip",
    "category": "Sides",
    "basePrice": 220,
    "currency": "LKR",
    "isVegetarian": true,
    "preparationTime": 10,
    "tags": ["crispy"],
    "spiceLevel": "mild",
    "calories": 380,
    "allergens": ["gluten"]
  }
]
```

## Quick Import Script

If you want to import all sample data at once, you can use this Node.js script:

**Create file:** `scripts/seedMenu.js`

```javascript
import mongoose from "mongoose";
import dotenv from "dotenv";
import MenuItem from "../src/models/MenuItem.js";

dotenv.config();

const sampleData = [
  // Paste the JSON data from above here
];

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Clear existing data
    await MenuItem.deleteMany();
    console.log("Existing data cleared");
    
    // Insert sample data
    await MenuItem.insertMany(sampleData);
    console.log("Sample data imported successfully");
    
    process.exit();
  } catch (error) {
    console.error("Error importing data:", error);
    process.exit(1);
  }
};

importData();
```

**Run the script:**
```powershell
node scripts/seedMenu.js
```

## Testing Individual Items with curl

### Create Classic Burger
```bash
curl -X POST http://localhost:5000/api/menu/items \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Classic Burger",
    "description": "Juicy beef patty with fresh lettuce, tomatoes, pickles, and our special sauce on a toasted bun",
    "category": "Burgers",
    "basePrice": 450,
    "isVegetarian": false,
    "preparationTime": 15,
    "tags": ["popular", "bestseller"]
  }'
```

### Create Veggie Burger
```bash
curl -X POST http://localhost:5000/api/menu/items \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Veggie Delight Burger",
    "description": "Plant-based patty with avocado",
    "category": "Burgers",
    "basePrice": 420,
    "isVegetarian": true,
    "preparationTime": 18
  }'
```

## Testing with Postman Collection

Import this Postman collection:

```json
{
  "info": {
    "name": "Restaurant Menu API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Get All Menu Items",
      "request": {
        "method": "GET",
        "url": "http://localhost:5000/api/menu/items"
      }
    },
    {
      "name": "Get Burgers Only",
      "request": {
        "method": "GET",
        "url": "http://localhost:5000/api/menu/items?category=Burgers"
      }
    },
    {
      "name": "Search Menu Items",
      "request": {
        "method": "GET",
        "url": "http://localhost:5000/api/menu/items?search=burger"
      }
    },
    {
      "name": "Create Menu Item",
      "request": {
        "method": "POST",
        "url": "http://localhost:5000/api/menu/items",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"name\": \"Classic Burger\",\n  \"description\": \"Juicy beef patty\",\n  \"category\": \"Burgers\",\n  \"basePrice\": 450,\n  \"isVegetarian\": false\n}"
        }
      }
    }
  ]
}
```

## Categories Available

- **Burgers** - Various burger options
- **Hot Dogs** - Hot dog variations
- **Drinks** - Beverages and smoothies
- **Desserts** - Sweet treats
- **Sides** - Fries, onion rings, etc.
- **Specials** - Special menu items

## Customization Types Examples

### 1. Add-ons (Multiple Selection)
```json
{
  "id": "addons",
  "name": "Add-ons",
  "type": "addons",
  "isRequired": false,
  "options": [
    { "id": "cheese", "name": "Extra Cheese", "price": 50 },
    { "id": "bacon", "name": "Bacon", "price": 80 }
  ]
}
```

### 2. Single Select (One Choice)
```json
{
  "id": "spice",
  "name": "Spice Level",
  "type": "single_select",
  "isRequired": true,
  "options": [
    { "id": "mild", "name": "Mild", "price": 0 },
    { "id": "hot", "name": "Hot", "price": 0 }
  ]
}
```

### 3. Removals (Items to Remove)
```json
{
  "id": "removals",
  "name": "Remove Items",
  "type": "removals",
  "isRequired": false,
  "options": [
    { "id": "no-onions", "name": "No Onions", "price": 0 },
    { "id": "no-pickles", "name": "No Pickles", "price": 0 }
  ]
}
```

## Testing Filters

```bash
# Get vegetarian items only
GET /api/menu/items?isVegetarian=true

# Get items in stock
GET /api/menu/items?inStock=true

# Get burgers that are vegetarian
GET /api/menu/items?category=Burgers&isVegetarian=true

# Search with pagination
GET /api/menu/items?search=cheese&page=1&limit=5

# Sort by price
GET /api/menu/items?sortBy=basePrice&order=asc
```

---

**Ready to test!** Start creating menu items and testing all the features.

import mongoose from "mongoose";
import dotenv from "dotenv";
import MenuItem from "../src/models/MenuItem.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../.env") });

const sampleData = [
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
];

const importData = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
    console.log("✓ Connected to MongoDB");
    
    // Clear existing data
    const deleteResult = await MenuItem.deleteMany();
    console.log(`✓ Cleared ${deleteResult.deletedCount} existing menu items`);
    
    // Insert sample data
    const items = await MenuItem.insertMany(sampleData);
    console.log(`✓ Successfully imported ${items.length} menu items`);
    
    // Display summary
    console.log("\n📊 Summary:");
    console.log(`   - Burgers: ${items.filter(i => i.category === "Burgers").length}`);
    console.log(`   - Hot Dogs: ${items.filter(i => i.category === "Hot Dogs").length}`);
    console.log(`   - Drinks: ${items.filter(i => i.category === "Drinks").length}`);
    console.log(`   - Desserts: ${items.filter(i => i.category === "Desserts").length}`);
    console.log(`   - Sides: ${items.filter(i => i.category === "Sides").length}`);
    
    console.log("\n✅ Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error importing data:", error.message);
    process.exit(1);
  }
};

// Run the import
importData();

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
    // MAIN DISHES
    {
      id: "burger",
      name: "FireGrill Burger",
      description: "Smoky grilled patty, cheese and fresh veggies.",
      basePrice: 1200,
      image: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg",
      category: "Main Dishes",
      isVegetarian: false,
      customizationGroups: [
        {
          id: "extras",
          name: "Add-ons",
          type: "addons",
          isRequired: false,
          options: [
            { id: "extra-cheese", name: "Extra cheese slice", price: 150 },
            { id: "extra-onions", name: "Extra caramelised onions", price: 80 },
            { id: "extra-patty", name: "Add beef patty", price: 450 }
          ]
        }
      ]
    },
    {
      id: "pizza",
      name: "Molten Lava Pizza",
      description: "Thin crust with triple cheese & roasted veggies.",
      basePrice: 2100,
      image: "https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg",
      category: "Main Dishes",
      isVegetarian: true,
      customizationGroups: [
        {
          id: "extras",
          name: "Add-ons",
          type: "addons",
          isRequired: false,
          options: [
            { id: "extra-mozzarella", name: "Extra mozzarella", price: 220 },
            { id: "extra-tomato", name: "Extra tomato slices", price: 90 },
            { id: "extra-chicken", name: "Grilled chicken", price: 380 }
          ]
        }
      ]
    },
    {
      id: "submarine",
      name: "Smoky Submarine",
      description: "Toasted baguette packed with meats and greens.",
      basePrice: 1500,
      image: "/Submarine.jpeg",
      category: "Main Dishes",
      isVegetarian: false,
      customizationGroups: [
        {
          id: "extras",
          name: "Add-ons",
          type: "addons",
          isRequired: false,
          options: [
            { id: "extra-meat", name: "Double meat", price: 340 },
            { id: "extra-pickles", name: "Pickles", price: 70 }
          ]
        }
      ]
    },
    {
      id: "sandwich",
      name: "Stacked Sandwich",
      description: "Triple layered grilled sandwich.",
      basePrice: 900,
      image: "/Sandwich.jpeg",
      category: "Main Dishes",
      isVegetarian: false,
      customizationGroups: [
        {
          id: "extras",
          name: "Add-ons",
          type: "addons",
          isRequired: false,
          options: [
            { id: "extra-cheese-sandwich", name: "Cheese layer", price: 120 },
            { id: "extra-veggies", name: "Crunchy veggies", price: 100 }
          ]
        }
      ]
    },
    {
      id: "pasta",
      name: "Blaze Pasta",
      description: "Creamy pasta with a touch of chilli.",
      basePrice: 1300,
      image: "https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg",
      category: "Main Dishes",
      isVegetarian: true,
      customizationGroups: [
        {
          id: "extras",
          name: "Add-ons",
          type: "addons",
          isRequired: false,
          options: [
            { id: "extra-cheese-pasta", name: "Parmesan", price: 160 },
            { id: "extra-mushroom", name: "Sautéed mushrooms", price: 210 }
          ]
        }
      ]
    },
    {
      id: "rice",
      name: "Signature Rice Bowl",
      description: "Steamed rice with seasonal veggies and your choice of protein.",
      basePrice: 1100,
      image: "/Rice.jpeg",
      category: "Main Dishes",
      isVegetarian: false,
      customizationGroups: [
        {
          id: "extras",
          name: "Add-ons",
          type: "addons",
          isRequired: false,
          options: [
            { id: "extra-egg", name: "Fried egg", price: 120 },
            { id: "extra-chicken-rice", name: "Grilled chicken", price: 350 },
            { id: "extra-spice", name: "Extra spicy", price: 40 }
          ]
        }
      ]
    },

    // BEVERAGES
    {
      id: "milkshake",
      name: "Thick Milkshake",
      description: "Creamy milkshake topped with whipped cream.",
      basePrice: 800,
      image: "/Milkshake.jpeg",
      category: "Beverages",
      isVegetarian: true,
      customizationGroups: [
        {
          id: "size",
          name: "Size",
          type: "single_select",
          isRequired: true,
          options: [
            { id: "s", name: "Small", price: 0 },
            { id: "m", name: "Medium", price: 240 },
            { id: "l", name: "Large", price: 480 }
          ]
        },
        {
          id: "extras",
          name: "Add-ons",
          type: "addons",
          isRequired: false,
          options: [
            { id: "extra-cream", name: "Extra whipped cream", price: 80 },
            { id: "choco-syrup", name: "Chocolate syrup", price: 100 }
          ]
        }
      ]
    },
    {
      id: "soft-drink",
      name: "Soft Drink",
      description: "Chilled carbonated drink.",
      basePrice: 400,
      image: "/SoftDrinks.jpeg",
      category: "Beverages",
      isVegetarian: true,
      customizationGroups: [
        {
          id: "size",
          name: "Size",
          type: "single_select",
          isRequired: true,
          options: [
            { id: "can", name: "Can", price: 0 },
            { id: "bottle", name: "Bottle", price: 200 }
          ]
        }
      ]
    },
    {
      id: "fruit-drink",
      name: "Fresh Fruit Drink",
      description: "Seasonal fruit juice with pulp.",
      basePrice: 700,
      image: "https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg",
      category: "Beverages",
      isVegetarian: true,
      customizationGroups: [
        {
          id: "size",
          name: "Size",
          type: "single_select",
          isRequired: true,
          options: [
            { id: "regular", name: "Regular", price: 0 },
            { id: "large", name: "Large", price: 350 }
          ]
        },
        {
          id: "extras",
          name: "Options",
          type: "addons",
          isRequired: false,
          options: [
            { id: "extra-pulp", name: "Extra pulp", price: 70 }
          ]
        }
      ]
    },
    {
      id: "coffee",
      name: "Roasted Coffee",
      description: "Freshly ground coffee shot.",
      basePrice: 500,
      image: "/coffee.jpeg",
      category: "Beverages",
      isVegetarian: true,
      customizationGroups: [
        {
          id: "size",
          name: "Size",
          type: "single_select",
          isRequired: true,
          options: [
            { id: "single", name: "Single shot", price: 0 },
            { id: "double", name: "Double shot", price: 250 }
          ]
        },
        {
          id: "extras",
          name: "Add-ons",
          type: "addons",
          isRequired: false,
          options: [
            { id: "extra-shot", name: "Extra espresso shot", price: 120 },
            { id: "oat-milk", name: "Oat milk", price: 150 }
          ]
        }
      ]
    },
    {
      id: "tea",
      name: "Ceylon Tea",
      description: "Brewed Sri Lankan tea.",
      basePrice: 350,
      image: "https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg",
      category: "Beverages",
      isVegetarian: true,
      customizationGroups: [
        {
          id: "size",
          name: "Size",
          type: "single_select",
          isRequired: true,
          options: [
            { id: "cup", name: "Cup", price: 0 },
            { id: "pot", name: "Tea pot", price: 350 }
          ]
        },
        {
          id: "extras",
          name: "Add-ons",
          type: "addons",
          isRequired: false,
          options: [
            { id: "extra-milk", name: "Extra milk", price: 60 }
          ]
        }
      ]
    },

    // DESSERTS
    {
      id: "cake",
      name: "Chocolate Cake",
      description: "Moist chocolate sponge with rich ganache.",
      basePrice: 650,
      image: "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg",
      category: "Desserts",
      isVegetarian: true,
      customizationGroups: [
        {
          id: "extras",
          name: "Add-ons",
          type: "addons",
          isRequired: false,
          options: [
            { id: "extra-choco", name: "Extra chocolate drizzle", price: 80 },
            { id: "add-scoop-vanilla", name: "Vanilla ice cream scoop", price: 150 }
          ]
        }
      ]
    },
    {
      id: "ice-cream",
      name: "Ice Cream",
      description: "Two scoops of your favourite flavour.",
      basePrice: 450,
      image: "https://images.pexels.com/photos/1352278/pexels-photo-1352278.jpeg",
      category: "Desserts",
      isVegetarian: true,
      customizationGroups: [
        {
          id: "extras",
          name: "Add-ons",
          type: "addons",
          isRequired: false,
          options: [
            { id: "extra-scoop", name: "Extra scoop", price: 150 },
            { id: "sprinkles", name: "Rainbow sprinkles", price: 70 }
          ]
        }
      ]
    },
    {
      id: "fruit-salad",
      name: "Fruit Salad",
      description: "Seasonal fruits with a light citrus dressing.",
      basePrice: 500,
      image: "https://images.pexels.com/photos/1105166/pexels-photo-1105166.jpeg",
      category: "Desserts",
      isVegetarian: true,
      customizationGroups: [
        {
          id: "extras",
          name: "Add-ons",
          type: "addons",
          isRequired: false,
          options: [
            { id: "add-honey", name: "Honey drizzle", price: 60 },
            { id: "add-yoghurt", name: "Greek yoghurt", price: 120 }
          ]
        }
      ]
    },
    {
      id: "cookies",
      name: "Warm Cookies",
      description: "Freshly baked chocolate chip cookies.",
      basePrice: 380,
      image: "https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg",
      category: "Desserts",
      isVegetarian: true,
      customizationGroups: [
        {
          id: "extras",
          name: "Add-ons",
          type: "addons",
          isRequired: false,
          options: [
            { id: "extra-cookie", name: "Extra cookie", price: 90 },
            { id: "cookie-icecream", name: "Serve with ice cream", price: 180 }
          ]
        }
      ]
    },
    {
      id: "donut",
      name: "Glazed Donut",
      description: "Soft ring donut with vanilla glaze.",
      basePrice: 350,
      image: "/Donut.jpeg",
      category: "Desserts",
      isVegetarian: true,
      customizationGroups: [
        {
          id: "extras",
          name: "Add-ons",
          type: "addons",
          isRequired: false,
          options: [
            { id: "extra-glaze", name: "Extra glaze", price: 50 },
            { id: "choco-dip", name: "Chocolate dip", price: 90 }
          ]
        }
      ]
    },
    {
      id: "pudding",
      name: "Caramel Pudding",
      description: "Silky baked pudding with caramel topping.",
      basePrice: 520,
      image: "/Pudding.jpeg",
      category: "Desserts",
      isVegetarian: true,
      customizationGroups: [
        {
          id: "extras",
          name: "Add-ons",
          type: "addons",
          isRequired: false,
          options: [
            { id: "extra-caramel", name: "Extra caramel", price: 70 },
            { id: "add-nuts", name: "Toasted nuts", price: 90 }
          ]
        }
      ]
    },
    {
      id: "jelly",
      name: "Fruity Jelly",
      description: "Colourful jelly with fruit pieces.",
      basePrice: 300,
      image: "/Jelly.jpeg",
      category: "Desserts",
      isVegetarian: true,
      customizationGroups: [
        {
          id: "extras",
          name: "Add-ons",
          type: "addons",
          isRequired: false,
          options: [
            { id: "add-cream", name: "Fresh cream", price: 80 },
            { id: "add-custard", name: "Vanilla custard", price: 120 }
          ]
        }
      ]
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

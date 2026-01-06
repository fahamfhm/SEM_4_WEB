import mongoose from "mongoose";

const customizationOptionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    default: 0,
  },
});

const customizationGroupSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["addons", "single_select", "multi_select", "removals"],
    required: true,
  },
  isRequired: {
    type: Boolean,
    default: false,
  },
  options: [customizationOptionSchema],
});

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a menu item name"],
      trim: true,
      maxlength: [100, "Name cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    category: {
      type: String,
      required: [true, "Please specify a category"],
      enum: ["Burgers", "Hot Dogs", "Drinks", "Desserts", "Sides", "Specials"],
    },
    basePrice: {
      type: Number,
      required: [true, "Please add a base price"],
      min: [0, "Price cannot be negative"],
    },
    currency: {
      type: String,
      default: "LKR",
    },
    image: {
      type: String,
      default: "https://via.placeholder.com/400x300?text=No+Image",
    },
    imagePublicId: {
      type: String, // Cloudinary public ID for deletion
    },
    isVegetarian: {
      type: Boolean,
      default: false,
    },
    availability: {
      inStock: {
        type: Boolean,
        default: true,
      },
      outOfStockReason: {
        type: String,
        default: null,
      },
    },
    customizationGroups: [customizationGroupSchema],
    preparationTime: {
      type: Number, // in minutes
      default: 15,
    },
    tags: [
      {
        type: String,
      },
    ],
    calories: {
      type: Number,
      min: 0,
    },
    allergens: [
      {
        type: String,
      },
    ],
    spiceLevel: {
      type: String,
      enum: ["mild", "medium", "hot", "extra-hot", "none"],
      default: "none",
    },
  },
  {
    timestamps: true,
  }
);

// Index for search functionality
menuItemSchema.index({ name: "text", description: "text", tags: "text" });

// Index for category filtering
menuItemSchema.index({ category: 1 });

// Index for availability queries
menuItemSchema.index({ "availability.inStock": 1 });

const MenuItem = mongoose.model("MenuItem", menuItemSchema);

export default MenuItem;

import mongoose from "mongoose";

const inventoryLogSchema = new mongoose.Schema({
  action: {
    type: String,
    enum: ["add", "remove", "adjust", "restock", "order_deduction"],
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  previousQuantity: {
    type: Number,
    required: true,
  },
  newQuantity: {
    type: Number,
    required: true,
  },
  reason: {
    type: String,
    default: null,
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const inventorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add an inventory item name"],
      trim: true,
      maxlength: [100, "Name cannot be more than 100 characters"],
    },
    category: {
      type: String,
      required: [true, "Please specify a category"],
      enum: [
        "Ingredients",
        "Beverages",
        "Packaging",
        "Condiments",
        "Frozen",
        "Dairy",
        "Produce",
        "Dry Goods",
        "Other",
      ],
    },
    unit: {
      type: String,
      required: [true, "Please specify the unit of measurement"],
      enum: ["kg", "g", "L", "ml", "pcs", "dozen", "boxes", "packs"],
    },
    currentQuantity: {
      type: Number,
      required: [true, "Please add current quantity"],
      min: [0, "Quantity cannot be negative"],
      default: 0,
    },
    minimumQuantity: {
      type: Number,
      required: [true, "Please add minimum quantity threshold"],
      min: [0, "Minimum quantity cannot be negative"],
      default: 10,
    },
    maximumQuantity: {
      type: Number,
      min: [0, "Maximum quantity cannot be negative"],
      default: 1000,
    },
    costPerUnit: {
      type: Number,
      min: [0, "Cost cannot be negative"],
      default: 0,
    },
    currency: {
      type: String,
      default: "LKR",
    },
    supplier: {
      name: {
        type: String,
        default: null,
      },
      contact: {
        type: String,
        default: null,
      },
      email: {
        type: String,
        default: null,
      },
    },
    linkedMenuItems: [
      {
        menuItem: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "MenuItem",
        },
        quantityUsedPerServing: {
          type: Number,
          default: 1,
        },
      },
    ],
    status: {
      type: String,
      enum: ["in_stock", "low_stock", "out_of_stock"],
      default: "in_stock",
    },
    expiryDate: {
      type: Date,
      default: null,
    },
    location: {
      type: String,
      default: "Main Kitchen",
    },
    notes: {
      type: String,
      maxlength: [500, "Notes cannot be more than 500 characters"],
    },
    lastRestocked: {
      type: Date,
      default: null,
    },
    logs: [inventoryLogSchema],
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to update status based on quantity
inventorySchema.pre("save", function (next) {
  if (this.currentQuantity <= 0) {
    this.status = "out_of_stock";
  } else if (this.currentQuantity <= this.minimumQuantity) {
    this.status = "low_stock";
  } else {
    this.status = "in_stock";
  }
  next();
});

// Index for search functionality
inventorySchema.index({ name: "text", notes: "text" });

// Index for category filtering
inventorySchema.index({ category: 1 });

// Index for status filtering
inventorySchema.index({ status: 1 });

// Index for low stock alerts
inventorySchema.index({ currentQuantity: 1, minimumQuantity: 1 });

const Inventory = mongoose.model("Inventory", inventorySchema);

export default Inventory;

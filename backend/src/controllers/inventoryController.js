import Inventory from "../models/Inventory.js";

// @desc    Get all inventory items with filtering
// @route   GET /api/inventory
// @access  Private (Kitchen/Admin)
export const getInventoryItems = async (req, res, next) => {
  try {
    const {
      category,
      status,
      search,
      page = 1,
      limit = 20,
      sortBy = "name",
      order = "asc",
      lowStock,
    } = req.query;

    // Build query
    const query = {};

    // Category filter
    if (category) {
      query.category = category;
    }

    // Status filter
    if (status) {
      query.status = status;
    }

    // Low stock filter
    if (lowStock === "true") {
      query.$expr = { $lte: ["$currentQuantity", "$minimumQuantity"] };
    }

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query with pagination and sorting
    const items = await Inventory.find(query)
      .populate("linkedMenuItems.menuItem", "name category")
      .sort({ [sortBy]: order === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Transform items to include id field
    const transformedItems = items.map((item) => ({
      ...item.toObject(),
      id: item._id.toString(),
    }));

    // Get total count for pagination
    const total = await Inventory.countDocuments(query);

    res.status(200).json({
      success: true,
      count: transformedItems.length,
      data: transformedItems,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single inventory item
// @route   GET /api/inventory/:id
// @access  Private (Kitchen/Admin)
export const getInventoryItemById = async (req, res, next) => {
  try {
    const item = await Inventory.findById(req.params.id).populate(
      "linkedMenuItems.menuItem",
      "name category basePrice"
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        ...item.toObject(),
        id: item._id.toString(),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create inventory item
// @route   POST /api/inventory
// @access  Private (Admin)
export const createInventoryItem = async (req, res, next) => {
  try {
    const item = await Inventory.create(req.body);

    res.status(201).json({
      success: true,
      data: {
        ...item.toObject(),
        id: item._id.toString(),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update inventory item
// @route   PUT /api/inventory/:id
// @access  Private (Admin)
export const updateInventoryItem = async (req, res, next) => {
  try {
    const item = await Inventory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        ...item.toObject(),
        id: item._id.toString(),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete inventory item
// @route   DELETE /api/inventory/:id
// @access  Private (Admin)
export const deleteInventoryItem = async (req, res, next) => {
  try {
    const item = await Inventory.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Inventory item deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Adjust inventory quantity (add/remove stock)
// @route   PATCH /api/inventory/:id/adjust
// @access  Private (Kitchen/Admin)
export const adjustInventoryQuantity = async (req, res, next) => {
  try {
    const { action, quantity, reason } = req.body;

    if (!["add", "remove", "adjust", "restock"].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Invalid action. Use: add, remove, adjust, or restock",
      });
    }

    if (typeof quantity !== "number" || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a positive number",
      });
    }

    const item = await Inventory.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found",
      });
    }

    const previousQuantity = item.currentQuantity;
    let newQuantity;

    switch (action) {
      case "add":
      case "restock":
        newQuantity = previousQuantity + quantity;
        if (action === "restock") {
          item.lastRestocked = new Date();
        }
        break;
      case "remove":
        newQuantity = Math.max(0, previousQuantity - quantity);
        break;
      case "adjust":
        newQuantity = quantity; // Set to exact value
        break;
      default:
        newQuantity = previousQuantity;
    }

    // Add log entry
    item.logs.push({
      action,
      quantity,
      previousQuantity,
      newQuantity,
      reason: reason || null,
      performedBy: req.user?._id || null,
    });

    // Keep only last 100 logs
    if (item.logs.length > 100) {
      item.logs = item.logs.slice(-100);
    }

    item.currentQuantity = newQuantity;
    await item.save();

    res.status(200).json({
      success: true,
      data: {
        ...item.toObject(),
        id: item._id.toString(),
      },
      message: `Inventory ${action}ed successfully. New quantity: ${newQuantity} ${item.unit}`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get low stock items
// @route   GET /api/inventory/low-stock
// @access  Private (Kitchen/Admin)
export const getLowStockItems = async (req, res, next) => {
  try {
    const items = await Inventory.find({
      $expr: { $lte: ["$currentQuantity", "$minimumQuantity"] },
    })
      .populate("linkedMenuItems.menuItem", "name")
      .sort({ currentQuantity: 1 });

    const transformedItems = items.map((item) => ({
      ...item.toObject(),
      id: item._id.toString(),
    }));

    res.status(200).json({
      success: true,
      count: transformedItems.length,
      data: transformedItems,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get inventory categories
// @route   GET /api/inventory/categories
// @access  Private (Kitchen/Admin)
export const getInventoryCategories = async (req, res, next) => {
  try {
    const categories = await Inventory.distinct("category");

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Link menu item to inventory
// @route   POST /api/inventory/:id/link-menu-item
// @access  Private (Admin)
export const linkMenuItem = async (req, res, next) => {
  try {
    const { menuItemId, quantityUsedPerServing } = req.body;

    const item = await Inventory.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found",
      });
    }

    // Check if already linked
    const existingLink = item.linkedMenuItems.find(
      (link) => link.menuItem.toString() === menuItemId
    );

    if (existingLink) {
      existingLink.quantityUsedPerServing = quantityUsedPerServing || 1;
    } else {
      item.linkedMenuItems.push({
        menuItem: menuItemId,
        quantityUsedPerServing: quantityUsedPerServing || 1,
      });
    }

    await item.save();

    const populatedItem = await Inventory.findById(item._id).populate(
      "linkedMenuItems.menuItem",
      "name category"
    );

    res.status(200).json({
      success: true,
      data: {
        ...populatedItem.toObject(),
        id: populatedItem._id.toString(),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Unlink menu item from inventory
// @route   DELETE /api/inventory/:id/link-menu-item/:menuItemId
// @access  Private (Admin)
export const unlinkMenuItem = async (req, res, next) => {
  try {
    const item = await Inventory.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found",
      });
    }

    item.linkedMenuItems = item.linkedMenuItems.filter(
      (link) => link.menuItem.toString() !== req.params.menuItemId
    );

    await item.save();

    res.status(200).json({
      success: true,
      message: "Menu item unlinked successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get inventory item logs
// @route   GET /api/inventory/:id/logs
// @access  Private (Admin)
export const getInventoryLogs = async (req, res, next) => {
  try {
    const { limit = 50 } = req.query;

    const item = await Inventory.findById(req.params.id)
      .select("name logs")
      .populate("logs.performedBy", "name email");

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found",
      });
    }

    // Return latest logs first
    const logs = item.logs.slice(-parseInt(limit)).reverse();

    res.status(200).json({
      success: true,
      data: {
        itemName: item.name,
        logs,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk update inventory quantities (for order processing)
// @route   POST /api/inventory/bulk-deduct
// @access  Private (System/Kitchen)
export const bulkDeductInventory = async (req, res, next) => {
  try {
    const { items, orderId } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Items array is required",
      });
    }

    const results = [];
    const errors = [];

    for (const { inventoryId, quantity } of items) {
      try {
        const item = await Inventory.findById(inventoryId);

        if (!item) {
          errors.push({ inventoryId, error: "Item not found" });
          continue;
        }

        const previousQuantity = item.currentQuantity;
        const newQuantity = Math.max(0, previousQuantity - quantity);

        item.logs.push({
          action: "order_deduction",
          quantity,
          previousQuantity,
          newQuantity,
          orderId: orderId || null,
          performedBy: req.user?._id || null,
        });

        if (item.logs.length > 100) {
          item.logs = item.logs.slice(-100);
        }

        item.currentQuantity = newQuantity;
        await item.save();

        results.push({
          inventoryId,
          name: item.name,
          previousQuantity,
          newQuantity,
        });
      } catch (err) {
        errors.push({ inventoryId, error: err.message });
      }
    }

    res.status(200).json({
      success: true,
      data: {
        processed: results,
        errors,
      },
    });
  } catch (error) {
    next(error);
  }
};

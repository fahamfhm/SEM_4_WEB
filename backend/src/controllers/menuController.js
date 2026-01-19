import MenuItem from "../models/MenuItem.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Get all menu items with filtering and search
// @route   GET /api/menu/items
// @access  Public
export const getMenuItems = async (req, res, next) => {
  try {
    const {
      category,
      search,
      page = 1,
      limit = 10,
      inStock,
      isVegetarian,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    // Build query
    const query = {};

    // Category filter
    if (category) {
      query.category = category;
    }

    // Stock availability filter
    if (inStock !== undefined) {
      query["availability.inStock"] = inStock === "true";
    }

    // Vegetarian filter
    if (isVegetarian !== undefined) {
      query.isVegetarian = isVegetarian === "true";
    }

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query with pagination and sorting
    const items = await MenuItem.find(query)
      .sort({ [sortBy]: order === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Transform items to include id field
    const transformedItems = items.map(item => ({
      ...item.toObject(),
      id: item._id.toString()
    }));

    // Get total count for pagination
    const total = await MenuItem.countDocuments(query);

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

// @desc    Get single menu item by ID
// @route   GET /api/menu/items/:id
// @access  Public
export const getMenuItemById = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);

    if (!item) {
      res.status(404);
      throw new Error("Menu item not found");
    }

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new menu item
// @route   POST /api/menu/items
// @access  Private/Admin
export const createMenuItem = async (req, res, next) => {
  try {
    let imageUrl = req.body.image;
    let imageFileName = null;

    // Handle image upload to local storage
    if (req.file) {
      // Store the filename and create URL path
      imageFileName = req.file.filename;
      imageUrl = `/uploads/menu-images/${imageFileName}`;
    }

    // Create menu item
    const menuItem = await MenuItem.create({
      ...req.body,
      image: imageUrl,
      imagePublicId: imageFileName,
    });

    res.status(201).json({
      success: true,
      data: menuItem,
    });
  } catch (error) {
    // Clean up uploaded file if error occurs
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

// @desc    Update menu item
// @route   PUT /api/menu/items/:id
// @access  Private/Admin
export const updateMenuItem = async (req, res, next) => {
  try {
    let item = await MenuItem.findById(req.params.id);

    if (!item) {
      res.status(404);
      throw new Error("Menu item not found");
    }

    let updateData = { ...req.body };

    // Handle image update
    if (req.file) {
      // Delete old image from local storage if exists
      if (item.imagePublicId) {
        const oldImagePath = path.join(__dirname, "../../uploads/menu-images", item.imagePublicId);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      // Use new image
      updateData.image = `/uploads/menu-images/${req.file.filename}`;
      updateData.imagePublicId = req.file.filename;
    }

    // Update item
    item = await MenuItem.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    // Clean up uploaded file if error occurs
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

// @desc    Delete menu item
// @route   DELETE /api/menu/items/:id
// @access  Private/Admin
export const deleteMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);

    if (!item) {
      res.status(404);
      throw new Error("Menu item not found");
    }

    // Delete image from local storage if exists
    if (item.imagePublicId) {
      const imagePath = path.join(__dirname, "../../uploads/menu-images", item.imagePublicId);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await MenuItem.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {},
      message: "Menu item deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update menu item availability
// @route   PATCH /api/menu/items/:id/availability
// @access  Private/Admin
export const updateAvailability = async (req, res, next) => {
  try {
    const { inStock, outOfStockReason } = req.body;

    const item = await MenuItem.findByIdAndUpdate(
      req.params.id,
      {
        availability: {
          inStock,
          outOfStockReason: inStock ? null : outOfStockReason,
        },
      },
      { new: true, runValidators: true }
    );

    if (!item) {
      res.status(404);
      throw new Error("Menu item not found");
    }

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all categories
// @route   GET /api/menu/categories
// @access  Public

export const getCategories = async (req, res, next) => {
  try {
    const categories = await MenuItem.distinct("category");

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add customization group to menu item
// @route   POST /api/menu/items/:id/customizations
// @access  Private/Admin

export const addCustomizationGroup = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);

    if (!item) {
      res.status(404);
      throw new Error("Menu item not found");
    }

    item.customizationGroups.push(req.body);
    await item.save();

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update customization group
// @route   PUT /api/menu/items/:id/customizations/:groupId
// @access  Private/Admin

export const updateCustomizationGroup = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);

    if (!item) {
      res.status(404);
      throw new Error("Menu item not found");
    }

    const groupIndex = item.customizationGroups.findIndex(
      (group) => group.id === req.params.groupId
    );

    if (groupIndex === -1) {
      res.status(404);
      throw new Error("Customization group not found");
    }

    item.customizationGroups[groupIndex] = {
      ...item.customizationGroups[groupIndex].toObject(),
      ...req.body,
    };

    await item.save();

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete customization group
// @route   DELETE /api/menu/items/:id/customizations/:groupId
// @access  Private/Admin

export const deleteCustomizationGroup = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);

    if (!item) {
      res.status(404);
      throw new Error("Menu item not found");
    }

    item.customizationGroups = item.customizationGroups.filter(
      (group) => group.id !== req.params.groupId
    );

    await item.save();

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk update availability (multiple items)
// @route   PATCH /api/menu/items/bulk-availability
// @access  Private/Admin
export const bulkUpdateAvailability = async (req, res, next) => {
  try {
    const { itemIds, inStock, outOfStockReason } = req.body;

    if (!itemIds || !Array.isArray(itemIds)) {
      res.status(400);
      throw new Error("Please provide an array of item IDs");
    }

    await MenuItem.updateMany(
      { _id: { $in: itemIds } },
      {
        availability: {
          inStock,
          outOfStockReason: inStock ? null : outOfStockReason,
        },
      }
    );

    res.status(200).json({
      success: true,
      message: `${itemIds.length} items updated successfully`,
    });
  } catch (error) {
    next(error);
  }
};

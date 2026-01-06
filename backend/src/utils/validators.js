import { body, param, query, validationResult } from "express-validator";

// Validation middleware
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  next();
};

// Menu item validation rules
export const createMenuItemValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Menu item name is required")
    .isLength({ max: 100 })
    .withMessage("Name cannot exceed 100 characters"),
  
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),
  
  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isIn(["Burgers", "Hot Dogs", "Drinks", "Desserts", "Sides", "Specials"])
    .withMessage("Invalid category"),
  
  body("basePrice")
    .notEmpty()
    .withMessage("Base price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  
  body("isVegetarian")
    .optional()
    .isBoolean()
    .withMessage("isVegetarian must be a boolean"),
  
  body("preparationTime")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Preparation time must be a positive integer"),
  
  validate,
];

export const updateMenuItemValidation = [
  param("id").isMongoId().withMessage("Invalid menu item ID"),
  body("name")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Name cannot exceed 100 characters"),
  
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),
  
  body("category")
    .optional()
    .isIn(["Burgers", "Hot Dogs", "Drinks", "Desserts", "Sides", "Specials"])
    .withMessage("Invalid category"),
  
  body("basePrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  
  validate,
];

export const getMenuItemByIdValidation = [
  param("id").isMongoId().withMessage("Invalid menu item ID"),
  validate,
];

export const updateAvailabilityValidation = [
  param("id").isMongoId().withMessage("Invalid menu item ID"),
  body("inStock").isBoolean().withMessage("inStock must be a boolean"),
  body("outOfStockReason")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Out of stock reason cannot exceed 200 characters"),
  validate,
];

export const customizationGroupValidation = [
  body("id").notEmpty().withMessage("Customization group ID is required"),
  body("name").notEmpty().withMessage("Customization group name is required"),
  body("type")
    .isIn(["addons", "single_select", "multi_select", "removals"])
    .withMessage("Invalid customization type"),
  body("options").isArray({ min: 1 }).withMessage("At least one option is required"),
  body("options.*.id").notEmpty().withMessage("Option ID is required"),
  body("options.*.name").notEmpty().withMessage("Option name is required"),
  body("options.*.price").isFloat({ min: 0 }).withMessage("Option price must be non-negative"),
  validate,
];

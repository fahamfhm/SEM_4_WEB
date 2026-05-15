import express from "express";
import {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  updateAvailability,
  getCategories,
  addCustomizationGroup,
  updateCustomizationGroup,
  deleteCustomizationGroup,
  bulkUpdateAvailability,
} from "../controllers/menuController.js";
import upload from "../middleware/upload.js";
import {
  createMenuItemValidation,
  updateMenuItemValidation,
  getMenuItemByIdValidation,
  updateAvailabilityValidation,
  customizationGroupValidation,
} from "../utils/validators.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/items", getMenuItems);
router.get("/items/:id", getMenuItemByIdValidation, getMenuItemById);
router.get("/categories", getCategories);

// Admin routes (add auth middleware when ready)
router.use(protect);
router.use(authorize("admin"));

router.post("/items", upload.single("image"), createMenuItemValidation, createMenuItem);
router.put("/items/:id", upload.single("image"), updateMenuItemValidation, updateMenuItem);
router.delete("/items/:id", getMenuItemByIdValidation, deleteMenuItem);

// Availability management
router.use(protect);
router.use(authorize("admin", "kitchen"));

router.patch("/items/:id/availability", updateAvailabilityValidation, updateAvailability);
router.patch("/items/bulk-availability", bulkUpdateAvailability);

// Customization management
router.post("/items/:id/customizations", customizationGroupValidation, addCustomizationGroup);
router.put("/items/:id/customizations/:groupId", customizationGroupValidation, updateCustomizationGroup);
router.delete("/items/:id/customizations/:groupId", deleteCustomizationGroup);

export default router;

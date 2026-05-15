import express from "express";
import {
  getInventoryItems,
  getInventoryItemById,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  adjustInventoryQuantity,
  getLowStockItems,
  getInventoryCategories,
  linkMenuItem,
  unlinkMenuItem,
  getInventoryLogs,
  bulkDeductInventory,
} from "../controllers/inventoryController.js";
import { protect, authorize } from "../middleware/auth.js"; // Uncomment when auth is ready

const router = express.Router();

// All inventory routes should be protected (Kitchen/Admin access)
// Uncomment when auth is ready:
router.use(protect);
router.use(authorize("admin", "kitchen"));

// Get all inventory items with filtering
router.get("/", getInventoryItems);

// Get low stock items (for alerts)
router.get("/low-stock", getLowStockItems);

// Get inventory categories
router.get("/categories", getInventoryCategories);

// Get single inventory item
router.get("/:id", getInventoryItemById);

// Create inventory item (Admin only)
router.post("/", createInventoryItem);

// Update inventory item (Admin only)
router.put("/:id", updateInventoryItem);

// Delete inventory item (Admin only)
router.delete("/:id", deleteInventoryItem);

// Adjust inventory quantity (add/remove/restock)
router.patch("/:id/adjust", adjustInventoryQuantity);

// Get inventory item logs
router.get("/:id/logs", getInventoryLogs);

// Link/unlink menu items to inventory
router.post("/:id/link-menu-item", linkMenuItem);
router.delete("/:id/link-menu-item/:menuItemId", unlinkMenuItem);

// Bulk deduct for order processing
router.post("/bulk-deduct", bulkDeductInventory);

export default router;

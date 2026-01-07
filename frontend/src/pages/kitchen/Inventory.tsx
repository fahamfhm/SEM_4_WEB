import { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/KitchenInventory.css';

// ============================================
// API Configuration
// ============================================
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Set to false to disable demo data and use only backend
const USE_DEMO_DATA_AS_FALLBACK = true;

// ============================================
// Types
// ============================================
interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minStock: number;
  supplier: string;
  lastUpdated: string;
  expiryDate?: string;
}

// ============================================
// DEMO DATA - Remove this section after backend is ready
// ============================================
const DEMO_INVENTORY: InventoryItem[] = [
  {
    id: '1',
    name: 'Tomatoes',
    category: 'Vegetables',
    quantity: 25,
    unit: 'kg',
    minStock: 10,
    supplier: 'Fresh Farm Co.',
    lastUpdated: new Date().toISOString(),
    expiryDate: '2026-01-10'
  },
  {
    id: '2',
    name: 'Chicken Breast',
    category: 'Meat',
    quantity: 15,
    unit: 'kg',
    minStock: 20,
    supplier: 'Quality Meats Ltd.',
    lastUpdated: new Date().toISOString(),
    expiryDate: '2026-01-08'
  },
  {
    id: '3',
    name: 'Olive Oil',
    category: 'Oils',
    quantity: 8,
    unit: 'L',
    minStock: 5,
    supplier: 'Mediterranean Imports',
    lastUpdated: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Pasta',
    category: 'Dry Goods',
    quantity: 30,
    unit: 'kg',
    minStock: 15,
    supplier: 'Italian Foods Co.',
    lastUpdated: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Mozzarella Cheese',
    category: 'Dairy',
    quantity: 5,
    unit: 'kg',
    minStock: 8,
    supplier: 'Dairy Fresh Inc.',
    lastUpdated: new Date().toISOString(),
    expiryDate: '2026-01-12'
  },
  {
    id: '6',
    name: 'Basil',
    category: 'Spices',
    quantity: 2,
    unit: 'kg',
    minStock: 1,
    supplier: 'Herb Garden Co.',
    lastUpdated: new Date().toISOString(),
    expiryDate: '2026-01-09'
  }
];
// ============================================
// END DEMO DATA
// ============================================

const CATEGORIES = ['all', 'Vegetables', 'Meat', 'Oils', 'Dry Goods', 'Dairy', 'Spices'];
const UNITS = ['kg', 'g', 'L', 'ml', 'pcs', 'boxes'];

const KitchenInventory = () => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state for Add/Edit modal
  const [formData, setFormData] = useState<Omit<InventoryItem, 'id' | 'lastUpdated'>>({
    name: '',
    category: 'Vegetables',
    quantity: 0,
    unit: 'kg',
    minStock: 0,
    supplier: '',
    expiryDate: ''
  });

  // Fetch inventory from backend
  const fetchInventory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/inventory`);
      setInventoryItems(response.data.data || response.data);
    } catch (err) {
      console.error('Error fetching inventory:', err);
      if (USE_DEMO_DATA_AS_FALLBACK) {
        console.log('Using demo data as fallback');
        setInventoryItems(DEMO_INVENTORY);
        setError(null);
      } else {
        setError('Failed to load inventory. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Load inventory on mount
  useEffect(() => {
    fetchInventory();
  }, []);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name,
        category: editingItem.category,
        quantity: editingItem.quantity,
        unit: editingItem.unit,
        minStock: editingItem.minStock,
        supplier: editingItem.supplier,
        expiryDate: editingItem.expiryDate || ''
      });
    } else if (showAddModal) {
      setFormData({
        name: '',
        category: 'Vegetables',
        quantity: 0,
        unit: 'kg',
        minStock: 0,
        supplier: '',
        expiryDate: ''
      });
    }
  }, [editingItem, showAddModal]);

  // Add new item
  const handleAddItem = async () => {
    if (!formData.name.trim()) {
      alert('Please enter item name');
      return;
    }

    const newItem: InventoryItem = {
      id: Date.now().toString(),
      ...formData,
      lastUpdated: new Date().toISOString()
    };

    try {
      await axios.post(`${API_BASE_URL}/inventory`, newItem);
      setInventoryItems(prev => [...prev, newItem]);
    } catch (err) {
      console.error('Error adding item:', err);
      if (USE_DEMO_DATA_AS_FALLBACK) {
        setInventoryItems(prev => [...prev, newItem]);
      } else {
        alert('Failed to add item. Please try again.');
        return;
      }
    }

    setShowAddModal(false);
  };

  // Update existing item
  const handleUpdateItem = async () => {
    if (!editingItem) return;

    const updatedItem: InventoryItem = {
      ...editingItem,
      ...formData,
      lastUpdated: new Date().toISOString()
    };

    try {
      await axios.put(`${API_BASE_URL}/inventory/${editingItem.id}`, updatedItem);
      setInventoryItems(prev =>
        prev.map(item => item.id === editingItem.id ? updatedItem : item)
      );
    } catch (err) {
      console.error('Error updating item:', err);
      if (USE_DEMO_DATA_AS_FALLBACK) {
        setInventoryItems(prev =>
          prev.map(item => item.id === editingItem.id ? updatedItem : item)
        );
      } else {
        alert('Failed to update item. Please try again.');
        return;
      }
    }

    setEditingItem(null);
  };

  // Delete item
  const handleDeleteItem = async (item: InventoryItem) => {
    if (!confirm(`Delete ${item.name}?`)) return;

    try {
      await axios.delete(`${API_BASE_URL}/inventory/${item.id}`);
      setInventoryItems(prev => prev.filter(i => i.id !== item.id));
    } catch (err) {
      console.error('Error deleting item:', err);
      if (USE_DEMO_DATA_AS_FALLBACK) {
        setInventoryItems(prev => prev.filter(i => i.id !== item.id));
      } else {
        alert('Failed to delete item. Please try again.');
      }
    }
  };

  // Update quantity (quick +/-)
  const handleUpdateQuantity = async (id: string, newQuantity: number) => {
    const item = inventoryItems.find(i => i.id === id);
    if (!item) return;

    const updatedItem = { ...item, quantity: newQuantity, lastUpdated: new Date().toISOString() };

    try {
      await axios.patch(`${API_BASE_URL}/inventory/${id}`, { quantity: newQuantity });
      setInventoryItems(items =>
        items.map(i => i.id === id ? updatedItem : i)
      );
    } catch (err) {
      console.error('Error updating quantity:', err);
      if (USE_DEMO_DATA_AS_FALLBACK) {
        setInventoryItems(items =>
          items.map(i => i.id === id ? updatedItem : i)
        );
      }
    }
  };

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getLowStockItems = () => inventoryItems.filter(item => item.quantity <= item.minStock);

  const getStockStatus = (item: InventoryItem) => {
    if (item.quantity <= item.minStock) return 'low';
    if (item.quantity <= item.minStock * 1.5) return 'medium';
    return 'high';
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingItem(null);
  };

  // Loading state
  if (loading && inventoryItems.length === 0) {
    return (
      <div className="kitchen-inventory-page">
        <div className="inventory-container">
          <div className="inventory-header">
            <h1>Kitchen Inventory</h1>
          </div>
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6b7280' }}>
            <p style={{ fontSize: '24px' }}>Loading inventory...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="kitchen-inventory-page">
      <div className="inventory-container">
        {/* Header */}
        <div className="inventory-header">
          <h1>Kitchen Inventory</h1>
          <p className="subtitle">Manage your ingredients and supplies</p>
        </div>

        {/* Error Banner */}
        {error && (
          <div style={{
            background: '#fef2f2',
            color: '#dc2626',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span>⚠️ {error}</span>
            <button onClick={fetchInventory} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontWeight: 600 }}>
              Retry
            </button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="inventory-stats">
          <div className="stat-card">
            <div className="stat-icon total">📦</div>
            <div className="stat-content">
              <h3>{inventoryItems.length}</h3>
              <p>Total Items</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon low">⚠️</div>
            <div className="stat-content">
              <h3>{getLowStockItems().length}</h3>
              <p>Low Stock</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon categories">📋</div>
            <div className="stat-content">
              <h3>{CATEGORIES.length - 1}</h3>
              <p>Categories</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="inventory-controls">
          <div className="search-section">
            <input
              type="text"
              className="search-input"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-section">
            <select
              className="category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              title="Filter by category"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <button className="add-item-btn" onClick={() => setShowAddModal(true)}>
            + Add Item
          </button>
          <button 
            className="add-item-btn" 
            onClick={fetchInventory}
            style={{ background: '#6b7280' }}
          >
            🔄 Refresh
          </button>
        </div>

        {/* Low Stock Alert */}
        {getLowStockItems().length > 0 && (
          <div className="low-stock-alert">
            <span className="alert-icon">⚠️</span>
            <span>
              {getLowStockItems().length} item(s) are running low on stock. Please reorder soon.
            </span>
          </div>
        )}

        {/* Inventory Table */}
        <div className="inventory-table-container">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Min Stock</th>
                <th>Status</th>
                <th>Supplier</th>
                <th>Expiry Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(item => (
                <tr key={item.id} className={`stock-${getStockStatus(item)}`}>
                  <td className="item-name">{item.name}</td>
                  <td>
                    <span className="category-badge">{item.category}</span>
                  </td>
                  <td>
                    <div className="quantity-cell">
                      <button
                        className="qty-btn"
                        onClick={() => handleUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                      >
                        -
                      </button>
                      <span className="qty-value">
                        {item.quantity} {item.unit}
                      </span>
                      <button
                        className="qty-btn"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>{item.minStock} {item.unit}</td>
                  <td>
                    <span className={`status-badge status-${getStockStatus(item)}`}>
                      {getStockStatus(item) === 'low' && '🔴 Low'}
                      {getStockStatus(item) === 'medium' && '🟡 Medium'}
                      {getStockStatus(item) === 'high' && '🟢 Good'}
                    </span>
                  </td>
                  <td className="supplier-cell">{item.supplier}</td>
                  <td className="expiry-cell">
                    {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : 'N/A'}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="action-btn edit-btn"
                        onClick={() => setEditingItem(item)}
                        title="Edit item"
                      >
                        ✏️
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDeleteItem(item)}
                        title="Delete item"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredItems.length === 0 && (
            <div className="no-results">
              <p>No items found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingItem) && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingItem ? '✏️ Edit Item' : '➕ Add New Item'}</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
              {/* Name */}
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, color: '#374151' }}>
                  Item Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter item name"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              {/* Category & Unit Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, color: '#374151' }}>
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  >
                    {CATEGORIES.filter(c => c !== 'all').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, color: '#374151' }}>
                    Unit
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  >
                    {UNITS.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Quantity & Min Stock Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, color: '#374151' }}>
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.quantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, color: '#374151' }}>
                    Min Stock Level
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.minStock}
                    onChange={(e) => setFormData(prev => ({ ...prev, minStock: Number(e.target.value) }))}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              {/* Supplier */}
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, color: '#374151' }}>
                  Supplier
                </label>
                <input
                  type="text"
                  value={formData.supplier}
                  onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
                  placeholder="Enter supplier name"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              {/* Expiry Date */}
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, color: '#374151' }}>
                  Expiry Date (optional)
                </label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button
                  onClick={closeModal}
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    background: 'white',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={editingItem ? handleUpdateItem : handleAddItem}
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: 'none',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {editingItem ? 'Update Item' : 'Add Item'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KitchenInventory;

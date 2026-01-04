import { useState } from 'react';
import '../../styles/KitchenInventory.css';

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

const KitchenInventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  // Sample inventory data
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([
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
    }
  ]);

  const categories = ['all', 'Vegetables', 'Meat', 'Oils', 'Dry Goods', 'Dairy', 'Spices'];

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

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    setInventoryItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: newQuantity, lastUpdated: new Date().toISOString() }
          : item
      )
    );
  };

  return (
    <div className="kitchen-inventory-page">
      <div className="inventory-container">
        {/* Header */}
        <div className="inventory-header">
          <h1>Kitchen Inventory</h1>
          <p className="subtitle">Manage your ingredients and supplies</p>
        </div>

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
              <h3>{categories.length - 1}</h3>
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
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <button className="add-item-btn" onClick={() => setShowAddModal(true)}>
            + Add Item
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
                        onClick={() => {
                          if (confirm(`Delete ${item.name}?`)) {
                            setInventoryItems(items => items.filter(i => i.id !== item.id));
                          }
                        }}
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

      {/* Add/Edit Modal (placeholder for now) */}
      {(showAddModal || editingItem) && (
        <div className="modal-overlay" onClick={() => { setShowAddModal(false); setEditingItem(null); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingItem ? 'Edit Item' : 'Add New Item'}</h2>
            <p>Modal form will be implemented here</p>
            <button onClick={() => { setShowAddModal(false); setEditingItem(null); }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default KitchenInventory;

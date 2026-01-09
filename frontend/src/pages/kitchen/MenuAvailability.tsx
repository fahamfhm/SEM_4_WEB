import { useState, useEffect } from 'react';

import api from '../../services/api';
import '../../styles/KitchenMenuAvailability.css';

// ============================================
// Types
// ============================================
interface MenuItem {
  id: string;
  _id?: string;
  name: string;
  category: string;
  basePrice: number;
  image: string;
  availability: {
    inStock: boolean;
    outOfStockReason: string | null;
  };
}

// ============================================
// Component
// ============================================
const MenuAvailability = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [reasonModal, setReasonModal] = useState<{ itemId: string; itemName: string } | null>(null);
  const [outOfStockReason, setOutOfStockReason] = useState('');

  // Fetch menu items from backend
  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/menu/items?limit=100');
      const items = response.data.data || response.data;
      // Normalize items to have id field
      const normalizedItems = items.map((item: MenuItem) => ({
        ...item,
        id: item.id || item._id
      }));
      setMenuItems(normalizedItems);
    } catch (err) {
      console.error('Error fetching menu items:', err);
      setError('Failed to load menu items. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await api.get('/menu/categories');
      setCategories(response.data.data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  // Load data on mount
  useEffect(() => {
    fetchMenuItems();
    fetchCategories();
  }, []);

  // Toggle availability
  const toggleAvailability = async (item: MenuItem) => {
    const newInStock = !item.availability.inStock;
    
    // If marking as unavailable, show reason modal
    if (!newInStock) {
      setReasonModal({ itemId: item.id, itemName: item.name });
      setOutOfStockReason('');
      return;
    }

    // If marking as available, update directly
    await updateAvailability(item.id, true, null);
  };

  // Update availability on backend
  const updateAvailability = async (itemId: string, inStock: boolean, reason: string | null) => {
    try {
      setUpdating(itemId);
      await api.patch(`/menu/items/${itemId}/availability`, {
        inStock,
        outOfStockReason: reason
      });

      // Update local state
      setMenuItems(prev => prev.map(item => 
        item.id === itemId 
          ? { ...item, availability: { inStock, outOfStockReason: reason } }
          : item
      ));
    } catch (err) {
      console.error('Error updating availability:', err);
      alert('Failed to update availability. Please try again.');
    } finally {
      setUpdating(null);
    }
  };

  // Handle reason modal submit
  const handleReasonSubmit = async () => {
    if (reasonModal) {
      await updateAvailability(reasonModal.itemId, false, outOfStockReason || null);
      setReasonModal(null);
      setOutOfStockReason('');
    }
  };

  // Filter items
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate stats
  const stats = {
    total: menuItems.length,
    available: menuItems.filter(i => i.availability.inStock).length,
    unavailable: menuItems.filter(i => !i.availability.inStock).length
  };

  if (loading) {
    return (
      <div className="menu-availability-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading menu items...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="menu-availability-page">
        <div className="error-container">
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
          <button onClick={fetchMenuItems} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="menu-availability-page">
      <div className="availability-container">
        {/* Header */}
        <div className="availability-header">
          <h1>🍽️ Menu Availability</h1>
          <p className="subtitle">Toggle dish availability for kitchen operations</p>
        </div>

        {/* Stats Cards */}
        <div className="availability-stats">
          <div className="stat-card">
            <div className="stat-icon total">📋</div>
            <div className="stat-content">
              <h3>{stats.total}</h3>
              <p>Total Items</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon available">✅</div>
            <div className="stat-content">
              <h3>{stats.available}</h3>
              <p>Available</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon unavailable">🚫</div>
            <div className="stat-content">
              <h3>{stats.unavailable}</h3>
              <p>Unavailable</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="availability-controls">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search dishes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="category-filter">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <button className="refresh-btn" onClick={fetchMenuItems}>
            🔄 Refresh
          </button>
        </div>

        {/* Menu Items Grid */}
        <div className="menu-items-grid">
          {filteredItems.length === 0 ? (
            <div className="no-items">
              <span>🍽️</span>
              <p>No menu items found</p>
            </div>
          ) : (
            filteredItems.map(item => (
              <div 
                key={item.id} 
                className={`menu-item-card ${!item.availability.inStock ? 'unavailable' : ''}`}
              >
                <div className="item-image">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/400x300/png?text=No+Image';
                    }}
                  />
                  <span className={`status-badge ${item.availability.inStock ? 'available' : 'unavailable'}`}>
                    {item.availability.inStock ? '✓ Available' : '✗ Unavailable'}
                  </span>
                </div>
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p className="item-category">{item.category}</p>
                  <p className="item-price">LKR {item.basePrice.toFixed(2)}</p>
                  {!item.availability.inStock && item.availability.outOfStockReason && (
                    <p className="unavailable-reason">
                      <strong>Reason:</strong> {item.availability.outOfStockReason}
                    </p>
                  )}
                </div>
                <div className="item-actions">
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={item.availability.inStock}
                      onChange={() => toggleAvailability(item)}
                      disabled={updating === item.id}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">
                    {updating === item.id ? 'Updating...' : (item.availability.inStock ? 'Available' : 'Unavailable')}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Reason Modal */}
        {reasonModal && (
          <div className="modal-overlay" onClick={() => setReasonModal(null)}>
            <div className="reason-modal" onClick={e => e.stopPropagation()}>
              <h2>Mark as Unavailable</h2>
              <p>Why is <strong>{reasonModal.itemName}</strong> unavailable?</p>
              <textarea
                placeholder="Enter reason (optional)..."
                value={outOfStockReason}
                onChange={(e) => setOutOfStockReason(e.target.value)}
                rows={3}
              />
              <div className="modal-actions">
                <button className="cancel-btn" onClick={() => setReasonModal(null)}>
                  Cancel
                </button>
                <button className="confirm-btn" onClick={handleReasonSubmit}>
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuAvailability;

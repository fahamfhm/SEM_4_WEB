import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import '../../styles/MenuManagement.css';

interface MenuItem {
  _id: string;
  name: string;
  basePrice: number;
  category: string;
  description?: string;
  image?: string;
  isVegetarian: boolean;
  isAvailable?: boolean; // Deprecated - kept for backward compatibility
  availability?: {
    inStock: boolean;
    outOfStockReason?: string | null;
  };
  createdAt?: string;
  updatedAt?: string;
}

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

type ViewMode = 'grid' | 'table';

const MenuManagement: React.FC = () => {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastCounter = useRef(0);
  const [formData, setFormData] = useState({
    name: '',
    basePrice: '',
    category: 'Main Dishes',
    description: '',
    image: '',
    isVegetarian: false,
    isAvailable: true
  });

  // Toast notification helper
  const showToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = ++toastCounter.current;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (!token || !userStr) {
      showToast('Please login to access menu management', 'error');
      navigate('/auth/login');
      return;
    }

    try {
      const user = JSON.parse(userStr);
      if (user.role !== 'admin') {
        showToast('Access denied. Admin role required.', 'error');
        navigate('/');
        return;
      }
    } catch (err) {
      console.error('Invalid user data:', err);
      navigate('/auth/login');
    }

    fetchMenuItems();

    // Real-time updates - refresh every 30 seconds
    const interval = setInterval(() => {
      fetchMenuItems(true);
    }, 30000);

    return () => clearInterval(interval);
  }, [navigate, showToast]);

  const fetchMenuItems = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const response = await api.get('/menu/items?limit=1000');
      setMenuItems(response.data.data || []);
    } catch (err: any) {
      console.error('Error fetching menu items:', err);
      if (!silent) {
        showToast(err.response?.data?.error || 'Failed to load menu items', 'error');
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Transform data to match backend schema
      const submitData: any = {
        name: formData.name,
        basePrice: parseFloat(formData.basePrice),
        category: formData.category,
        isVegetarian: formData.isVegetarian,
        availability: {
          inStock: formData.isAvailable
        }
      };

      // Add optional fields if they exist
      if (formData.description) {
        submitData.description = formData.description;
      }
      if (formData.image) {
        submitData.image = formData.image;
      }

      console.log('Submitting data:', submitData);

      if (editingId) {
        await api.put(`/menu/items/${editingId}`, submitData);
        showToast('Menu item updated successfully!', 'success');
      } else {
        await api.post('/menu/items', submitData);
        showToast('Menu item created successfully!', 'success');
      }
      
      resetForm();
      fetchMenuItems();
    } catch (err: any) {
      console.error('Error saving menu item:', err);
      console.error('Error details:', err.response?.data);
      const errorMsg = err.response?.data?.errors 
        ? err.response.data.errors.map((e: any) => e.msg).join(', ')
        : err.response?.data?.error || err.response?.data?.message || 'Error saving menu item';
      showToast(errorMsg, 'error');
    }
  };

  const handleEdit = (item: MenuItem) => {
    setFormData({
      name: item.name,
      basePrice: item.basePrice.toString(),
      category: item.category,
      description: item.description || '',
      image: item.image || '',
      isVegetarian: item.isVegetarian,
      isAvailable: item.availability?.inStock ?? item.isAvailable ?? false
    });
    setEditingId(item._id);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await api.delete(`/menu/items/${id}`);
        showToast('Menu item deleted successfully!', 'success');
        fetchMenuItems();
      } catch (err: any) {
        console.error('Error deleting menu item:', err);
        showToast(err.response?.data?.error || 'Error deleting menu item', 'error');
      }
    }
  };

  const toggleAvailability = async (id: string, currentStatus: boolean) => {
    try {
      await api.patch(`/menu/items/${id}/availability`, {
        inStock: !currentStatus
      });
      showToast(`Item marked as ${!currentStatus ? 'available' : 'unavailable'}`, 'success');
      fetchMenuItems(true);
    } catch (err: any) {
      console.error('Error updating availability:', err);
      showToast(err.response?.data?.error || 'Error updating availability', 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      basePrice: '',
      category: 'Main Dishes',
      description: '',
      image: '',
      isVegetarian: false,
      isAvailable: true
    });
    setEditingId(null);
    setShowModal(false);
  };

  // Bulk operations
  const handleBulkDelete = async () => {
    if (selectedItems.size === 0) {
      showToast('No items selected', 'info');
      return;
    }
    if (window.confirm(`Delete ${selectedItems.size} selected items?`)) {
      try {
        await Promise.all(
          Array.from(selectedItems).map(id => api.delete(`/menu/items/${id}`))
        );
        showToast(`${selectedItems.size} items deleted successfully!`, 'success');
        setSelectedItems(new Set());
        fetchMenuItems();
      } catch (err: any) {
        showToast('Error deleting some items', 'error');
      }
    }
  };

  const handleBulkToggleAvailability = async (available: boolean) => {
    if (selectedItems.size === 0) {
      showToast('No items selected', 'info');
      return;
    }
    try {
      await Promise.all(
        Array.from(selectedItems).map(id => 
          api.patch(`/menu/items/${id}/availability`, { inStock: available })
        )
      );
      showToast(`${selectedItems.size} items marked as ${available ? 'available' : 'unavailable'}!`, 'success');
      setSelectedItems(new Set());
      fetchMenuItems();
    } catch (err: any) {
      showToast('Error updating some items', 'error');
    }
  };

  const toggleSelectItem = (id: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === filteredItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredItems.map(item => item._id)));
    }
  };

  const categories = ['Main Dishes', 'Beverages', 'Desserts', 'Sides', 'Specials'];
  
  // Enhanced filtering with search
  const filteredItems = menuItems.filter(item => {
    // Search filter
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    // Category filter
    if (categoryFilter !== 'all' && item.category !== categoryFilter) {
      return false;
    }
    // Availability filter
    const isAvailable = item.availability?.inStock ?? item.isAvailable ?? false;
    if (availabilityFilter === 'available' && !isAvailable) {
      return false;
    }
    if (availabilityFilter === 'unavailable' && isAvailable) {
      return false;
    }
    return true;
  });

  // Calculate stats
  const stats = {
    total: menuItems.length,
    available: menuItems.filter(i => i.availability?.inStock ?? i.isAvailable ?? false).length,
    unavailable: menuItems.filter(i => !(i.availability?.inStock ?? i.isAvailable ?? true)).length,
    vegetarian: menuItems.filter(i => i.isVegetarian).length
  };

  if (loading) {
    return (
      <div className="menu-mgmt-container">
        <div className="menu-mgmt-loading">
          <div className="menu-mgmt-spinner"></div>
          <p>Loading menu items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="menu-mgmt-container">
      {/* Toast Notifications */}
      <div className="menu-mgmt-toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`menu-mgmt-toast menu-mgmt-toast-${toast.type}`}>
            <span className="menu-mgmt-toast-icon">
              {toast.type === 'success' && '✓'}
              {toast.type === 'error' && '✕'}
              {toast.type === 'info' && 'ℹ'}
            </span>
            <span className="menu-mgmt-toast-message">{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="menu-mgmt-header">
        <div className="menu-mgmt-header-left">
          <h1 className="menu-mgmt-title">🍽️ Menu Management</h1>
          <p className="menu-mgmt-subtitle">Manage your restaurant menu items</p>
        </div>
        <button 
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="menu-mgmt-btn-add"
        >
          <span className="menu-mgmt-btn-icon">+</span>
          Add New Item
        </button>
      </div>

      {/* Stats Dashboard */}
      <div className="menu-mgmt-stats">
        <div className="menu-mgmt-stat-card">
          <div className="menu-mgmt-stat-icon menu-mgmt-stat-icon-total">📊</div>
          <div className="menu-mgmt-stat-content">
            <div className="menu-mgmt-stat-value">{stats.total}</div>
            <div className="menu-mgmt-stat-label">Total Items</div>
          </div>
        </div>
        <div className="menu-mgmt-stat-card">
          <div className="menu-mgmt-stat-icon menu-mgmt-stat-icon-available">✅</div>
          <div className="menu-mgmt-stat-content">
            <div className="menu-mgmt-stat-value">{stats.available}</div>
            <div className="menu-mgmt-stat-label">Available</div>
          </div>
        </div>
        <div className="menu-mgmt-stat-card">
          <div className="menu-mgmt-stat-icon menu-mgmt-stat-icon-unavailable">❌</div>
          <div className="menu-mgmt-stat-content">
            <div className="menu-mgmt-stat-value">{stats.unavailable}</div>
            <div className="menu-mgmt-stat-label">Unavailable</div>
          </div>
        </div>
        <div className="menu-mgmt-stat-card">
          <div className="menu-mgmt-stat-icon menu-mgmt-stat-icon-veg">🌱</div>
          <div className="menu-mgmt-stat-content">
            <div className="menu-mgmt-stat-value">{stats.vegetarian}</div>
            <div className="menu-mgmt-stat-label">Vegetarian</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="menu-mgmt-controls">
        <div className="menu-mgmt-search-bar">
          <span className="menu-mgmt-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by item name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="menu-mgmt-search-input"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="menu-mgmt-search-clear"
            >
              ✕
            </button>
          )}
        </div>

        <div className="menu-mgmt-view-toggle">
          <button
            onClick={() => setViewMode('grid')}
            className={`menu-mgmt-view-btn ${viewMode === 'grid' ? 'menu-mgmt-view-btn-active' : ''}`}
            title="Grid View"
          >
            ⊞
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`menu-mgmt-view-btn ${viewMode === 'table' ? 'menu-mgmt-view-btn-active' : ''}`}
            title="Table View"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="menu-mgmt-filters">
        <div className="menu-mgmt-filter-group">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`menu-mgmt-filter-btn ${categoryFilter === 'all' ? 'menu-mgmt-filter-btn-active' : ''}`}
          >
            All Categories
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setCategoryFilter(category)}
              className={`menu-mgmt-filter-btn ${categoryFilter === category ? 'menu-mgmt-filter-btn-active' : ''}`}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="menu-mgmt-filter-group">
          <button
            onClick={() => setAvailabilityFilter('all')}
            className={`menu-mgmt-filter-btn ${availabilityFilter === 'all' ? 'menu-mgmt-filter-btn-active' : ''}`}
          >
            All Status
          </button>
          <button
            onClick={() => setAvailabilityFilter('available')}
            className={`menu-mgmt-filter-btn ${availabilityFilter === 'available' ? 'menu-mgmt-filter-btn-active' : ''}`}
          >
            Available Only
          </button>
          <button
            onClick={() => setAvailabilityFilter('unavailable')}
            className={`menu-mgmt-filter-btn ${availabilityFilter === 'unavailable' ? 'menu-mgmt-filter-btn-active' : ''}`}
          >
            Unavailable Only
          </button>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedItems.size > 0 && (
        <div className="menu-mgmt-bulk-bar">
          <div className="menu-mgmt-bulk-info">
            <input
              type="checkbox"
              checked={selectedItems.size === filteredItems.length}
              onChange={toggleSelectAll}
              className="menu-mgmt-checkbox"
            />
            <span>{selectedItems.size} item(s) selected</span>
          </div>
          <div className="menu-mgmt-bulk-actions">
            <button
              onClick={() => handleBulkToggleAvailability(true)}
              className="menu-mgmt-bulk-btn menu-mgmt-bulk-btn-available"
            >
              Mark Available
            </button>
            <button
              onClick={() => handleBulkToggleAvailability(false)}
              className="menu-mgmt-bulk-btn menu-mgmt-bulk-btn-unavailable"
            >
              Mark Unavailable
            </button>
            <button
              onClick={handleBulkDelete}
              className="menu-mgmt-bulk-btn menu-mgmt-bulk-btn-delete"
            >
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      {filteredItems.length === 0 ? (
        <div className="menu-mgmt-empty">
          <div className="menu-mgmt-empty-icon">🍽️</div>
          <h2 className="menu-mgmt-empty-title">No menu items found</h2>
          <p className="menu-mgmt-empty-text">
            {searchQuery || categoryFilter !== 'all' || availabilityFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Add your first menu item to get started!'}
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="menu-mgmt-grid">
          {filteredItems.map(item => (
            <div key={item._id} className="menu-mgmt-card">
              <div className="menu-mgmt-card-select">
                <input
                  type="checkbox"
                  checked={selectedItems.has(item._id)}
                  onChange={() => toggleSelectItem(item._id)}
                  className="menu-mgmt-checkbox"
                />
              </div>
              {item.image ? (
                <div className="menu-mgmt-card-image">
                  <img src={item.image} alt={item.name} />
                  {!(item.availability?.inStock ?? item.isAvailable ?? false) && (
                    <div className="menu-mgmt-card-overlay">Unavailable</div>
                  )}
                </div>
              ) : (
                <div className="menu-mgmt-card-placeholder">
                  <span>🍽️</span>
                </div>
              )}
              <div className="menu-mgmt-card-content">
                <h3 className="menu-mgmt-card-title">{item.name}</h3>
                {item.description && (
                  <p className="menu-mgmt-card-description">{item.description}</p>
                )}
                <div className="menu-mgmt-card-meta">
                  <span className="menu-mgmt-card-category">{item.category}</span>
                  <span className="menu-mgmt-card-price">Rs. {item.basePrice.toFixed(2)}</span>
                </div>
                <div className="menu-mgmt-card-badges">
                  {item.isVegetarian && (
                    <span className="menu-mgmt-badge menu-mgmt-badge-veg">🌱 Veg</span>
                  )}
                  <span className={`menu-mgmt-badge ${(item.availability?.inStock ?? item.isAvailable ?? false) ? 'menu-mgmt-badge-available' : 'menu-mgmt-badge-unavailable'}`}>
                    {(item.availability?.inStock ?? item.isAvailable ?? false) ? '✅ Available' : '❌ Unavailable'}
                  </span>
                </div>
              </div>
              <div className="menu-mgmt-card-actions">
                <button
                  onClick={() => toggleAvailability(item._id, item.availability?.inStock ?? item.isAvailable ?? false)}
                  className="menu-mgmt-card-btn menu-mgmt-card-btn-toggle"
                  title="Toggle Availability"
                >
                  {(item.availability?.inStock ?? item.isAvailable ?? false) ? '🚫' : '✅'}
                </button>
                <button
                  onClick={() => handleEdit(item)}
                  className="menu-mgmt-card-btn menu-mgmt-card-btn-edit"
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="menu-mgmt-card-btn menu-mgmt-card-btn-delete"
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="menu-mgmt-table-container">
          <table className="menu-mgmt-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedItems.size === filteredItems.length && filteredItems.length > 0}
                    onChange={toggleSelectAll}
                    className="menu-mgmt-checkbox"
                  />
                </th>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(item => (
                <tr key={item._id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedItems.has(item._id)}
                      onChange={() => toggleSelectItem(item._id)}
                      className="menu-mgmt-checkbox"
                    />
                  </td>
                  <td>
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="menu-mgmt-table-img" />
                    ) : (
                      <div className="menu-mgmt-table-placeholder">🍽️</div>
                    )}
                  </td>
                  <td className="menu-mgmt-table-name">{item.name}</td>
                  <td>
                    <span className="menu-mgmt-table-category">{item.category}</span>
                  </td>
                  <td className="menu-mgmt-table-price">Rs. {item.basePrice.toFixed(2)}</td>
                  <td>
                    <span className={`menu-mgmt-badge ${(item.availability?.inStock ?? item.isAvailable ?? false) ? 'menu-mgmt-badge-available' : 'menu-mgmt-badge-unavailable'}`}>
                      {(item.availability?.inStock ?? item.isAvailable ?? false) ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td>
                    {item.isVegetarian && (
                      <span className="menu-mgmt-badge menu-mgmt-badge-veg">🌱 Veg</span>
                    )}
                  </td>
                  <td>
                    <div className="menu-mgmt-table-actions">
                      <button
                        onClick={() => toggleAvailability(item._id, item.availability?.inStock ?? item.isAvailable ?? false)}
                        className="menu-mgmt-table-btn menu-mgmt-table-btn-toggle"
                        title="Toggle"
                      >
                        {(item.availability?.inStock ?? item.isAvailable ?? false) ? '🚫' : '✅'}
                      </button>
                      <button
                        onClick={() => handleEdit(item)}
                        className="menu-mgmt-table-btn menu-mgmt-table-btn-edit"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="menu-mgmt-table-btn menu-mgmt-table-btn-delete"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Form */}
      {showModal && (
        <div className="menu-mgmt-modal-overlay" onClick={resetForm}>
          <div className="menu-mgmt-modal" onClick={(e) => e.stopPropagation()}>
            <div className="menu-mgmt-modal-header">
              <h2 className="menu-mgmt-modal-title">
                {editingId ? '✏️ Edit Menu Item' : '✨ Add New Item'}
              </h2>
              <button onClick={resetForm} className="menu-mgmt-modal-close">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="menu-mgmt-modal-form">
              <div className="menu-mgmt-form-grid">
                <div className="menu-mgmt-form-group">
                  <label className="menu-mgmt-label">Item Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="menu-mgmt-input"
                    placeholder="Enter item name"
                  />
                </div>
                <div className="menu-mgmt-form-group">
                  <label className="menu-mgmt-label">Base Price (Rs.) *</label>
                  <input
                    type="number"
                    name="basePrice"
                    value={formData.basePrice}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                    min="0"
                    className="menu-mgmt-input"
                    placeholder="0.00"
                  />
                </div>
                <div className="menu-mgmt-form-group">
                  <label className="menu-mgmt-label">Category *</label>
                  <select 
                    name="category" 
                    value={formData.category} 
                    onChange={handleInputChange}
                    className="menu-mgmt-select"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="menu-mgmt-form-group">
                  <label className="menu-mgmt-label">Image URL</label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    className="menu-mgmt-input"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="menu-mgmt-form-group menu-mgmt-form-full">
                  <label className="menu-mgmt-label">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="menu-mgmt-textarea"
                    placeholder="Brief description of the item"
                    rows={3}
                  />
                </div>
                <div className="menu-mgmt-form-checkboxes">
                  <label className="menu-mgmt-checkbox-label">
                    <input
                      type="checkbox"
                      name="isVegetarian"
                      checked={formData.isVegetarian}
                      onChange={handleInputChange}
                      className="menu-mgmt-checkbox"
                    />
                    <span>🌱 Vegetarian</span>
                  </label>
                  <label className="menu-mgmt-checkbox-label">
                    <input
                      type="checkbox"
                      name="isAvailable"
                      checked={formData.isAvailable}
                      onChange={handleInputChange}
                      className="menu-mgmt-checkbox"
                    />
                    <span>✅ Available</span>
                  </label>
                </div>
              </div>
              <div className="menu-mgmt-modal-actions">
                <button type="submit" className="menu-mgmt-btn-save">
                  {editingId ? '💾 Update Item' : '➕ Create Item'}
                </button>
                <button type="button" onClick={resetForm} className="menu-mgmt-btn-cancel">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManagement;

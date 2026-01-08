import React, { useState, useEffect } from 'react';
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
  isAvailable: boolean;
}

const MenuManagement: React.FC = () => {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [formData, setFormData] = useState({
    name: '',
    basePrice: '',
    category: 'Burgers',
    description: '',
    image: '',
    isVegetarian: false,
    isAvailable: true
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (!token || !userStr) {
      alert('Please login to access menu management');
      navigate('/auth/login');
      return;
    }

    try {
      const user = JSON.parse(userStr);
      if (user.role !== 'admin') {
        alert('Access denied. Admin role required.');
        navigate('/');
        return;
      }
    } catch (err) {
      console.error('Invalid user data:', err);
      navigate('/auth/login');
    }

    fetchMenuItems();
  }, [navigate]);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/menu/items');
      setMenuItems(response.data.data || []);
    } catch (err: any) {
      console.error('Error fetching menu items:', err);
      setError(err.response?.data?.error || 'Failed to load menu items');
    } finally {
      setLoading(false);
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
      const submitData = {
        ...formData,
        basePrice: parseFloat(formData.basePrice)
      };

      if (editingId) {
        await api.put(`/menu/items/${editingId}`, submitData);
      } else {
        await api.post('/menu/items', submitData);
      }
      
      alert(`Menu item ${editingId ? 'updated' : 'created'} successfully!`);
      resetForm();
      fetchMenuItems();
    } catch (err: any) {
      console.error('Error saving menu item:', err);
      alert(err.response?.data?.error || 'Error saving menu item');
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
      isAvailable: item.isAvailable
    });
    setEditingId(item._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await api.delete(`/menu/items/${id}`);
        alert('Menu item deleted successfully!');
        fetchMenuItems();
      } catch (err: any) {
        console.error('Error deleting menu item:', err);
        alert(err.response?.data?.error || 'Error deleting menu item');
      }
    }
  };

  const toggleAvailability = async (id: string, currentStatus: boolean) => {
    try {
      await api.patch(`/menu/items/${id}/availability`, {
        isAvailable: !currentStatus
      });
      fetchMenuItems();
    } catch (err: any) {
      console.error('Error updating availability:', err);
      alert(err.response?.data?.error || 'Error updating availability');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      basePrice: '',
      category: 'Burgers',
      description: '',
      image: '',
      isVegetarian: false,
      isAvailable: true
    });
    setEditingId(null);
    setShowForm(false);
  };

  const categories = ['Burgers', 'Hot Dogs', 'Drinks', 'Desserts', 'Sides'];
  const filteredItems = categoryFilter === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === categoryFilter);

  if (loading) {
    return (
      <div className="admin-menu-container">
        <div className="admin-menu-loading">
          <div className="admin-menu-spinner"></div>
          <p>Loading menu items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-menu-container">
      {/* Header */}
      <div className="admin-menu-header">
        <div className="admin-menu-header-content">
          <h1 className="admin-menu-title">🍽️ Menu Management</h1>
          <p className="admin-menu-subtitle">Manage your restaurant menu items</p>
        </div>
        <button 
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setShowForm(true);
            }
          }}
          className={`admin-menu-btn-add ${showForm ? 'admin-menu-btn-cancel' : ''}`}
        >
          {showForm ? '✕ Cancel' : '+ Add New Item'}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="admin-menu-error">
          <span className="admin-menu-error-icon">⚠️</span>
          <span>{error}</span>
          <button onClick={fetchMenuItems} className="admin-menu-error-retry">Retry</button>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="admin-menu-form-container">
          <form onSubmit={handleSubmit} className="admin-menu-form">
            <h2 className="admin-menu-form-title">
              {editingId ? '✏️ Edit Menu Item' : '✨ Add New Menu Item'}
            </h2>
            
            <div className="admin-menu-form-grid">
              <div className="admin-menu-form-group">
                <label className="admin-menu-label">Item Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="admin-menu-input"
                  placeholder="Enter item name"
                />
              </div>

              <div className="admin-menu-form-group">
                <label className="admin-menu-label">Base Price (Rs.) *</label>
                <input
                  type="number"
                  name="basePrice"
                  value={formData.basePrice}
                  onChange={handleInputChange}
                  required
                  step="0.01"
                  min="0"
                  className="admin-menu-input"
                  placeholder="0.00"
                />
              </div>

              <div className="admin-menu-form-group">
                <label className="admin-menu-label">Category *</label>
                <select 
                  name="category" 
                  value={formData.category} 
                  onChange={handleInputChange}
                  className="admin-menu-select"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="admin-menu-form-group admin-menu-full-width">
                <label className="admin-menu-label">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="admin-menu-textarea"
                  placeholder="Brief description of the item"
                  rows={3}
                />
              </div>

              <div className="admin-menu-form-group admin-menu-full-width">
                <label className="admin-menu-label">Image URL</label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="admin-menu-input"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="admin-menu-form-checkboxes">
                <label className="admin-menu-checkbox-label">
                  <input
                    type="checkbox"
                    name="isVegetarian"
                    checked={formData.isVegetarian}
                    onChange={handleInputChange}
                    className="admin-menu-checkbox"
                  />
                  <span>🌱 Vegetarian</span>
                </label>
                <label className="admin-menu-checkbox-label">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={handleInputChange}
                    className="admin-menu-checkbox"
                  />
                  <span>✅ Available</span>
                </label>
              </div>
            </div>

            <div className="admin-menu-form-actions">
              <button type="submit" className="admin-menu-btn-save">
                {editingId ? '💾 Update Item' : '➕ Create Item'}
              </button>
              <button type="button" onClick={resetForm} className="admin-menu-btn-cancel-form">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Category Filter */}
      <div className="admin-menu-filters">
        <button
          onClick={() => setCategoryFilter('all')}
          className={`admin-menu-filter ${categoryFilter === 'all' ? 'admin-menu-filter-active' : ''}`}
        >
          All ({menuItems.length})
        </button>
        {categories.map(category => {
          const count = menuItems.filter(item => item.category === category).length;
          return (
            <button
              key={category}
              onClick={() => setCategoryFilter(category)}
              className={`admin-menu-filter ${categoryFilter === category ? 'admin-menu-filter-active' : ''}`}
            >
              {category} ({count})
            </button>
          );
        })}
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="admin-menu-empty">
          <div className="admin-menu-empty-icon">🍽️</div>
          <p className="admin-menu-empty-text">
            No menu items found. {categoryFilter !== 'all' && 'Try a different category or '}
            Add your first item to get started!
          </p>
        </div>
      ) : (
        <div className="admin-menu-grid">
          {filteredItems.map(item => (
            <div key={item._id} className={`admin-menu-card ${!item.isAvailable ? 'admin-menu-card-unavailable' : ''}`}>
              {item.image && (
                <div className="admin-menu-card-image">
                  <img src={item.image} alt={item.name} />
                  {!item.isAvailable && (
                    <div className="admin-menu-card-overlay">Out of Stock</div>
                  )}
                </div>
              )}
              <div className="admin-menu-card-content">
                <h3 className="admin-menu-card-title">{item.name}</h3>
                {item.description && (
                  <p className="admin-menu-card-description">{item.description}</p>
                )}
                <div className="admin-menu-card-meta">
                  <span className="admin-menu-card-category">{item.category}</span>
                  <span className="admin-menu-card-price">Rs. {item.basePrice.toFixed(2)}</span>
                </div>
                <div className="admin-menu-card-badges">
                  {item.isVegetarian && (
                    <span className="admin-menu-badge admin-menu-badge-veg">🌱 Veg</span>
                  )}
                  <span className={`admin-menu-badge ${item.isAvailable ? 'admin-menu-badge-available' : 'admin-menu-badge-unavailable'}`}>
                    {item.isAvailable ? '✅ Available' : '❌ Unavailable'}
                  </span>
                </div>
              </div>
              <div className="admin-menu-card-actions">
                <button
                  onClick={() => toggleAvailability(item._id, item.isAvailable)}
                  className={`admin-menu-action ${item.isAvailable ? 'admin-menu-action-disable' : 'admin-menu-action-enable'}`}
                  title={item.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
                >
                  {item.isAvailable ? '🚫' : '✅'}
                </button>
                <button
                  onClick={() => handleEdit(item)}
                  className="admin-menu-action admin-menu-action-edit"
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="admin-menu-action admin-menu-action-delete"
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuManagement;

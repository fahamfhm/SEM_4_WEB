import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/MenuManagement.css';

interface MenuItem {
  id: string;
  name: string;
  basePrice: number;
  category: string;
  image: string;
  isVegetarian: boolean;
  inStock: boolean;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const MenuManagement: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    basePrice: '',
    category: 'Burgers',
    image: '',
    isVegetarian: false,
    inStock: true
  });

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/menu/items`);
      setMenuItems(response.data.data || []);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      if (editingId) {
        await axios.put(`${API_BASE_URL}/menu/items/${editingId}`, formData);
      } else {
        await axios.post(`${API_BASE_URL}/menu/items`, formData);
      }
      
      setFormData({
        name: '',
        basePrice: '',
        category: 'Burgers',
        image: '',
        isVegetarian: false,
        inStock: true
      });
      setEditingId(null);
      setShowForm(false);
      fetchMenuItems();
    } catch (error) {
      console.error('Error saving menu item:', error);
      alert('Error saving menu item');
    }
  };

  const handleEdit = (item: MenuItem) => {
    setFormData({
      name: item.name,
      basePrice: item.basePrice.toString(),
      category: item.category,
      image: item.image,
      isVegetarian: item.isVegetarian,
      inStock: item.inStock
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`${API_BASE_URL}/menu/items/${id}`);
        fetchMenuItems();
      } catch (error) {
        console.error('Error deleting menu item:', error);
        alert('Error deleting menu item');
      }
    }
  };

  if (loading) return <div className="loading">Loading menu items...</div>;

  return (
    <div className="menu-management-page">
      <div className="management-header">
        <h1>🍽️ Menu Management</h1>
        <button 
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({
              name: '',
              basePrice: '',
              category: 'Burgers',
              image: '',
              isVegetarian: false,
              inStock: true
            });
          }}
          className="btn-add"
        >
          + Add New Item
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <form onSubmit={handleSubmit} className="menu-form">
            <h2>{editingId ? 'Edit Menu Item' : 'Add New Menu Item'}</h2>
            
            <div className="form-group">
              <label>Item Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter item name"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Base Price (LKR)</label>
                <input
                  type="number"
                  name="basePrice"
                  value={formData.basePrice}
                  onChange={handleInputChange}
                  required
                  step="0.01"
                  placeholder="0.00"
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select id="category" name="category" value={formData.category} onChange={handleInputChange} aria-label="Item category">
                  <option value="Burgers">Burgers</option>
                  <option value="Hot Dogs">Hot Dogs</option>
                  <option value="Drinks">Drinks</option>
                  <option value="Desserts">Desserts</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Image URL</label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="https://..."
              />
            </div>

            <div className="form-checkboxes">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isVegetarian"
                  checked={formData.isVegetarian}
                  onChange={handleInputChange}
                />
                <span>Vegetarian</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="inStock"
                  checked={formData.inStock}
                  onChange={handleInputChange}
                />
                <span>In Stock</span>
              </label>
            </div>

            <div className="form-buttons">
              <button type="submit" className="btn-save">Save Item</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-cancel">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="items-grid">
        {menuItems.map(item => (
          <div key={item.id} className="menu-item-card">
            {item.image && <img src={item.image} alt={item.name} className="item-image" />}
            <div className="item-content">
              <h3>{item.name}</h3>
              <p className="item-category">{item.category}</p>
              <p className="item-price">LKR {item.basePrice.toFixed(2)}</p>
              <div className="item-meta">
                {item.isVegetarian && <span className="badge vegetarian">🌱 Vegetarian</span>}
                {!item.inStock && <span className="badge out-of-stock">Out of Stock</span>}
              </div>
            </div>
            <div className="item-actions">
              <button onClick={() => handleEdit(item)} className="btn-edit">Edit</button>
              <button onClick={() => handleDelete(item.id)} className="btn-delete">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuManagement;

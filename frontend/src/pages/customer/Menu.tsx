import { useState, useEffect } from 'react'
import axios from 'axios'
import MenuItem from '../../components/MenuItem'
import CategoryFilter from '../../components/CategoryFilter'
import { useCart } from '../../contexts/CartContext'
import type { CartItem } from '../../contexts/CartContext'
import '../../styles/Menu.css'

interface CustomizationGroup {
  id: string
  name: string
  type: 'addons' | 'single_select'
  isRequired: boolean
  options: Array<{ id: string; name: string; price: number }>
}

interface MenuItemData {
  id: string
  name: string
  description: string
  basePrice: number
  image: string
  category: string
  isVegetarian: boolean
  customizationGroups: CustomizationGroup[]
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function Menu() {
  const [menuItems, setMenuItems] = useState<MenuItemData[]>([])
  const [filteredItems, setFilteredItems] = useState<MenuItemData[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { addToCart, cartTotal, cartItemCount } = useCart()

  // Fetch menu items from API
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${API_BASE_URL}/menu/items`)
        setMenuItems(response.data.data || [])
        setError('')
      } catch (err) {
        console.error('Error fetching menu items:', err)
        setError('Failed to load menu. Using demo data.')
        setMenuItems(getDemoMenuItems())
      } finally {
        setLoading(false)
      }
    }

    fetchMenuItems()
  }, [])

  // Filter items based on category and search
  useEffect(() => {
    let filtered = menuItems

    if (selectedCategory) {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }

    if (searchQuery) {
      filtered = filtered.filter(
        item =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredItems(filtered)
  }, [menuItems, selectedCategory, searchQuery])

  const categories = [...new Set(menuItems.map(item => item.category))]

  const handleAddToCart = (itemDetails: CartItem) => {
    addToCart(itemDetails)
    alert(`${itemDetails.name} added to cart!`)
  }

  return (
    <div className="menu-page">
      <div className="menu-header">
        <div className="header-content">
          <h1>🍽️ Our Menu</h1>
          <p className="subtitle">Explore our delicious offerings</p>
        </div>
        <div className="cart-indicator">
          <span className="cart-icon">🛒</span>
          <div className="cart-info">
            <span className="cart-count">{cartItemCount}</span>
            <span className="cart-total">LKR {cartTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading menu items...</p>
        </div>
      ) : (
        <div className="menu-container">
          {filteredItems.length > 0 ? (
            <div className="menu-grid">
              {filteredItems.map(item => (
                <MenuItem
                  key={item.id}
                  {...item}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          ) : (
            <div className="no-items">
              <p>📭 No menu items found</p>
              <p className="no-items-subtitle">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Demo data for testing
function getDemoMenuItems(): MenuItemData[] {
  return [
    {
      id: '1',
      name: 'Classic Burger',
      description: 'Juicy beef patty with fresh toppings and special sauce',
      basePrice: 450,
      image: 'https://via.placeholder.com/300x200?text=Classic+Burger',
      category: 'Burgers',
      isVegetarian: false,
      customizationGroups: [
        {
          id: 'addons',
          name: 'Add-ons',
          type: 'addons',
          isRequired: false,
          options: [
            { id: 'cheese', name: 'Extra Cheese', price: 50 },
            { id: 'bacon', name: 'Bacon', price: 80 },
            { id: 'mushrooms', name: 'Mushrooms', price: 40 },
          ],
        },
        {
          id: 'spice',
          name: 'Spice Level',
          type: 'single_select',
          isRequired: true,
          options: [
            { id: 'mild', name: 'Mild', price: 0 },
            { id: 'medium', name: 'Medium', price: 0 },
            { id: 'hot', name: 'Hot', price: 0 },
          ],
        },
      ],
    },
    {
      id: '2',
      name: 'Veggie Burger',
      description: 'Delicious vegetable patty with special sauce',
      basePrice: 380,
      image: 'https://via.placeholder.com/300x200?text=Veggie+Burger',
      category: 'Burgers',
      isVegetarian: true,
      customizationGroups: [
        {
          id: 'addons',
          name: 'Add-ons',
          type: 'addons',
          isRequired: false,
          options: [
            { id: 'cheese', name: 'Extra Cheese', price: 50 },
            { id: 'avocado', name: 'Avocado', price: 60 },
          ],
        },
      ],
    },
    {
      id: '3',
      name: 'Hot Dog',
      description: 'Premium sausage with mustard and relish',
      basePrice: 300,
      image: 'https://via.placeholder.com/300x200?text=Hot+Dog',
      category: 'Hot Dogs',
      isVegetarian: false,
      customizationGroups: [
        {
          id: 'toppings',
          name: 'Toppings',
          type: 'addons',
          isRequired: false,
          options: [
            { id: 'onions', name: 'Grilled Onions', price: 30 },
            { id: 'peppers', name: 'Bell Peppers', price: 40 },
          ],
        },
      ],
    },
    {
      id: '4',
      name: 'Iced Tea',
      description: 'Refreshing iced tea with lemon',
      basePrice: 150,
      image: 'https://via.placeholder.com/300x200?text=Iced+Tea',
      category: 'Drinks',
      isVegetarian: true,
      customizationGroups: [],
    },
    {
      id: '5',
      name: 'Chocolate Cake',
      description: 'Rich and moist chocolate cake',
      basePrice: 250,
      image: 'https://via.placeholder.com/300x200?text=Chocolate+Cake',
      category: 'Desserts',
      isVegetarian: true,
      customizationGroups: [],
    },
    {
      id: '6',
      name: 'Cheese Burger',
      description: 'Beef patty with melted cheese and fresh vegetables',
      basePrice: 400,
      image: 'https://via.placeholder.com/300x200?text=Cheese+Burger',
      category: 'Burgers',
      isVegetarian: false,
      customizationGroups: [
        {
          id: 'addons',
          name: 'Add-ons',
          type: 'addons',
          isRequired: false,
          options: [
            { id: 'bacon', name: 'Bacon', price: 80 },
            { id: 'egg', name: 'Fried Egg', price: 45 },
          ],
        },
      ],
    },
  ]
}

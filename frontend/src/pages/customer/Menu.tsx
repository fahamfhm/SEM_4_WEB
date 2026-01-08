import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import MenuItem from '../../components/MenuItem'
import CategoryFilter from '../../components/CategoryFilter'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import OrderService from '../../services/orderService'
import type { CartItem } from '../../context/CartContext'
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
  _id?: string
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
  const navigate = useNavigate()
  const location = useLocation()
  const isGuestMode = location.pathname.includes('/guest')
  const { user, isAuthenticated } = useAuth()
  const hasGuestSession = OrderService.hasGuestSession()
  
  const [menuItems, setMenuItems] = useState<MenuItemData[]>([])
  const [filteredItems, setFilteredItems] = useState<MenuItemData[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const groupByType = true
  const { addToCart, cartTotal, cartItemCount } = useCart()

  const handleCartClick = () => {
    navigate(isGuestMode ? '/guest/cart' : '/customer/cart')
  }

  const handleProfileClick = () => {
    navigate('/customer/profile')
  }

  const handleOrdersClick = () => {
    navigate('/customer/order-history')
  }

  // Fetch menu items from API
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${API_BASE_URL}/menu/items?limit=100`)
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

  const categories = useMemo(() => 
    [...new Set(menuItems.map(item => item.category))],
    [menuItems]
  )

  // Group items by category/type
  const groupedItems = useMemo(() => {
    const groups = filteredItems.reduce((groups, item) => {
      const category = item.category
      if (!groups[category]) {
        groups[category] = []
      }
      groups[category].push(item)
      return groups
    }, {} as Record<string, MenuItemData[]>)
    
    // Sort categories in specific order
    const categoryOrder = ['Main Dishes', 'Beverages', 'Desserts', 'Sides', 'Specials']
    const sortedGroups: Record<string, MenuItemData[]> = {}
    
    categoryOrder.forEach(category => {
      if (groups[category]) {
        sortedGroups[category] = groups[category]
      }
    })
    
    // Add any remaining categories not in the order
    Object.keys(groups).forEach(category => {
      if (!sortedGroups[category]) {
        sortedGroups[category] = groups[category]
      }
    })
    
    return sortedGroups
  }, [filteredItems])

  const handleAddToCart = useCallback((itemDetails: CartItem) => {
    addToCart(itemDetails)
    alert(`${itemDetails.name} added to cart!`)
  }, [addToCart])

  return (
    <>
      <div className="menu-page">
      <div className="menu-header">
        <div className="header-content">
          <h1>🍽️ Our Menu</h1>
          <p className="subtitle">Explore our delicious offerings</p>
        </div>
        <div className="menu-actions">
          {(isAuthenticated && !isGuestMode) && (
            <>
              <div className="action-indicator" onClick={handleProfileClick}>
                <span className="action-icon">👤</span>
                <div className="action-info">
                  <span className="action-label">Profile</span>
                  <span className="action-name">{user?.name || 'User'}</span>
                </div>
              </div>
              <div className="action-indicator" onClick={handleOrdersClick}>
                <span className="action-icon">📦</span>
                <div className="action-info">
                  <span className="action-label">My Orders</span>
                  <span className="action-sublabel">View History</span>
                </div>
              </div>
            </>
          )}
          {(isGuestMode && hasGuestSession) && (
            <div className="action-indicator" onClick={handleOrdersClick}>
              <span className="action-icon">📦</span>
              <div className="action-info">
                <span className="action-label">My Orders</span>
                <span className="action-sublabel">Session Orders</span>
              </div>
            </div>
          )}
          <div className="cart-indicator" onClick={handleCartClick}>
            <span className="cart-icon">🛒</span>
            <div className="cart-info">
              <span className="cart-count">{cartItemCount}</span>
              <span className="cart-total">LKR {cartTotal.toFixed(2)}</span>
            </div>
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
            groupByType ? (
              // Grouped by category/type
              <div className="menu-grouped">
                {Object.entries(groupedItems).map(([category, items]) => (
                  <div key={category} className="category-section">
                    <div className="category-header">
                      <h2 className="category-title">{category}</h2>
                      <span className="category-count">{items.length} items</span>
                    </div>
                    <div className="menu-grid">
                      {items.map(item => (
                        <MenuItem
                          key={item.id || item._id}
                          {...item}
                          id={item.id || item._id}
                          onAddToCart={handleAddToCart}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Ungrouped view
              <div className="menu-grid">
                {filteredItems.map(item => (
                  <MenuItem
                    key={item.id || item._id}
                    {...item}
                    id={item.id || item._id}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            )
          ) : (
            <div className="no-items">
              <p>📭 No menu items found</p>
              <p className="no-items-subtitle">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      )}
      </div>
    </>
  )
}

// Demo data for testing
function getDemoMenuItems(): MenuItemData[] {
  return [
    // MAIN DISHES
    {
      id: "burger",
      name: "FireGrill Burger",
      description: "Smoky grilled patty, cheese and fresh veggies.",
      basePrice: 1200,
      image: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg",
      category: "Main Dishes",
      isVegetarian: false,
      customizationGroups: [
        {
          id: "extras",
          name: "Add-ons",
          type: "addons",
          isRequired: false,
          options: [
            { id: "extra-cheese", name: "Extra cheese slice", price: 150 },
            { id: "extra-onions", name: "Extra caramelised onions", price: 80 },
            { id: "extra-patty", name: "Add beef patty", price: 450 }
          ]
        }
      ]
    },
    {
      id: "pizza",
      name: "Molten Lava Pizza",
      description: "Thin crust with triple cheese & roasted veggies.",
      basePrice: 2100,
      image: "https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg",
      category: "Main Dishes",
      isVegetarian: true,
      customizationGroups: [
        {
          id: "extras",
          name: "Add-ons",
          type: "addons",
          isRequired: false,
          options: [
            { id: "extra-mozzarella", name: "Extra mozzarella", price: 220 },
            { id: "extra-tomato", name: "Extra tomato slices", price: 90 },
            { id: "extra-chicken", name: "Grilled chicken", price: 380 }
          ]
        }
      ]
    },
    {
      id: "submarine",
      name: "Smoky Submarine",
      description: "Toasted baguette packed with meats and greens.",
      basePrice: 1500,
      image: "/Submarine.jpeg",
      category: "Main Dishes",
      isVegetarian: false,
      customizationGroups: [
        {
          id: "extras",
          name: "Add-ons",
          type: "addons",
          isRequired: false,
          options: [
            { id: "extra-meat", name: "Double meat", price: 340 },
            { id: "extra-pickles", name: "Pickles", price: 70 }
          ]
        }
      ]
    },
    {
      id: "sandwich",
      name: "Stacked Sandwich",
      description: "Triple layered grilled sandwich.",
      basePrice: 900,
      image: "/Sandwich.jpeg",
      category: "Main Dishes",
      isVegetarian: false,
      customizationGroups: [
        {
          id: "extras",
          name: "Add-ons",
          type: "addons",
          isRequired: false,
          options: [
            { id: "extra-cheese-sandwich", name: "Cheese layer", price: 120 },
            { id: "extra-veggies", name: "Crunchy veggies", price: 100 }
          ]
        }
      ]
    },
    {
      id: "pasta",
      name: "Blaze Pasta",
      description: "Creamy pasta with a touch of chilli.",
      basePrice: 1300,
      image: "https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg",
      category: "Main Dishes",
      isVegetarian: true,
      customizationGroups: [
        {
          id: "extras",
          name: "Add-ons",
          type: "addons",
          isRequired: false,
          options: [
            { id: "extra-cheese-pasta", name: "Parmesan", price: 160 },
            { id: "extra-mushroom", name: "Sautéed mushrooms", price: 210 }
          ]
        }
      ]
    },
    {
      id: "rice",
      name: "Signature Rice Bowl",
      description: "Steamed rice with seasonal veggies and your choice of protein.",
      basePrice: 1100,
      image: "/Rice.jpeg",
      category: "Main Dishes",
      isVegetarian: false,
      customizationGroups: [
        {
          id: "extras",
          name: "Add-ons",
          type: "addons",
          isRequired: false,
          options: [
            { id: "extra-egg", name: "Fried egg", price: 120 },
            { id: "extra-chicken-rice", name: "Grilled chicken", price: 350 },
            { id: "extra-spice", name: "Extra spicy", price: 40 }
          ]
        }
      ]
    },

    // BEVERAGES
    {
      id: "milkshake",
      name: "Thick Milkshake",
      description: "Creamy milkshake topped with whipped cream.",
      basePrice: 800,
      image: "/Milkshake.jpeg",
      category: "Beverages",
      isVegetarian: true,
      customizationGroups: [
        {
          id: "size",
          name: "Size",
          type: "single_select",
          isRequired: true,
          options: [
            { id: "s", name: "Small", price: 0 },
            { id: "m", name: "Medium", price: 240 },
            { id: "l", name: "Large", price: 480 }
          ]
        },
        {
          id: "extras",
          name: "Add-ons",
          type: "addons",
          isRequired: false,
          options: [
            { id: "extra-cream", name: "Extra whipped cream", price: 80 },
            { id: "choco-syrup", name: "Chocolate syrup", price: 100 }
          ]
        }
      ]
    },
    {
      id: "soft-drink",
      name: "Soft Drink",
      description: "Chilled carbonated drink.",
      basePrice: 400,
      image: "/SoftDrinks.jpeg",
      category: "Beverages",
      isVegetarian: true,
      customizationGroups: [
        {
          id: "size",
          name: "Size",
          type: "single_select",
          isRequired: true,
          options: [
            { id: "can", name: "Can", price: 0 },
            { id: "bottle", name: "Bottle", price: 200 }
          ]
        }
      ]
    },
    {
      id: "fruit-drink",
      name: "Fresh Fruit Drink",
      description: "Seasonal fruit juice with pulp.",
      basePrice: 700,
      image: "https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg",
      category: "Beverages",
      isVegetarian: true,
      customizationGroups: [
        {
          id: "size",
          name: "Size",
          type: "single_select",
          isRequired: true,
          options: [
            { id: "regular", name: "Regular", price: 0 },
            { id: "large", name: "Large", price: 350 }
          ]
        },
        {
          id: "extras",
          name: "Options",
          type: "addons",
          isRequired: false,
          options: [
            { id: "extra-pulp", name: "Extra pulp", price: 70 }
          ]
        }
      ]
    },
    {
      id: "coffee",
      name: "Roasted Coffee",
      description: "Freshly ground coffee shot.",
      basePrice: 500,
      image: "/coffee.jpeg",
      category: "Beverages",
      isVegetarian: true,
      customizationGroups: [
        {
          id: "size",
          name: "Size",
          type: "single_select",
          isRequired: true,
          options: [
            { id: "single", name: "Single shot", price: 0 },
            { id: "double", name: "Double shot", price: 250 }
          ]
        },
        {
          id: "extras",
          name: "Add-ons",
          type: "addons",
          isRequired: false,
          options: [
            { id: "extra-shot", name: "Extra espresso shot", price: 120 },
            { id: "oat-milk", name: "Oat milk", price: 150 }
          ]
        }
      ]
    },
    {
      id: "tea",
      name: "Ceylon Tea",
      description: "Brewed Sri Lankan tea.",
      basePrice: 350,
      image: "https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg",
      category: "Beverages",
      isVegetarian: true,
      customizationGroups: [
        {
          id: "size",
          name: "Size",
          type: "single_select",
          isRequired: true,
          options: [
            { id: "cup", name: "Cup", price: 0 },
            { id: "pot", name: "Tea pot", price: 350 }
          ]
        },
        {
          id: "extras",
          name: "Add-ons",
          type: "addons",
          isRequired: false,
          options: [
            { id: "extra-milk", name: "Extra milk", price: 60 }
          ]
        }
      ]
    },

    // DESSERTS
    {
      id: "cake",
      name: "Chocolate Cake",
      description: "Moist chocolate sponge with rich ganache.",
      basePrice: 650,
      image: "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg",
      category: "Desserts",
      isVegetarian: true,
      customizationGroups: [
        {
          id: "extras",
          name: "Add-ons",
          type: "addons",
          isRequired: false,
          options: [
            { id: "extra-choco", name: "Extra chocolate drizzle", price: 80 },
            { id: "add-scoop-vanilla", name: "Vanilla ice cream scoop", price: 150 }
          ]
        }
      ]
    },
    {
      id: "ice-cream",
      name: "Ice Cream",
      description: "Two scoops of your favourite flavour.",
      basePrice: 450,
      image: "https://images.pexels.com/photos/1352278/pexels-photo-1352278.jpeg",
      category: "Desserts",
      isVegetarian: true,
      customizationGroups: [
        {
          id: "extras",
          name: "Add-ons",
          type: "addons",
          isRequired: false,
          options: [
            { id: "extra-scoop", name: "Extra scoop", price: 150 },
            { id: "sprinkles", name: "Rainbow sprinkles", price: 70 }
          ]
        }
      ]
    },
    {
      id: "fruit-salad",
      name: "Fruit Salad",
      description: "Seasonal fruits with a light citrus dressing.",
      basePrice: 500,
      image: "https://images.pexels.com/photos/1105166/pexels-photo-1105166.jpeg",
      category: "Desserts",
      isVegetarian: true,
      customizationGroups: [
        {
          id: "extras",
          name: "Add-ons",
          type: "addons",
          isRequired: false,
          options: [
            { id: "add-honey", name: "Honey drizzle", price: 60 },
            { id: "add-yoghurt", name: "Greek yoghurt", price: 120 }
          ]
        }
      ]
    },
    {
      id: "cookies",
      name: "Warm Cookies",
      description: "Freshly baked chocolate chip cookies.",
      basePrice: 380,
      image: "https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg",
      category: "Desserts",
      isVegetarian: true,
      customizationGroups: [
        {
          id: "extras",
          name: "Add-ons",
          type: "addons",
          isRequired: false,
          options: [
            { id: "extra-cookie", name: "Extra cookie", price: 90 },
            { id: "cookie-icecream", name: "Serve with ice cream", price: 180 }
          ]
        }
      ]
    },
    {
      id: "donut",
      name: "Glazed Donut",
      description: "Soft ring donut with vanilla glaze.",
      basePrice: 350,
      image: "/Donut.jpeg",
      category: "Desserts",
      isVegetarian: true,
      customizationGroups: [
        {
          id: "extras",
          name: "Add-ons",
          type: "addons",
          isRequired: false,
          options: [
            { id: "extra-glaze", name: "Extra glaze", price: 50 },
            { id: "choco-dip", name: "Chocolate dip", price: 90 }
          ]
        }
      ]
    },
    {
      id: "pudding",
      name: "Caramel Pudding",
      description: "Silky baked pudding with caramel topping.",
      basePrice: 520,
      image: "/Pudding.jpeg",
      category: "Desserts",
      isVegetarian: true,
      customizationGroups: [
        {
          id: "extras",
          name: "Add-ons",
          type: "addons",
          isRequired: false,
          options: [
            { id: "extra-caramel", name: "Extra caramel", price: 70 },
            { id: "add-nuts", name: "Toasted nuts", price: 90 }
          ]
        }
      ]
    },
    {
      id: "jelly",
      name: "Fruity Jelly",
      description: "Colourful jelly with fruit pieces.",
      basePrice: 300,
      image: "/Jelly.jpeg",
      category: "Desserts",
      isVegetarian: true,
      customizationGroups: [
        {
          id: "extras",
          name: "Add-ons",
          type: "addons",
          isRequired: false,
          options: [
            { id: "add-cream", name: "Fresh cream", price: 80 },
            { id: "add-custard", name: "Vanilla custard", price: 120 }
          ]
        }
      ]
    }
  ]
}

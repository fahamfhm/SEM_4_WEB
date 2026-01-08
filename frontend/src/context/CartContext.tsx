import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'

export interface CartItem {
  id: string
  menuItemId: string
  name: string
  basePrice: number
  quantity: number
  customizations: {
    groupName: string
    selectedOptions: Array<{ id: string; name: string; price: number }>
  }[]
  itemTotal: number
  removals?: string[]
  specialNote?: string
}

interface CartContextType {
  items: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  cartTotal: number
  cartItemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'restaurant_cart'

export function CartProvider({ children }: { children: ReactNode }) {
  // Load cart from localStorage on mount
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY)
      return savedCart ? JSON.parse(savedCart) : []
    } catch (error) {
      console.error('Error loading cart from localStorage:', error)
      return []
    }
  })

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    } catch (error) {
      console.error('Error saving cart to localStorage:', error)
    }
  }, [items])

  const addToCart = (item: CartItem) => {
    setItems([...items, item])
  }

  const removeFromCart = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId))
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
    } else {
      setItems(
        items.map(item =>
          item.id === itemId ? { ...item, quantity } : item
        )
      )
    }
  }

  const clearCart = () => {
    setItems([])
    localStorage.removeItem(CART_STORAGE_KEY)
  }

  const cartTotal = items.reduce((total, item) => total + item.itemTotal, 0)
  const cartItemCount = items.length

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartItemCount }}>
      {children}
    </CartContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}

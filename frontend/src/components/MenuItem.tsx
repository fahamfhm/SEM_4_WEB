import { useState, memo } from 'react'
import type { CartItem } from '../context/CartContext'
import '../styles/MenuItem.css'

interface CustomizationGroup {
  id: string
  name: string
  type: 'addons' | 'single_select'
  isRequired: boolean
  options: Array<{ id: string; name: string; price: number }>
}

interface MenuItemProps {
  id: string
  name: string
  description: string
  basePrice: number
  image: string
  category: string
  isVegetarian: boolean
  customizationGroups: CustomizationGroup[]
  onAddToCart: (itemDetails: CartItem) => void
}

const MenuItem = ({
  id,
  name,
  description,
  basePrice,
  image,
  isVegetarian,
  customizationGroups,
  onAddToCart,
}: MenuItemProps) => {
  const [showModal, setShowModal] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [customizations, setCustomizations] = useState<Record<string, string[]>>({})

  const handleCustomizationChange = (groupId: string, optionId: string, isMultiple: boolean) => {
    setCustomizations(prev => {
      if (isMultiple) {
        const current = prev[groupId] || []
        if (current.includes(optionId)) {
          return { ...prev, [groupId]: current.filter(id => id !== optionId) }
        } else {
          return { ...prev, [groupId]: [...current, optionId] }
        }
      } else {
        return { ...prev, [groupId]: [optionId] }
      }
    })
  }

  const calculateCustomizationPrice = () => {
    let total = 0
    Object.entries(customizations).forEach(([groupId, optionIds]) => {
      const group = customizationGroups.find(g => g.id === groupId)
      if (group) {
        optionIds.forEach(optionId => {
          const option = group.options.find(o => o.id === optionId)
          if (option) total += option.price
        })
      }
    })
    return total
  }

  const handleAddToCart = () => {
    const customizationDetails = customizationGroups
      .filter(group => customizations[group.id]?.length > 0)
      .map(group => ({
        groupName: group.name,
        selectedOptions: customizations[group.id]
          .map(optionId => {
            const option = group.options.find(o => o.id === optionId)
            return { id: optionId, name: option?.name || '', price: option?.price || 0 }
          })
      }))

    const itemTotal = (basePrice + calculateCustomizationPrice()) * quantity

    onAddToCart({
      id: `${id}-${Date.now()}`,
      menuItemId: id,
      name,
      basePrice,
      quantity,
      customizations: customizationDetails,
      itemTotal
    })

    setShowModal(false)
    setQuantity(1)
    setCustomizations({})
  }

  const itemPrice = basePrice + calculateCustomizationPrice()

  return (
    <>
      <div className="menu-item-card">
        <div className="menu-item-image-container">
          <img 
            src={image} 
            alt={name} 
            className="menu-item-image" 
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/300x200?text=' + encodeURIComponent(name)
            }} 
          />
          {isVegetarian && <span className="veg-badge">🌱</span>}
        </div>
        <div className="menu-item-content">
          <h3 className="menu-item-name">{name}</h3>
          <p className="menu-item-description">{description}</p>
          <div className="menu-item-footer">
            <span className="menu-item-price">LKR {basePrice.toFixed(2)}</span>
            <button className="add-btn" onClick={() => setShowModal(true)}>
              + Add
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{name}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="item-details">
                <img 
                  src={image} 
                  alt={name} 
                  className="modal-image" 
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/500x300?text=' + encodeURIComponent(name)
                  }} 
                />
                <p>{description}</p>
              </div>

              {customizationGroups.length > 0 && (
                <div className="customization-section">
                  <h3>Customize</h3>
                  {customizationGroups.map(group => (
                    <div key={group.id} className="customization-group">
                      <label className="group-label">
                        {group.name}
                        {group.isRequired && <span className="required">*</span>}
                      </label>
                      <div className="options">
                        {group.options.map(option => (
                          <label key={option.id} className="option-label">
                            <input
                              type={group.type === 'addons' ? 'checkbox' : 'radio'}
                              name={group.id}
                              value={option.id}
                              checked={(customizations[group.id] || []).includes(option.id)}
                              onChange={() => handleCustomizationChange(group.id, option.id, group.type === 'addons')}
                            />
                            <span>
                              {option.name}
                              {option.price > 0 && ` (+LKR ${option.price})`}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="quantity-section">
                <label>Quantity:</label>
                <div className="quantity-input">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                  <input
                    type="number"
                    value={quantity}
                    readOnly
                    aria-label="Quantity"
                    title="Quantity"
                  />
                  <button onClick={() => setQuantity(quantity + 1)}>+</button>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <div className="price-summary">
                <span>Subtotal:</span>
                <span className="total-price">LKR {(itemPrice * quantity).toFixed(2)}</span>
              </div>
              <button className="add-to-cart-btn" onClick={handleAddToCart}>
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
export default memo(MenuItem)
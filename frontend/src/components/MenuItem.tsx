import { useState, memo } from "react";
import type { CartItem } from "../context/CartContext";
import "../styles/MenuItem.css";

interface CustomizationGroup {
  id: string;
  name: string;
  type: "addons" | "single_select";
  isRequired: boolean;
  options: Array<{ id: string; name: string; price: number }>;
}

interface MenuItemProps {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  image: string;
  category: string;
  isVegetarian: boolean;
  customizationGroups: CustomizationGroup[];
  onAddToCart: (itemDetails: CartItem) => void;
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
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [customizations, setCustomizations] = useState<
    Record<string, string[]>
  >({});
  const [removals, setRemovals] = useState<string[]>([]);
  const [specialNote, setSpecialNote] = useState("");

  const handleCustomizationChange = (
    groupId: string,
    optionId: string,
    isMultiple: boolean
  ) => {
    setCustomizations((prev) => {
      if (isMultiple) {
        const current = prev[groupId] || [];
        if (current.includes(optionId)) {
          return {
            ...prev,
            [groupId]: current.filter((id) => id !== optionId),
          };
        } else {
          return { ...prev, [groupId]: [...current, optionId] };
        }
      } else {
        return { ...prev, [groupId]: [optionId] };
      }
    });
  };

  const toggleRemoval = (ingredient: string) => {
    setRemovals((prev) =>
      prev.includes(ingredient)
        ? prev.filter((item) => item !== ingredient)
        : [...prev, ingredient]
    );
  };

  const calculateCustomizationPrice = () => {
    let total = 0;
    Object.entries(customizations).forEach(([groupId, optionIds]) => {
      const group = customizationGroups.find((g) => g.id === groupId);
      if (group) {
        optionIds.forEach((optionId) => {
          const option = group.options.find((o) => o.id === optionId);
          if (option) total += option.price;
        });
      }
    });
    return total;
  };

  const handleAddToCart = () => {
    const customizationDetails = customizationGroups
      .filter((group) => customizations[group.id]?.length > 0)
      .map((group) => ({
        groupName: group.name,
        selectedOptions: customizations[group.id].map((optionId) => {
          const option = group.options.find((o) => o.id === optionId);
          return {
            id: optionId,
            name: option?.name || "",
            price: option?.price || 0,
          };
        }),
      }));

    const itemTotal = (basePrice + calculateCustomizationPrice()) * quantity;

    onAddToCart({
      id: `${id}-${Date.now()}`,
      menuItemId: id,
      name,
      basePrice,
      quantity,
      customizations: customizationDetails,
      itemTotal,
      removals,
      specialNote,
    });

    setShowModal(false);
    setQuantity(1);
    setCustomizations({});
    setRemovals([]);
    setSpecialNote("");
  };

  const itemPrice = basePrice + calculateCustomizationPrice();

  return (
    <>
      <div className="men-itm-card">
        <div className="men-itm-image-container">
          <img
            src={image}
            alt={name}
            className="men-itm-image"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src =
                "https://placehold.co/300x200/png?text=" +
                encodeURIComponent(name);
            }}
          />
          {isVegetarian && <span className="men-itm-veg-badge">🌱</span>}
        </div>
        <div className="men-itm-content">
          <h3 className="men-itm-name">{name}</h3>
          <p className="men-itm-description">{description}</p>
          <div className="men-itm-footer">
            <span className="men-itm-price">LKR {basePrice.toFixed(2)}</span>
            <button
              className="men-itm-add-btn"
              onClick={() => setShowModal(true)}
            >
              + Add
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div
          className="men-itm-modal-overlay"
          onClick={() => setShowModal(false)}
        >
          <div
            className="men-itm-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="men-itm-modal-header">
              <h2>{name}</h2>
              <button
                className="men-itm-close-btn"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="men-itm-modal-body">
              <div className="men-itm-item-details">
                <img
                  src={image}
                  alt={name}
                  className="men-itm-modal-image"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://placehold.co/500x300/png?text=" +
                      encodeURIComponent(name);
                  }}
                />
                <p>{description}</p>
              </div>

              {customizationGroups.length > 0 && (
                <div className="men-itm-customization-section">
                  <h3>🛠️ Customize Your Item</h3>
                  {customizationGroups.map((group) => (
                    <div key={group.id} className="men-itm-customization-group">
                      <label className="men-itm-group-label">
                        {group.name}
                        {group.isRequired && (
                          <span className="men-itm-required">*</span>
                        )}
                      </label>
                      <div className="men-itm-options">
                        {group.options.map((option) => (
                          <label
                            key={option.id}
                            className="men-itm-option-label"
                          >
                            <input
                              type={
                                group.type === "addons" ? "checkbox" : "radio"
                              }
                              name={group.id}
                              value={option.id}
                              checked={(
                                customizations[group.id] || []
                              ).includes(option.id)}
                              onChange={() =>
                                handleCustomizationChange(
                                  group.id,
                                  option.id,
                                  group.type === "addons"
                                )
                              }
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

                  {/* Remove Items Section */}
                  <div className="men-itm-removal-section">
                    <h3>🚫 Remove Ingredients</h3>
                    <p className="men-itm-removal-note">
                      No price change for removals
                    </p>
                    <div className="men-itm-removal-options">
                      {[
                        "Onions",
                        "Tomatoes",
                        "Lettuce",
                        "Pickles",
                        "Cheese",
                      ].map((ingredient) => (
                        <label
                          key={ingredient}
                          className="men-itm-removal-label"
                        >
                          <input
                            type="checkbox"
                            checked={removals.includes(ingredient)}
                            onChange={() => toggleRemoval(ingredient)}
                          />
                          <span>{ingredient}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Special Note Section */}
                  <div className="men-itm-note-section">
                    <h3>📝 Special Instructions</h3>
                    <div className="men-itm-note-input-wrapper">
                      <textarea
                        placeholder="Any special requests? (e.g., extra spicy, well done, no mayo)"
                        value={specialNote}
                        onChange={(e) => setSpecialNote(e.target.value)}
                        className="men-itm-special-note-input"
                        rows={3}
                        maxLength={200}
                      />
                      <div
                        className={`men-itm-char-count ${
                          specialNote.length > 180
                            ? "men-itm-danger"
                            : specialNote.length > 150
                            ? "men-itm-warning"
                            : ""
                        }`}
                      >
                        {specialNote.length}/200
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="men-itm-quantity-section">
                <label>Quantity:</label>
                <div className="men-itm-quantity-input">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    −
                  </button>
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

            <div className="men-itm-modal-footer">
              <div className="men-itm-price-summary">
                <span>Subtotal:</span>
                <span className="men-itm-total-price">
                  LKR {(itemPrice * quantity).toFixed(2)}
                </span>
              </div>
              <button
                className="men-itm-add-to-cart-btn"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default memo(MenuItem);

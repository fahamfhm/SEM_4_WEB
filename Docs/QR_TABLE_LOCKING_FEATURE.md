# QR Code Table Locking & Takeaway Feature

## Overview

This feature implements intelligent QR code scanning that automatically:
1. **Locks tables** when customers scan table QR codes and place orders
2. **Sets orders to takeaway** when customers scan cashier/counter QR codes
3. **Persists order context** throughout the customer journey

## Key Features

### ✨ Smart QR Detection

- **Table QR Codes**: `/?table=5` → Locks table 5 for the order
- **Takeaway QR Codes**: `/?type=takeaway` → Sets order to takeaway
- **Default Behavior**: No QR → Defaults to takeaway

### 🔒 Table Locking

When a customer scans a table QR code and completes checkout:
- Table number is automatically captured
- Table is locked and displayed prominently
- Order type is set to "dine-in"
- Lock persists in localStorage
- Clear visual indicator at checkout

### 🛍️ Takeaway Orders

When a customer scans a takeaway QR code:
- Order type is set to "takeaway"
- No table number required
- Optimized for counter/cashier pickup

## Implementation Details

### Frontend Changes

#### 1. TableContext Enhancement
**File**: `frontend/src/context/TableContext.tsx`

Added:
- `isTableLocked` state to track table locking status
- `lockTable()` function to lock tables when order is placed
- localStorage persistence for table lock status

```typescript
interface TableContextType {
  tableNumber: string | null;
  diningType: 'table' | 'takeaway' | null;
  isTableLocked: boolean;
  setTableInfo: (tableNumber: string | null, diningType: 'table' | 'takeaway') => void;
  lockTable: () => void;
  clearTableInfo: () => void;
}
```

#### 2. Home Page QR Detection
**File**: `frontend/src/pages/Home.tsx`

Enhanced QR parameter detection:
- Detects `?table=X` parameter for table orders
- Detects `?type=takeaway` parameter for takeaway orders
- Automatically sets context based on QR scan
- Cleans up URL after parameter extraction

#### 3. Checkout Page Integration
**File**: `frontend/src/pages/customer/Checkout.tsx`

Added:
- Integration with TableContext
- Automatic table locking on order placement
- Visual locked table indicator
- Pre-filled form based on QR scan
- Disabled order type selection when table is locked

Key Changes:
```typescript
// Lock table when order is placed
if (formData.orderType === 'dine-in' && tableNumber && diningType === 'table') {
  lockTable();
}
```

#### 4. Checkout Styles
**File**: `frontend/src/styles/Checkout.css`

Added styles for:
- Locked table info badge with green gradient
- Lock icon and table number display
- Smooth animations for locked state
- Visual confirmation of table reservation

### Backend Changes

#### Order Model Enhancement
**File**: `backend/src/models/Order.js`

Added fields:
```javascript
isTableLocked: {
  type: Boolean,
  default: false
},
tableLockedAt: {
  type: Date,
  required: false
}
```

## Usage Guide

### For Restaurant Owners

#### 1. Generate Table QR Codes

Create QR codes for each table using the format:
```
https://yourdomain.com/?table=1
https://yourdomain.com/?table=2
https://yourdomain.com/?table=3
```

Print and place on each table.

#### 2. Generate Takeaway QR Code

Create a single takeaway QR code:
```
https://yourdomain.com/?type=takeaway
```

Place at:
- Cashier counter
- Entrance
- Pickup area

### For Customers

#### Table Order Flow:
1. Scan table QR code
2. See table badge (e.g., "🪑 Table 5")
3. Browse menu and add items
4. Go to checkout
5. See locked table indicator
6. Complete payment
7. Table is locked for your order

#### Takeaway Order Flow:
1. Scan takeaway QR code at counter
2. Browse menu and add items
3. Go to checkout
4. Takeaway is pre-selected
5. Complete payment
6. Get order number for pickup

## Benefits

### For Customers
- ✅ Faster checkout (pre-filled information)
- ✅ No manual table entry needed
- ✅ Clear visual confirmation
- ✅ Seamless ordering experience

### For Restaurant
- ✅ Accurate table tracking
- ✅ Prevents table conflicts
- ✅ Better order management
- ✅ Separated analytics (dine-in vs takeaway)
- ✅ Reduced errors in order delivery

### For Kitchen/Staff
- ✅ Know exact table locations
- ✅ Clear order type identification
- ✅ Improved order accuracy
- ✅ Better workflow management

## Technical Architecture

```
┌─────────────────┐
│  Customer Scans │
│   Table QR      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Home Page       │
│ - Detects param │
│ - Sets context  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ TableContext    │
│ - Stores info   │
│ - Persists data │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Menu Browsing   │
│ (Table badge    │
│  displayed)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Checkout        │
│ - Pre-filled    │
│ - Locked table  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Place Order     │
│ - Lock table    │
│ - Create order  │
└─────────────────┘
```

## Testing

### Test Scenarios

1. **Table Order**:
   ```
   http://localhost:5173/?table=5
   ```
   Expected: Table 5 locked at checkout

2. **Takeaway Order**:
   ```
   http://localhost:5173/?type=takeaway
   ```
   Expected: Takeaway pre-selected

3. **Manual Entry**:
   ```
   http://localhost:5173/
   ```
   Expected: Can manually choose dine-in/takeaway

## Future Enhancements

- [ ] Real-time table availability check
- [ ] Multiple orders per table support
- [ ] Table unlock after order completion
- [ ] QR code analytics dashboard
- [ ] Dynamic QR code generation in admin panel
- [ ] Table occupancy tracking
- [ ] Estimated wait time display

## Files Modified

### Frontend
- `frontend/src/context/TableContext.tsx`
- `frontend/src/pages/Home.tsx`
- `frontend/src/pages/customer/Checkout.tsx`
- `frontend/src/styles/Checkout.css`

### Backend
- `backend/src/models/Order.js`

### Documentation
- `Docs/QR_CODE_GUIDE.md`
- `Docs/QR_TABLE_LOCKING_FEATURE.md` (new)

## Support

For questions or issues:
1. Check the QR_CODE_GUIDE.md for setup instructions
2. Review this document for feature details
3. Test with provided URLs before production deployment

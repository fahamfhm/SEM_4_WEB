# QR Code Generator for Restaurant Tables & Takeaway

## Overview

The system now supports two types of QR codes:
1. **Table QR Codes** - For dine-in customers at tables (locks table for order)
2. **Takeaway/Cashier QR Codes** - For takeaway orders at counter/cashier

## How to Use

### 1. Generate QR Codes for Tables (Dine-In)

**For Table QR Codes:**
```
http://localhost:5173/?table=1
http://localhost:5173/?table=2
http://localhost:5173/?table=3
... and so on
```

**For Production:**
```
https://yourdomain.com/?table=1
https://yourdomain.com/?table=2
```

### 2. Generate QR Codes for Takeaway/Cashier

**For Takeaway QR Code (at counter/cashier):**
```
http://localhost:5173/?type=takeaway
```

**For Production:**
```
https://yourdomain.com/?type=takeaway
```

### 3. Online QR Code Generators

Use these free online tools:
- [QR Code Generator](https://www.qr-code-generator.com/)
- [QR Code Monkey](https://www.qrcode-monkey.com/)
- [GoQR.me](https://goqr.me/)

### 4. Generate Programmatically (Node.js)

Install the qrcode package:
```bash
npm install qrcode
```

Create a script `generate-qr-codes.js`:
```javascript
const QRCode = require('qrcode');
const fs = require('fs');

const baseUrl = 'http://localhost:5173';
const numberOfTables = 20;

async function generateQRCodes() {
  // Generate table QR codes
  for (let i = 1; i <= numberOfTables; i++) {
    const url = `${baseUrl}/?table=${i}`;
    const fileName = `table-${i}-qr.png`;
    
    try {
      await QRCode.toFile(fileName, url, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      console.log(`✓ Generated QR code for Table ${i}`);
    } catch (err) {
      console.error(`✗ Error generating QR code for Table ${i}:`, err);
    }
  }
  
  // Generate takeaway QR code
  const takeawayUrl = `${baseUrl}/?type=takeaway`;
  try {
    await QRCode.toFile('takeaway-qr.png', takeawayUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    console.log('✓ Generated Takeaway QR code');
  } catch (err) {
    console.error('✗ Error generating Takeaway QR code:', err);
  }
  
  console.log('\n✓ All QR codes generated successfully!');
}

generateQRCodes();
```

Run the script:
```bash
node generate-qr-codes.js
```

### 5. How It Works

#### Table Orders (Dine-In)
1. **Customer scans table QR code** → Opens URL like `/?table=5`
2. **System detects** table parameter and stores it
3. **Table badge displays** showing the table number
4. **Customer browses menu** and adds items to cart
5. **At checkout** → Table number is pre-filled and locked
6. **Table is locked** when order is placed
7. **Info persists** throughout the session

#### Takeaway Orders
1. **Customer scans takeaway QR** at cashier → Opens URL like `/?type=takeaway`
2. **System sets** order type to takeaway automatically
3. **Customer browses menu** and adds items to cart
4. **At checkout** → Order type is set to "Takeaway"
5. **No table required** for the order

### 6. Testing

**Test with Table QR:**
```
http://localhost:5173/?table=5
```
- Expected: Table 5 badge appears on home page
- At checkout: Table 5 is locked and pre-filled

**Test with Takeaway QR:**
```
http://localhost:5173/?type=takeaway
```
- Expected: Order defaults to takeaway
- At checkout: Takeaway option is pre-selected

**Test without QR (Manual):**
```
http://localhost:5173/
```
- Expected: Defaults to takeaway
- Can manually select dine-in and enter table number

### 7. Features

✅ Automatic table detection from QR code URL  
✅ Automatic takeaway detection from QR code URL  
✅ Table locking when order is placed  
✅ Persistent table/order type info (stored in localStorage)  
✅ Visual badge showing table number  
✅ Pre-filled checkout forms based on QR scan  
✅ Locked table display at checkout (cannot change)  
✅ Fallback to takeaway when no QR is scanned

### 8. QR Code Placement Recommendations

**Table QR Codes:**
- Print and laminate each table's QR code
- Place on table stand or attach to table
- Include table number on physical QR code label
- Example label: "Table 5 - Scan to Order"

**Takeaway QR Code:**
- Place at cashier counter
- Display on counter stand
- Include at entrance for quick orders
- Example label: "Takeaway Orders - Scan Here"

### 9. User Flow Examples

**Scenario 1: Customer at Table 5**
1. Scans table QR → `/?table=5`
2. Sees "🪑 Table 5" badge
3. Browses menu, adds items
4. Goes to checkout
5. Sees "🔒 Table 5 - Locked for your order"
6. Completes payment
7. Table remains locked until order complete

**Scenario 2: Customer at Cashier**
1. Scans takeaway QR → `/?type=takeaway`
2. No table badge shown
3. Browses menu, adds items
4. Goes to checkout
5. Sees "🛍️ Takeaway" pre-selected
6. Completes payment
7. Receives order number for pickup

### 10. Admin Benefits

- 📊 Track which tables are ordering
- 🔒 Prevent table conflicts
- 📍 Know exact table location for orders
- 🎯 Separate dine-in vs takeaway analytics
- ⚡ Faster checkout process  
✅ Clean URL after detection (removes query parameter)  

### 7. Next Steps

You can now:
- Use table info in cart/checkout to associate orders with tables
- Display table number in the navigation bar
- Send table info to backend with orders
- Track which orders belong to which table

Example - Using table info in your components:
```typescript
import { useTable } from '../context/TableContext';

function MyComponent() {
  const { tableNumber, diningType } = useTable();
  
  // Use in your order submission
  const placeOrder = () => {
    fetch('/api/orders', {
      method: 'POST',
      body: JSON.stringify({
        items: cartItems,
        tableNumber: tableNumber,
        diningType: diningType
      })
    });
  };
}
```

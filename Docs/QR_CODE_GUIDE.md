# QR Code Generator for Restaurant Tables

## How to Use

### 1. Generate QR Codes for Tables

You can use any QR code generator (online or library) to create QR codes with the following URL format:

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

### 2. Online QR Code Generators

Use these free online tools:
- [QR Code Generator](https://www.qr-code-generator.com/)
- [QR Code Monkey](https://www.qrcode-monkey.com/)
- [GoQR.me](https://goqr.me/)

### 3. Generate Programmatically (Node.js)

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
  console.log('\n✓ All QR codes generated successfully!');
}

generateQRCodes();
```

Run the script:
```bash
node generate-qr-codes.js
```

### 4. How It Works

1. **Customer scans QR code** → Opens URL like `/?table=5`
2. **Home page detects** the `table` parameter
3. **Table info is stored** in context and localStorage
4. **Table badge displays** on the home page
5. **Info persists** throughout the customer's session

### 5. Testing

**Test with Table QR:**
```
http://localhost:5173/?table=5
```

**Test without QR (Dine-In):**
```
http://localhost:5173/
```

### 6. Features

✅ Automatic table detection from QR code URL  
✅ Persistent table info (stored in localStorage)  
✅ Visual badge showing table number  
✅ Fallback to "Dine-In" when no table is specified  
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

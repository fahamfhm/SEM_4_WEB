# Contributing Guide

## 🎯 Development Workflow

### 1. Branch Naming Convention

```
feature/<feature-name>      # New features
bugfix/<bug-name>           # Bug fixes
docs/<documentation-name>   # Documentation
refactor/<component-name>   # Code refactoring
test/<test-name>            # Tests
```

**Example:**
```bash
git checkout -b feature/add-order-tracking
git checkout -b bugfix/fix-customization-price-calculation
```

---

### 2. Commit Message Format

Follow conventional commits:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Code style (no logic change)
- `refactor` - Code refactoring
- `test` - Tests
- `chore` - Dependencies, config

**Example:**
```
feat(orders): add real-time order status tracking

- Implement WebSocket listener for order updates
- Add status history to order details page
- Update UI with live notifications

Closes #123
```

---

### 3. Pull Request Process

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature
   ```

2. **Make Changes**
   - Write clean, commented code
   - Follow project style guide
   - Add/update tests

3. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: description of changes"
   ```

4. **Push to GitHub**
   ```bash
   git push origin feature/your-feature
   ```

5. **Create Pull Request**
   - Provide clear description
   - Link related issues
   - Request review from team

6. **Address Review Comments**
   - Make requested changes
   - Push updates
   - Re-request review

7. **Merge PR**
   - Ensure all checks pass
   - Squash commits if needed
   - Delete feature branch

---

## 📝 Code Style Guide

### TypeScript/JavaScript

```typescript
// Use const by default, let if needed, never var
const userName = 'John';
let orderCount = 0;

// Use arrow functions
const calculateTotal = (items: MenuItem[]) => {
  return items.reduce((sum, item) => sum + item.price, 0);
};

// Use async/await
const fetchOrders = async (userId: string) => {
  try {
    const response = await api.get(`/orders?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    throw error;
  }
};

// Use interfaces for types
interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
}

// Add JSDoc comments for functions
/**
 * Calculate order total with tax
 * @param subtotal - Subtotal amount
 * @param taxRate - Tax percentage (0-100)
 * @returns Total amount including tax
 */
const calculateWithTax = (subtotal: number, taxRate: number): number => {
  return subtotal * (1 + taxRate / 100);
};
```

### React Components

```typescript
// Use functional components with hooks
interface OrderCardProps {
  orderId: string;
  status: string;
  total: number;
}

const OrderCard: React.FC<OrderCardProps> = ({ orderId, status, total }) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch order details
  }, [orderId]);

  return (
    <div className="order-card">
      <h3>Order #{orderId}</h3>
      <p>Status: {status}</p>
      <p>Total: LKR {total}</p>
    </div>
  );
};

export default OrderCard;
```

### CSS/Tailwind

```css
/* Use Tailwind classes */
<div className="p-4 bg-white rounded-lg shadow-md">
  <h2 className="text-2xl font-bold text-gray-800">Title</h2>
  <p className="mt-2 text-gray-600">Description</p>
</div>

/* Use CSS modules for component-specific styles */
/* OrderCard.module.css */
.card {
  @apply p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow;
}
```

---

## ✅ Testing Requirements

### Unit Tests

```typescript
// Use Jest for testing
describe('OrderService', () => {
  it('should calculate order total correctly', () => {
    const items = [
      { price: 450, quantity: 2 },
      { price: 200, quantity: 1 }
    ];
    const total = OrderService.calculateTotal(items);
    expect(total).toBe(1100);
  });

  it('should apply customization price', () => {
    const basePrice = 450;
    const customizationPrice = 100;
    const total = OrderService.addCustomizations(basePrice, customizationPrice);
    expect(total).toBe(550);
  });
});
```

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# With coverage
npm test -- --coverage
```

---

## 🐛 Bug Reporting

When reporting bugs, include:

1. **Description:** Clear summary of the issue
2. **Steps to Reproduce:** Exact steps to trigger bug
3. **Expected Behavior:** What should happen
4. **Actual Behavior:** What actually happens
5. **Screenshots/Videos:** Visual proof
6. **Environment:** OS, Node version, browser, etc.

**Example:**
```markdown
# Bug Report: Order total calculation error

## Description
When adding multiple customizations to a burger, the total price is calculated incorrectly.

## Steps to Reproduce
1. Go to menu and select "Classic Burger"
2. Add "Extra Cheese" (+50 LKR)
3. Add "Bacon" (+80 LKR)
4. Total shows 550 instead of 580

## Expected
Total should be 580 (450 + 50 + 80)

## Actual
Total shows 550

## Environment
- OS: Windows 11
- Node: v18.16.0
- Browser: Chrome 120
```

---

## 📚 Documentation

- Update README if adding new features
- Add JSDoc comments to functions
- Document complex logic
- Keep API documentation current
- Add examples in Docs folder

---

## 🔄 Code Review Checklist

As a reviewer, check:

- ✅ Code follows style guide
- ✅ All tests pass
- ✅ No console errors/warnings
- ✅ PR description is clear
- ✅ Commits are well-documented
- ✅ No hardcoded secrets/credentials
- ✅ Performance implications considered
- ✅ Security best practices followed
- ✅ Database queries optimized
- ✅ Error handling implemented

---

## 🚀 Performance Guidelines

- Use pagination for large datasets
- Implement lazy loading for images
- Optimize database queries (indexes, partition keys)
- Use compression for API responses
- Minimize bundle size
- Implement caching where appropriate
- Monitor RU consumption (Cosmos DB)

---

## 🔐 Security Guidelines

- Never commit secrets to repository
- Use environment variables for sensitive data
- Validate all user inputs
- Sanitize data before displaying
- Use parameterized queries
- Implement rate limiting
- Use HTTPS in production
- Validate JWT tokens
- Use bcrypt for password hashing

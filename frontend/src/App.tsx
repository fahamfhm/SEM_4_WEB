import CustomerMenu from './pages/customer/Menu'
import { CartProvider } from './context/CartContext'

function App() {
  return (
    <CartProvider>
      <CustomerMenu />
    </CartProvider>
  )
}

export default App

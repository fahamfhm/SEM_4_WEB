import CustomerMenu from './pages/customer/Menu'
import { CartProvider } from './contexts/CartContext'
import './App.css'

function App() {
  return (
    <CartProvider>
      <CustomerMenu />
    </CartProvider>
  )
}

export default App

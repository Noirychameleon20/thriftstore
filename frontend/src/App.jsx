import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ItemList from './components/ItemList'
import ItemDetails from './components/ItemDetails'
import ItemForm from './components/ItemForm'
import Dashboard from './components/Dashboard'
import AdminPanel from './components/AdminPanel'
import Cart from './components/Cart'
import Checkout from './components/Checkout'
import Orders from './components/Orders'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/items" element={<ItemList />} />
            <Route path="/items/:id" element={<ItemDetails />} />
            <Route path="/add-item" element={<ItemForm />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  )
}

export default App 
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

function Cart() {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updating, setUpdating] = useState(null)
  const [removing, setRemoving] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      const res = await api.get('/cart')
      setCartItems(res.data)
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login')
        return
      }
      setError('Failed to load cart')
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return
    setUpdating(itemId)
    try {
      await api.put(`/cart/${itemId}`, { quantity })
      setCartItems(items => 
        items.map(item => 
          item.item_id === itemId ? { ...item, quantity } : item
        )
      )
    } catch (err) {
      setError('Failed to update quantity')
    } finally {
      setUpdating(null)
    }
  }

  const removeItem = async (itemId) => {
    setRemoving(itemId)
    try {
      await api.delete(`/cart/${itemId}`)
      setCartItems(items => items.filter(item => item.item_id !== itemId))
    } catch (err) {
      setError('Failed to remove item')
    } finally {
      setRemoving(null)
    }
  }

  const clearCart = async () => {
    if (!window.confirm('Are you sure you want to clear your cart?')) return
    try {
      await api.delete('/cart')
      setCartItems([])
    } catch (err) {
      setError('Failed to clear cart')
    }
  }

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  if (loading) return <div className="text-center py-8">Loading cart...</div>
  if (error) return <div className="text-center text-red-600 py-8">{error}</div>

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Shopping Cart</h2>
        {cartItems.length > 0 && (
          <button onClick={clearCart} className="text-red-600 hover:text-red-800">
            Clear Cart
          </button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <button 
            onClick={() => navigate('/items')} 
            className="btn-primary"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {cartItems.map(item => (
            <div key={item.item_id} className="card flex items-center gap-4">
              {item.image && (
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="h-20 w-20 object-cover rounded"
                />
              )}
              <div className="flex-1">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.seller_name}</p>
                <p className="text-primary-600 font-semibold">${item.price}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.item_id, item.quantity - 1)}
                  disabled={updating === item.item_id || item.quantity <= 1}
                  className="px-2 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
                >
                  -
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.item_id, item.quantity + 1)}
                  disabled={updating === item.item_id}
                  className="px-2 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
                >
                  +
                </button>
              </div>
              <div className="text-right">
                <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                <button
                  onClick={() => removeItem(item.item_id)}
                  disabled={removing === item.item_id}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  {removing === item.item_id ? 'Removing...' : 'Remove'}
                </button>
              </div>
            </div>
          ))}

          <div className="card">
            <div className="flex justify-between items-center text-xl font-bold">
              <span>Total:</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
            <button
              onClick={() => navigate('/checkout')}
              className="btn-primary w-full mt-4"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart 
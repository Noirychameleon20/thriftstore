import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../services/api'

function ItemDetails() {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(false)
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await api.get(`/items/${id}`)
        setItem(res.data)
      } catch (err) {
        setError('Item not found')
      } finally {
        setLoading(false)
      }
    }
    fetchItem()
  }, [id])

  const isOwner = user && item && user.id === item.created_by
  const isAdmin = user && user.role === 'admin'
  const [addingToCart, setAddingToCart] = useState(false)

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this item?')) return
    setDeleting(true)
    try {
      await api.delete(`/items/${id}`)
      navigate('/items')
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to delete item')
    } finally {
      setDeleting(false)
    }
  }

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login')
      return
    }
    
    setAddingToCart(true)
    try {
      await api.post('/cart', { item_id: parseInt(id) })
      alert('Item added to cart!')
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to add to cart')
    } finally {
      setAddingToCart(false)
    }
  }

  if (loading) return <div className="text-center py-8">Loading item...</div>
  if (error) return <div className="text-center text-red-600 py-8">{error}</div>
  if (!item) return null

  return (
    <div className="max-w-2xl mx-auto card">
      {item.image && (
        <img src={item.image} alt={item.title} className="h-64 w-full object-cover rounded mb-4" />
      )}
      <h2 className="text-3xl font-bold mb-2">{item.title}</h2>
      <p className="text-gray-600 mb-2">{item.description}</p>
      <div className="flex items-center justify-between mt-4">
        <span className="text-primary-600 font-semibold text-xl">${item.price}</span>
        <span className="text-gray-500 text-sm">By {item.creator_name || 'Unknown'}</span>
      </div>
      
      <div className="flex gap-4 mt-6">
        {!isOwner && user && (
          <button 
            onClick={handleAddToCart} 
            className="btn-primary" 
            disabled={addingToCart}
          >
            {addingToCart ? 'Adding...' : 'Add to Cart'}
          </button>
        )}
        {(isOwner || isAdmin) && (
          <button onClick={handleDelete} className="btn-secondary text-red-600 border-red-200 hover:bg-red-50" disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        )}
      </div>
    </div>
  )
}

export default ItemDetails
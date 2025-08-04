import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../services/api'

function Dashboard() {
  const { user, isAuthenticated } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    const fetchItems = async () => {
      try {
        const res = await api.get('/items')
        setItems(res.data.filter(item => item.created_by === user.id))
      } catch (err) {
        setError('Failed to load your items')
      } finally {
        setLoading(false)
      }
    }
    fetchItems()
  }, [isAuthenticated, navigate, user?.id])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return
    setDeleting(id)
    try {
      await api.delete(`/items/${id}`)
      setItems(items => items.filter(item => item.id !== id))
    } catch (err) {
      setError('Failed to delete item')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) return <div className="text-center py-8">Loading your items...</div>
  if (error) return <div className="text-center text-red-600 py-8">{error}</div>

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">My Items</h2>
      {items.length === 0 ? (
        <div className="text-gray-500">You have not added any items yet.</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {items.map(item => (
            <div key={item.id} className="card flex flex-col">
              {item.image && (
                <img src={item.image} alt={item.title} className="h-40 w-full object-cover rounded mb-2" />
              )}
              <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
              <p className="text-gray-600 mb-2 line-clamp-2">{item.description}</p>
              <span className="text-primary-600 font-semibold mb-2">${item.price}</span>
              <div className="flex gap-2 mt-auto">
                <Link to={`/items/${item.id}/edit`} className="btn-secondary">Edit</Link>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="btn-secondary text-red-600 border-red-200 hover:bg-red-50"
                  disabled={deleting === item.id}
                >
                  {deleting === item.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dashboard
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

function ItemList() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await api.get('/items')
        setItems(res.data)
      } catch (err) {
        setError('Failed to load items')
      } finally {
        setLoading(false)
      }
    }
    fetchItems()
  }, [])

  if (loading) return <div className="text-center py-8">Loading items...</div>
  if (error) return <div className="text-center text-red-600 py-8">{error}</div>

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {items.map(item => (
        <div key={item.id} className="card flex flex-col">
          {item.image && (
            <img src={item.image} alt={item.title} className="h-48 w-full object-cover rounded mb-4" />
          )}
          <h2 className="text-xl font-bold mb-2">{item.title}</h2>
          <p className="text-gray-600 mb-2 line-clamp-2">{item.description}</p>
          <div className="flex-1" />
          <div className="flex justify-between items-center mt-4">
            <span className="text-primary-600 font-semibold text-lg">${item.price}</span>
            <Link to={`/items/${item.id}`} className="btn-secondary text-sm">View</Link>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ItemList
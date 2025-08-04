import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../services/api'

function AdminPanel() {
  const { user, isAuthenticated } = useAuth()
  const [users, setUsers] = useState([])
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(null)
  const navigate = useNavigate()

  const isAdmin = user && user.role === 'admin'

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/')
      return
    }
    const fetchData = async () => {
      try {
        const [usersRes, itemsRes] = await Promise.all([
          api.get('/auth/users'), // You need to create this endpoint in your backend
          api.get('/items')
        ])
        setUsers(usersRes.data)
        setItems(itemsRes.data)
      } catch (err) {
        setError('Failed to load admin data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [isAuthenticated, isAdmin, navigate])

  const handleDeleteItem = async (id) => {
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

  if (loading) return <div className="text-center py-8">Loading admin data...</div>
  if (error) return <div className="text-center text-red-600 py-8">{error}</div>

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-2">All Users</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded">
            <thead>
              <tr>
                <th className="px-4 py-2 border">ID</th>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Role</th>
                <th className="px-4 py-2 border">Created</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-t">
                  <td className="px-4 py-2 border">{u.id}</td>
                  <td className="px-4 py-2 border">{u.name}</td>
                  <td className="px-4 py-2 border">{u.email}</td>
                  <td className="px-4 py-2 border">{u.role}</td>
                  <td className="px-4 py-2 border">{u.created_at && u.created_at.slice(0, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">All Items</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {items.map(item => (
            <div key={item.id} className="card flex flex-col">
              {item.image && (
                <img src={item.image} alt={item.title} className="h-40 w-full object-cover rounded mb-2" />
              )}
              <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
              <p className="text-gray-600 mb-2 line-clamp-2">{item.description}</p>
              <span className="text-primary-600 font-semibold mb-2">${item.price}</span>
              <span className="text-gray-500 text-xs mb-2">By User ID: {item.created_by}</span>
              <button
                onClick={() => handleDeleteItem(item.id)}
                className="btn-secondary text-red-600 border-red-200 hover:bg-red-50 mt-auto"
                disabled={deleting === item.id}
              >
                {deleting === item.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminPanel
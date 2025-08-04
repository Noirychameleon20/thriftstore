import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

function ItemForm() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    image: null
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (name === 'image') {
      setForm(f => ({ ...f, image: files[0] }))
    } else {
      setForm(f => ({ ...f, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const formData = new FormData()
    formData.append('title', form.title)
    formData.append('description', form.description)
    formData.append('price', form.price)
    if (form.image) formData.append('image', form.image)
    try {
      await api.post('/items', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      navigate('/items')
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to add item')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto card space-y-4">
      <h2 className="text-2xl font-bold mb-2">Add New Item</h2>
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded">{error}</div>}
      <div>
        <label className="block mb-1 font-medium">Title</label>
        <input type="text" name="title" value={form.title} onChange={handleChange} required className="input-field" />
      </div>
      <div>
        <label className="block mb-1 font-medium">Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} className="input-field" rows={3} />
      </div>
      <div>
        <label className="block mb-1 font-medium">Price</label>
        <input type="number" name="price" value={form.price} onChange={handleChange} required min="0" step="0.01" className="input-field" />
      </div>
      <div>
        <label className="block mb-1 font-medium">Image</label>
        <input type="file" name="image" accept="image/*" onChange={handleChange} className="input-field" />
      </div>
      <button type="submit" className="btn-primary w-full" disabled={loading}>
        {loading ? 'Adding...' : 'Add Item'}
      </button>
    </form>
  )
}

export default ItemForm
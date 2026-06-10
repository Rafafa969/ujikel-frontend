import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({ name: '', type: 'MOTOR', price: '', stock: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user || user.role !== 'ADMIN') navigate('/login');
    fetchProduct();
  }, [id, navigate]);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/products/${id}`);
      const p = res.data.product;
      setData({ name: p.name, type: p.type, price: p.price, stock: p.stock, description: p.description || '' });
    } catch (err) { 
      navigate('/admin'); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:5000/api/products/${id}`, {
        name: data.name,
        type: data.type,
        price: parseFloat(data.price),
        stock: parseInt(data.stock),
        description: data.description
      }, { headers: { Authorization: `Bearer ${token}` } });
      
      setMsg('Berhasil diupdate!');
      setTimeout(() => navigate('/admin'), 1500);
    } catch (err) { 
      alert('Gagal!'); 
    }
    finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '1.5rem auto', backgroundColor: '#1a1a1a', borderRadius: '8px', padding: '1.5rem' }}>
      {msg && <div style={{ backgroundColor: '#166534', color: '#22c55e', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem' }}>{msg}</div>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          type="text"
          placeholder="Nama Produk"
          value={data.name}
          onChange={e => setData({...data, name: e.target.value})}
          style={{ backgroundColor: '#111', color: 'white', padding: '0.75rem', borderRadius: '6px', border: '1px solid #333' }}
          required
        />

        <select
          value={data.type}
          onChange={e => setData({...data, type: e.target.value})}
          style={{ backgroundColor: '#111', color: 'white', padding: '0.75rem', borderRadius: '6px', border: '1px solid #333' }}
        >
          <option value="MOTOR">MOTOR</option>
          <option value="SPAREPART">SPAREPART</option>
        </select>

        <input
          type="number"
          placeholder="Stok"
          value={data.stock}
          onChange={e => setData({...data, stock: e.target.value})}
          style={{ backgroundColor: '#111', color: 'white', padding: '0.75rem', borderRadius: '6px', border: '1px solid #333' }}
          required
        />

        <input
          type="number"
          placeholder="Harga"
          value={data.price}
          onChange={e => setData({...data, price: e.target.value})}
          style={{ backgroundColor: '#111', color: 'white', padding: '0.75rem', borderRadius: '6px', border: '1px solid #333' }}
          required
        />

        <textarea
          placeholder="Deskripsi"
          value={data.description}
          onChange={e => setData({...data, description: e.target.value})}
          style={{ backgroundColor: '#111', color: 'white', padding: '0.75rem', borderRadius: '6px', border: '1px solid #333', height: '80px' }}
        />

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="submit"
            disabled={loading}
            style={{ flex: 1, backgroundColor: '#dc2626', color: 'white', padding: '0.75rem', borderRadius: '6px', fontWeight: 'bold' }}
          >
            {loading ? '...' : 'UPDATE'}
          </button>
          <Link to="/admin" style={{ padding: '0.75rem', backgroundColor: '#374151', color: 'white', borderRadius: '6px', textDecoration: 'none' }}>
            BATAL
          </Link>
        </div>
      </form>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import BannerSlider from '../../components/BannerSlider';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data.products);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) &&
    (!filter || p.type === filter)
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '4rem' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid #dc2626', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem', backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      
      <BannerSlider />

      {/* Search */}
      <div style={{ backgroundColor: '#1a1a1a', padding: '1rem', borderRadius: '8px', border: '1px solid #222', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <input
            type="text"
            placeholder="Cari produk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, backgroundColor: '#111', color: 'white', padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #333', outline: 'none' }}
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ backgroundColor: '#111', color: 'white', padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #333' }}
          >
            <option value="">Semua</option>
            <option value="MOTOR">Motor</option>
            <option value="SPAREPART">Spare Part</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ backgroundColor: '#1a1a1a', padding: '1rem', borderRadius: '8px', border: '1px solid #222' }}>
          <p style={{ color: '#6b7280', fontSize: '12px', textTransform: 'uppercase' }}>MOTOR</p>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>{products.filter(p => p.type === 'MOTOR').length}</p>
        </div>
        <div style={{ backgroundColor: '#1a1a1a', padding: '1rem', borderRadius: '8px', border: '1px solid #222' }}>
          <p style={{ color: '#6b7280', fontSize: '12px', textTransform: 'uppercase' }}>SPAREPART</p>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>{products.filter(p => p.type === 'SPAREPART').length}</p>
        </div>
        <div style={{ backgroundColor: '#1a1a1a', padding: '1rem', borderRadius: '8px', border: '1px solid #222' }}>
          <p style={{ color: '#6b7280', fontSize: '12px', textTransform: 'uppercase' }}>TERSEDIA</p>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>{products.reduce((s, p) => s + p.stock, 0)}</p>
        </div>
      </div>

      {/* Products Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', md: { gridTemplateColumns: 'repeat(3, 1fr)' }, lg: { gridTemplateColumns: 'repeat(4, 1fr)' } }}>
        {filteredProducts.map((product) => (
          <Link 
            key={product.id} 
            to={`/product/${product.id}`}
            style={{ backgroundColor: '#1a1a1a', borderRadius: '8px', border: '1px solid #222', overflow: 'hidden', display: 'block' }}
          >
            <div style={{ height: '160px', backgroundColor: '#111', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
              {product.image ? (
                <img 
                  src={`http://localhost:5000/uploads/${product.image}`} 
                  alt={product.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <span style={{ fontSize: '40px' }}>{product.type === 'MOTOR' ? '🏍️' : '🔧'}</span>
              )}
            </div>
            <div style={{ padding: '1rem' }}>
              <p style={{ fontSize: '12px', color: '#6b7280' }}>{product.type}</p>
              <p style={{ color: 'white', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</p>
              <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#dc2626', marginTop: '0.25rem' }}>Rp {product.price?.toLocaleString('id-ID')}</p>
              <p style={{ fontSize: '12px', marginTop: '0.25rem', color: product.stock > 0 ? '#22c55e' : '#ef4444' }}>
                {product.stock > 0 ? `✓ ${product.stock} unit` : 'Stok Habis'}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <p style={{ fontSize: '48px' }}>📦</p>
          <p style={{ color: '#6b7280' }}>Produk tidak ditemukan</p>
        </div>
      )}
    </div>
  );
}
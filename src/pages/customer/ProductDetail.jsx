import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:5000/api/products/${id}`)
      .then(res => setProduct(res.data.product))
      .finally(() => setLoading(false));
  }, [id]);

  const addToCart = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    
    if (!token || !user) {
      navigate('/login');
      return;
    }
    
    try {
      console.log('Sending:', {
        userId: user.id,
        productId: product.id,
        qty: parseInt(qty),
        price: product.price
      });
      
      await axios.post('http://localhost:5000/api/cart/add', {
        userId: user.id,
        productId: product.id,
        qty: parseInt(qty),
        price: product.price
      }, { 
        headers: { 'Content-Type': 'application/json' }
      });
      
      setMsg('Ditambahkan ke keranjang!');
      setTimeout(() => setMsg(''), 3000);
    } catch (e) {
      console.error('ERROR:', e);
      alert(e.response?.data?.message || 'Gagal');
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-500">Loading...</div>;
  if (!product) return <div className="text-center py-20 text-gray-500">Produk tidak ditemukan</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-white text-sm mb-4">
        ← KEMBALI
      </button>

      <div className="bg-[#111] border border-[#222]">
        <div className="grid grid-cols-2">
          <div className="bg-[#1a1a1a] h-96 flex items-center justify-center">
            {product.image ? (
              <img src={`http://localhost:5000/uploads/${product.image}`} alt={product.name} className="w-full h-full object-cover" />
            ) : <span className="text-7xl text-gray-700">{product.type === 'MOTOR' ? '🏍️' : '🔧'}</span>}
          </div>

          <div className="p-6">
            <div className="flex gap-2 mb-3">
              <span className="text-xs px-2 py-1 bg-red-900/50 text-red-500">{product.type}</span>
            </div>

            <h1 className="text-2xl font-bold text-white">{product.name}</h1>

            <p className="text-3xl font-bold text-red-500 mt-4">
              Rp {product.price?.toLocaleString('id-ID')}
            </p>

            <div className="flex items-center gap-4 mt-4">
              <div className="flex bg-[#111] border border-[#333]">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-2 text-white hover:bg-gray-800">-</button>
                <span className="px-4 py-2 text-white flex items-center">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="px-4 py-2 text-white hover:bg-gray-800">+</button>
              </div>
              <span className={`text-sm ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {product.stock > 0 ? `Stok: ${product.stock}` : 'Stok Habis'}
              </span>
            </div>

            {msg && (
              <div className="bg-green-900/30 border border-green-800 text-green-400 px-4 py-2 mt-4 text-sm">
                {msg}
              </div>
            )}

            <button
              onClick={addToCart}
              disabled={product.stock === 0}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-4 mt-4 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {product.stock === 0 ? 'STOK HABIS' : 'TAMBAH KE KERANJANG'}
            </button>

            <div className="mt-6 pt-4 border-t border-[#222]">
              <p className="text-gray-500 text-xs mb-1">DESKRIPSI</p>
              <p className="text-gray-400 text-sm">{product.description || '-'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
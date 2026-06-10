import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Cart() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) return navigate('/login');
    fetchCart();
  }, [navigate]);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const res = await axios.get(`http://localhost:5000/api/cart/${user.id}`);
      setItems(res.data.items || []);
    } catch (err) { 
      console.error(err); 
      setItems([]);
    } finally { setLoading(false); }
  };

  const hapusItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/${id}`);
      fetchCart();
    } catch (err) { 
      alert('Gagal hapus!'); 
    }
  };

  const updateQty = async (id, qty) => {
    if (qty < 1) return;
    try {
      await axios.put(`http://localhost:5000/api/cart/${id}`, { quantity: qty });
      fetchCart();
    } catch (err) { 
      alert('Gagal update!'); 
    }
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setCheckingOut(true);
    
    const user = JSON.parse(localStorage.getItem('user'));
    const total = items.reduce((s, item) => s + (item.price * item.qty), 0);
    
    try {
      await axios.post('http://localhost:5000/api/orders', {
        userId: user.id,
        items: items.map(item => ({
          productId: item.productId,
          qty: item.qty,
          price: item.price
        })),
        total
      });
      
      alert('Pesanan dibuat! Status: PENDING\nMenunggu konfirmasi admin.');
      navigate('/orders');
    } catch (err) {
      alert('Gagal: ' + (err.response?.data?.message || err.message));
    } finally {
      setCheckingOut(false);
    }
  };

  const total = items.reduce((s, item) => s + (item.price * item.qty), 0);

  if (loading) return <div className="text-center py-20 text-gray-500">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-white mb-4">KERANJANG</h1>
      
      {items.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <p>Keranjang kosong</p>
          <Link to="/" className="text-red-500 mt-2 inline-block">Belanja lagi</Link>
        </div>
      ) : (
        <>
          {items.map(item => (
            <div key={item.id} className="flex gap-4 bg-[#111] p-4 mb-2">
              <div className="w-20 h-20 bg-[#1a1a1a]">
                {item.product?.image ? (
                  <img src={`http://localhost:5000/uploads/${item.product.image}`} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">🏍️</div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">{item.product?.name}</p>
                <p className="text-red-500 font-bold">Rp {item.price?.toLocaleString()}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => updateQty(item.id, item.qty - 1)} className="px-3 py-1 bg-[#222] text-white">-</button>
                  <span className="text-white">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, item.qty + 1)} className="px-3 py-1 bg-[#222] text-white">+</button>
                  <button onClick={() => hapusItem(item.id)} className="ml-auto px-3 py-1 bg-red-600 text-white">HAPUS</button>
                </div>
              </div>
            </div>
          ))}
          
          <div className="bg-[#111] p-4 mt-4">
            <div className="flex justify-between mb-4">
              <p className="text-gray-500">Total ({items.length} item)</p>
              <p className="text-white text-xl font-bold">Rp {total.toLocaleString()}</p>
            </div>
            <button 
              onClick={handleCheckout}
              disabled={checkingOut}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 font-bold disabled:opacity-50"
            >
              {checkingOut ? 'MEMPROSES...' : 'CHECKOUT'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
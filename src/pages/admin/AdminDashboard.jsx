import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('products');
  const [search, setSearch] = useState('');
  const [activeProofUrl, setActiveProofUrl] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user || user.role !== 'ADMIN') navigate('/login');
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pRes, oRes] = await Promise.all([
        axios.get('http://localhost:5000/api/products'),
        axios.get('http://localhost:5000/api/orders')
      ]);
      setProducts(pRes.data.products || []);
      setOrders(oRes.data.orders || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleExportPDF = () => {
    window.open('http://localhost:5000/api/export/pdf', '_blank');
  };

  const handleExportExcel = () => {
    window.open('http://localhost:5000/api/export/excel', '_blank');
  };

  const hapusProduk = async (id) => {
    if (!confirm('Yakin hapus produk ini?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      fetchData();
      alert('Produk dihapus!');
    } catch (err) { 
      alert(err.response?.data?.message || 'Gagal hapus!'); 
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${id}/status`, { status });
      fetchData();
      alert('Status updated!');
    } catch (err) { 
      alert('Gagal update!'); 
    }
  };

  const hapusOrder = async (id) => {
    if (!confirm('Hapus order ini?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/orders/${id}`);
      fetchData();
      alert('Order dihapus!');
    } catch (err) { 
      alert('Gagal hapus!'); 
    }
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const statusCounts = {
    PENDING: orders.filter(o => o.status === 'PENDING').length,
    PAID: orders.filter(o => o.status === 'PAID').length,
    COMPLETED: orders.filter(o => o.status === 'COMPLETED').length,
    CANCELLED: orders.filter(o => o.status === 'CANCELLED').length,
  };

  if (loading) return <div className="text-center py-20 text-gray-500">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">ADMIN DASHBOARD</h1>
          <p className="text-gray-500">Kelola Produk & Pesanan</p>
        </div>
        <div className="flex gap-2 items-center">
          <button onClick={handleExportPDF} className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-bold text-sm">EXPORT PDF</button>
          <button onClick={handleExportExcel} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold text-sm">EXPORT EXCEL</button>
          <Link to="/admin/add-product" className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-sm">+ PRODUK</Link>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-[#111] p-4 border border-[#222]">
          <p className="text-gray-500 text-sm">TOTAL PRODUK</p>
          <p className="text-2xl font-bold text-white">{products.length}</p>
        </div>
        <div className="bg-[#111] p-4 border border-[#222]">
          <p className="text-yellow-500 text-sm">PENDING</p>
          <p className="text-2xl font-bold text-yellow-500">{statusCounts.PENDING}</p>
        </div>
        <div className="bg-[#111] p-4 border border-[#222]">
          <p className="text-green-500 text-sm">PAID</p>
          <p className="text-2xl font-bold text-green-500">{statusCounts.PAID}</p>
        </div>
        <div className="bg-[#111] p-4 border border-[#222]">
          <p className="text-gray-500 text-sm">TOTAL ORDER</p>
          <p className="text-2xl font-bold text-white">{orders.length}</p>
        </div>
      </div>

     
      <div className="bg-[#111] border border-[#222] p-6 mb-6">
        <h2 className="text-white text-lg font-bold mb-4">GRAFIK STATUS PESANAN</h2>
        
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '200px', borderBottom: '2px solid #333', padding: '0 20px' }}>
          
        
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ color: '#eab308', fontWeight: 'bold', fontSize: '20px', marginBottom: '8px' }}>
              {statusCounts.PENDING}
            </div>
            <div style={{ 
              width: '60px', 
              height: statusCounts.PENDING > 0 ? (statusCounts.PENDING / Math.max(...Object.values(statusCounts), 1)) * 150 + 'px' : '4px',
              backgroundColor: '#eab308',
              borderRadius: '4px 4px 0 0',
              boxShadow: '0 0 10px #eab308'
            }} />
            <div style={{ color: '#9ca3af', fontSize: '12px', marginTop: '8px' }}>PENDING</div>
          </div>
          
          {/* PAID */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ color: '#22c55e', fontWeight: 'bold', fontSize: '20px', marginBottom: '8px' }}>
              {statusCounts.PAID}
            </div>
            <div style={{ 
              width: '60px', 
              height: statusCounts.PAID > 0 ? (statusCounts.PAID / Math.max(...Object.values(statusCounts), 1)) * 150 + 'px' : '4px',
              backgroundColor: '#22c55e',
              borderRadius: '4px 4px 0 0',
              boxShadow: '0 0 10px #22c55e'
            }} />
            <div style={{ color: '#9ca3af', fontSize: '12px', marginTop: '8px' }}>PAID</div>
          </div>
          
          {/* COMPLETED */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ color: '#3b82f6', fontWeight: 'bold', fontSize: '20px', marginBottom: '8px' }}>
              {statusCounts.COMPLETED}
            </div>
            <div style={{ 
              width: '60px', 
              height: statusCounts.COMPLETED > 0 ? (statusCounts.COMPLETED / Math.max(...Object.values(statusCounts), 1)) * 150 + 'px' : '4px',
              backgroundColor: '#3b82f6',
              borderRadius: '4px 4px 0 0',
              boxShadow: '0 0 10px #3b82f6'
            }} />
            <div style={{ color: '#9ca3af', fontSize: '12px', marginTop: '8px' }}>COMPLETED</div>
          </div>
          
          {/* CANCELLED */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '20px', marginBottom: '8px' }}>
              {statusCounts.CANCELLED}
            </div>
            <div style={{ 
              width: '60px', 
              height: statusCounts.CANCELLED > 0 ? (statusCounts.CANCELLED / Math.max(...Object.values(statusCounts), 1)) * 150 + 'px' : '4px',
              backgroundColor: '#ef4444',
              borderRadius: '4px 4px 0 0',
              boxShadow: '0 0 10px #ef4444'
            }} />
            <div style={{ color: '#9ca3af', fontSize: '12px', marginTop: '8px' }}>CANCELLED</div>
          </div>
          
        </div>
        
        {/* TOTAL */}
        <div style={{ textAlign: 'center', marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #222' }}>
          <span style={{ color: '#6b7280' }}>Total Pesanan: </span>
          <span style={{ color: 'white', fontWeight: 'bold', fontSize: '20px', marginLeft: '8px' }}>{orders.length}</span>
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-2 mb-4">
        <button onClick={() => setTab('products')} className={`px-4 py-2 ${tab === 'products' ? 'bg-red-600 text-white' : 'bg-[#222] text-gray-500'}`}>PRODUK</button>
        <button onClick={() => setTab('orders')} className={`px-4 py-2 ${tab === 'orders' ? 'bg-red-600 text-white' : 'bg-[#222] text-gray-500'}`}>PESANAN</button>
      </div>

      {/* PRODUCTS TAB */}
      {tab === 'products' && (
        <>
          <input type="text" placeholder="Cari produk..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-[#111] text-white p-3 mb-4 border border-[#222]" />
          <div className="grid grid-cols-4 gap-4">
            {filteredProducts.map(p => (
              <div key={p.id} className="bg-[#111]">
                <div className="h-40 bg-[#1a1a1a] flex items-center justify-center">
                  {p.image ? <img src={`http://localhost:5000/uploads/${p.image}`} className="w-full h-full object-cover" /> : <span className="text-4xl">🏍️</span>}
                </div>
                <div className="p-3">
                  <p className="text-gray-500 text-xs">{p.type}</p>
                  <p className="text-white font-medium truncate">{p.name}</p>
                  <p className="text-red-500 font-bold">Rp {p.price?.toLocaleString()}</p>
                  <p className={`text-xs ${p.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>Stok: {p.stock}</p>
                  <div className="flex gap-2 mt-2">
                    <Link to={`/admin/edit-product/${p.id}`} className="flex-1 text-center py-1 bg-blue-600 text-white text-sm">EDIT</Link>
                    <button onClick={() => hapusProduk(p.id)} className="flex-1 py-1 bg-red-600 text-white text-sm">HAPUS</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ORDERS TAB */}
      {tab === 'orders' && orders.map(order => (
        <div key={order.id} className="bg-[#111] p-4 mb-4">
          <div className="flex justify-between mb-2">
            <div>
              <p className="text-white font-bold">Order #{order.id}</p>
              <p className="text-gray-500 text-sm">Code: {order.orderCode}</p>
              <p className="text-gray-500 text-sm">User: {order.user?.name}</p>
            </div>
            <div className="text-right">
              <p className={`font-bold ${order.status === 'PENDING' ? 'text-yellow-500' : order.status === 'PAID' ? 'text-green-500' : order.status === 'COMPLETED' ? 'text-blue-500' : 'text-red-500'}`}>{order.status}</p>
              <p className="text-white font-bold">Rp {order.totalPrice?.toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-[#1a1a1a] p-3 mb-2 rounded border border-[#222]">
            {order.orderDetails?.map(item => <p key={item.id} className="text-gray-400 text-sm py-0.5">{item.product?.name} x{item.qty} = Rp {(item.price * item.qty).toLocaleString()}</p>)}
          </div>

          {/* BUKTI PEMBAYARAN */}
          {order.payment ? (
            <div className="mt-3 mb-3 p-3 bg-[#161616] border border-[#222] rounded-lg flex gap-4 items-center">
              <div 
                className="w-16 h-16 bg-[#111] border border-[#333] rounded-md overflow-hidden flex-shrink-0 cursor-pointer hover:border-red-500 transition-colors"
                onClick={() => setActiveProofUrl(`http://localhost:5000/uploads/${order.payment.evidence}`)}
              >
                <img 
                  src={`http://localhost:5000/uploads/${order.payment.evidence}`} 
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-200" 
                  alt="Bukti Transfer"
                />
              </div>
              <div>
                <p className="text-gray-500 text-xs font-semibold uppercase">Bukti Transfer (Klik gambar untuk zoom)</p>
                <p className="text-white text-sm mt-1">
                  Status Bukti: {
                    order.payment.status === 'PENDING' ? <span className="text-yellow-500 font-bold">⌛ Menunggu Konfirmasi</span> :
                    (order.payment.status === 'SUCCESS' || order.payment.status === 'APPROVED') ? <span className="text-green-500 font-bold">✓ Sukses (Lunas)</span> :
                    <span className="text-red-500 font-bold">✕ Ditolak</span>
                  }
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-3 mb-3 p-3 bg-[#161616] border border-[#222] rounded-lg text-gray-500 text-xs italic">
              Belum ada bukti pembayaran yang diunggah.
            </div>
          )}

          <div className="flex gap-2 mt-4">
            {order.status === 'PENDING' && <>
              <button 
                onClick={() => updateStatus(order.id, 'PAID')} 
                disabled={!order.payment}
                className="flex-1 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded transition-colors"
              >
                ✓ TERIMA PEMBAYARAN
              </button>
              <button 
                onClick={() => updateStatus(order.id, 'CANCELLED')} 
                className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded transition-colors"
              >
                ✕ TOLAK
              </button>
            </>}
            <button onClick={() => hapusOrder(order.id)} className="py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded transition-colors">HAPUS</button>
          </div>
        </div>
      ))}

      {/* MODAL ZOOM BUKTI PEMBAYARAN */}
      {activeProofUrl && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer transition-opacity duration-300" 
          onClick={() => setActiveProofUrl(null)}
        >
          <div 
            className="relative max-w-3xl max-h-[90vh] bg-[#111] p-3 border border-[#333] rounded-lg shadow-2xl flex flex-col cursor-default" 
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-white font-bold text-sm">Bukti Pembayaran</span>
              <button 
                onClick={() => setActiveProofUrl(null)} 
                className="text-red-500 font-bold hover:text-red-400 transition-colors text-sm"
              >
                ✕ TUTUP
              </button>
            </div>
            <img src={activeProofUrl} alt="Bukti Transfer Zoom" className="max-w-full max-h-[75vh] object-contain rounded" />
          </div>
        </div>
      )}
    </div>
  );
}
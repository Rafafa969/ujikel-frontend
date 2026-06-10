import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) return navigate('/login');
    fetchOrders();
  }, [navigate]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const res = await axios.get(`http://localhost:5000/api/orders/user/${user.id}`);
      setOrders(res.data.orders || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleUploadPayment = async (orderId, file) => {
    if (!file) return;
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file terlalu besar! Maksimal 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        await axios.post(`http://localhost:5000/api/orders/${orderId}/payment`, {
          evidence: reader.result
        });
        alert('Bukti pembayaran berhasil diunggah! Menunggu konfirmasi admin.');
        fetchOrders();
      } catch (err) {
        alert('Gagal mengunggah bukti: ' + (err.response?.data?.message || err.message));
      }
    };
  };

  const statusColor = (status) => {
    switch(status) {
      case 'PENDING': return 'text-yellow-500';
      case 'PAID': return 'text-green-500';
      case 'COMPLETED': return 'text-blue-500';
      case 'CANCELLED': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-500">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-white mb-4">PESANAN SAYA</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <p>Belum ada pesanan</p>
          <Link to="/" className="text-red-500 mt-2 inline-block">Belanja lagi</Link>
        </div>
      ) : (
        orders.map(order => (
          <div key={order.id} className="bg-[#111] border border-[#222] p-6 mb-6 rounded-lg shadow-xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-white font-bold text-lg">Order #{order.id}</p>
                <p className="text-gray-500 text-sm">{order.orderCode}</p>
              </div>
              <div className="text-right">
                <span className={`inline-block px-3 py-1 text-xs font-bold uppercase rounded-full ${
                  order.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500' :
                  order.status === 'PAID' ? 'bg-green-500/10 text-green-500' :
                  order.status === 'COMPLETED' ? 'bg-blue-500/10 text-blue-500' :
                  'bg-red-500/10 text-red-500'
                }`}>
                  {order.status}
                </span>
                <p className="text-gray-500 text-xs mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="bg-[#181818] rounded-md p-4 mb-4 border border-[#222]">
              {order.orderDetails?.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm py-2 border-b border-[#222] last:border-b-0">
                  <div className="flex flex-col">
                    <span className="text-white font-medium">{item.product?.name}</span>
                    <span className="text-gray-500 text-xs">x{item.qty} (@ Rp {item.price?.toLocaleString()})</span>
                  </div>
                  <span className="text-red-500 font-bold">Rp {(item.price * item.qty).toLocaleString()}</span>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between pt-2 pb-4 mb-4 border-b border-[#222]">
              <span className="text-gray-400 font-medium">Total Pembayaran</span>
              <span className="text-white font-bold text-xl">Rp {order.totalPrice?.toLocaleString()}</span>
            </div>

            {/* PAYMENT PROCESS / BANK TRANSFER */}
            {order.status === 'PENDING' && (
              <div className="mt-4 p-4 bg-[#161616] border border-[#2a2a2a] rounded-lg">
                <p className="text-white font-bold text-sm mb-2 flex items-center gap-2">
                  <span>🏦</span> Informasi Rekening Transfer Bank:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  <div className="bg-[#1e1e1e] p-3 rounded border border-[#2c2c2c]">
                    <p className="text-red-500 font-bold text-xs uppercase">Bank BCA</p>
                    <p className="text-white font-mono text-base font-bold tracking-wider mt-1">987-654-3210</p>
                    <p className="text-gray-500 text-xs mt-1">A.N. Showroom Motor</p>
                  </div>
                  <div className="bg-[#1e1e1e] p-3 rounded border border-[#2c2c2c]">
                    <p className="text-red-500 font-bold text-xs uppercase">Bank Mandiri</p>
                    <p className="text-white font-mono text-base font-bold tracking-wider mt-1">123-456-7890</p>
                    <p className="text-gray-500 text-xs mt-1">A.N. Showroom Motor</p>
                  </div>
                </div>

                <div className="text-sm text-gray-400 mb-4 bg-[#202020] p-3 rounded border-l-4 border-yellow-500">
                  Harap transfer nominal sesuai total di atas, kemudian unggah foto bukti transfer di bawah ini.
                </div>

                {(!order.payment || order.payment.status === 'REJECTED') ? (
                  <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-[#333] rounded-lg hover:border-red-500/50 transition-colors duration-200">
                    {order.payment?.status === 'REJECTED' && (
                      <div className="w-full bg-red-600/10 border border-red-500 text-red-500 p-3 rounded mb-3 text-xs font-semibold">
                        ⚠️ Bukti pembayaran sebelumnya ditolak oleh admin. Harap unggah ulang bukti yang valid.
                      </div>
                    )}
                    <label className="cursor-pointer bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 font-bold text-sm inline-block rounded-md transition-colors duration-200 shadow-lg shadow-red-600/20">
                      📂 Pilih & Unggah Bukti Transfer
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleUploadPayment(order.id, e.target.files[0]);
                          }
                        }} 
                      />
                    </label>
                    <span className="text-xs text-gray-500 mt-2">Format: JPG, PNG (Maks. 5MB)</span>
                  </div>
                ) : (
                  <div className="p-3 bg-[#1e1e1e] border border-[#2c2c2c] rounded-lg flex flex-col sm:flex-row gap-4 items-center">
                    <div className="w-20 h-20 bg-[#111] border border-[#333] rounded-md overflow-hidden flex-shrink-0">
                      <a href={`http://localhost:5000/uploads/${order.payment.evidence}`} target="_blank" rel="noopener noreferrer">
                        <img 
                          src={`http://localhost:5000/uploads/${order.payment.evidence}`} 
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-200" 
                          alt="Bukti Transfer" 
                        />
                      </a>
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <p className="text-gray-500 text-xs uppercase font-semibold">Status Pembayaran</p>
                      <p className="text-yellow-500 font-bold text-sm mt-1">⌛ Bukti terkirim. Menunggu verifikasi admin.</p>
                      <p className="text-xs text-gray-500 mt-1">Klik gambar untuk melihat ukuran penuh</p>
                    </div>
                    <label className="cursor-pointer bg-[#2c2c2c] hover:bg-[#3d3d3d] text-white px-3 py-1.5 font-bold text-xs rounded transition-colors duration-200">
                      Ganti Bukti
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleUploadPayment(order.id, e.target.files[0]);
                          }
                        }} 
                      />
                    </label>
                  </div>
                )}
              </div>
            )}

            {order.status !== 'PENDING' && order.payment && (
              <div className="mt-4 p-4 bg-[#161616] border border-[#222] rounded-lg flex flex-col sm:flex-row gap-4 items-center">
                <div className="w-16 h-16 bg-[#111] border border-[#333] rounded-md overflow-hidden flex-shrink-0">
                  <a href={`http://localhost:5000/uploads/${order.payment.evidence}`} target="_blank" rel="noopener noreferrer">
                    <img 
                      src={`http://localhost:5000/uploads/${order.payment.evidence}`} 
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-200" 
                      alt="Bukti Transfer" 
                    />
                  </a>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-gray-500 text-xs uppercase font-semibold">Bukti Pembayaran</p>
                  <p className="text-sm mt-1">
                    {(order.payment.status === 'SUCCESS' || order.payment.status === 'APPROVED') && <span className="text-green-500 font-bold">✓ Pembayaran Sukses (Lunas)</span>}
                    {order.payment.status === 'REJECTED' && <span className="text-red-500 font-bold">✕ Bukti Ditolak / Dibatalkan</span>}
                    {order.payment.status === 'PENDING' && <span className="text-yellow-500 font-bold">⌛ Menunggu Verifikasi</span>}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function MainLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || 'null');
    setUser(userData);
  }, []);

  const handleLogout = () => {
    if (confirm('Logout?')) {
      localStorage.clear();
      window.location.href = '/login';
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      {/* Navbar - Corporate Black */}
      <nav className="sticky top-0 z-50 bg-black border-b border-red-600">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">Y</span>
              </div>
              <div>
                <span className="text-white font-bold text-lg tracking-wide">YAMAHA</span>
                <p className="text-gray-500 text-xs -mt-1">Authorized Dealer</p>
              </div>
            </Link>
          
            <div className="flex items-center space-x-6">
              <Link to="/" className="text-gray-300 hover:text-white text-sm font-medium transition">BERANDA</Link>
            
              {user?.role === 'ADMIN' && (
                <>
                  <Link to="/admin" className="text-red-500 hover:text-red-400 text-sm font-medium">DASHBOARD</Link>
                  <Link to="/admin/add-product" className="text-red-500 hover:text-red-400 text-sm font-medium">TAMBAH PRODUK</Link>
                </>
              )}
            
              {user ? (
                <>
                  <Link to="/cart" className="text-gray-300 hover:text-white text-sm font-medium">KERANJANG</Link>
                  <Link to="/orders" className="text-gray-300 hover:text-white text-sm font-medium">PESANAN</Link>
                  <span className="text-gray-400 text-sm">{user.name}</span>
                  <button onClick={handleLogout} className="text-gray-500 hover:text-white text-sm">LOGOUT</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold">LOGIN</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-700 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-3xl font-bold text-white tracking-widest">YAMAHA</h1>
          <p className="text-white/80 text-sm mt-1">PILIHAN TEPAT, KUALITAS TERBAIK</p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-[#111] border border-[#222] p-6 min-h-[600px]">
          <Outlet />
        </div>
      </main>

      <footer className="bg-black border-t border-[#222] py-6 text-center">
        <p className="text-gray-600 text-sm">© 2024 Yamaha Dealer - All Rights Reserved</p>
      </footer>
    </div>
  );
}
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function AdminLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || 'null');
    setUser(userData);
  }, []);

  const handleLogout = () => {
    if (confirm('Yakin logout?')) {
      localStorage.clear();
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[#0f0f0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-xl">🏍️</span>
              </div>
              <span className="text-2xl font-bold text-white">
                <span className="text-blue-500">Moto</span>Parts
              </span>
            </Link>
          
            <div className="flex items-center space-x-1">
              <Link to="/" className="px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition">Beranda</Link>
            
              {user?.role === 'ADMIN' && (
                <>
                  <Link to="/admin" className="px-4 py-2 text-yellow-500 hover:text-yellow-400 hover:bg-yellow-500/10 rounded-lg transition">Dashboard</Link>
                  <Link to="/admin/add-product" className="px-4 py-2 text-green-500 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition">+ Produk</Link>
                </>
              )}
            
              {user ? (
                <>
                  <Link to="/cart" className="px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition">🛒</Link>
                  <Link to="/orders" className="px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition">📦</Link>
                  <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-white/10">
                    <span className="text-gray-400 text-sm">{user.name}</span>
                    <button onClick={handleLogout} className="text-red-400 hover:text-red-300 text-sm">Logout</button>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition">Masuk</Link>
                  <Link to="/register" className="px-5 py-2.5 bg-white/5 text-white rounded-lg font-medium hover:bg-white/10 transition border border-white/10">Daftar</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-[#111111] rounded-2xl border border-white/5 shadow-2xl shadow-black/50 p-8 min-h-[600px]">
          <Outlet />
        </div>
      </main>

      <footer className="border-t border-white/5 py-8 text-center">
        <p className="text-gray-500">© 2024 MotoParts 🏍️</p>
      </footer>
    </div>
  );
}
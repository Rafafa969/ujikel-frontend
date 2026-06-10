import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Home from './pages/customer/Home';
import Login from './pages/customer/Login';
import Register from './pages/customer/Register';
import ProductDetail from './pages/customer/ProductDetail';
import Cart from './pages/customer/Cart';
import Orders from './pages/customer/Orders';

import AdminDashboard from './pages/admin/AdminDashboard';
import AddProduct from './pages/admin/AddProduct';
import EditProduct from './pages/admin/EditProduct';

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    onLogout();
    navigate('/login');
  };

  // Cek apakah admin
  const isAdmin = user?.role === 'ADMIN';

  return (
    <nav style={{ backgroundColor: '#0f0f0f', padding: '1rem', borderBottom: '1px solid #222', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to={isAdmin ? "/admin" : "/"} style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#dc2626', textDecoration: 'none' }}>
          {isAdmin ? (
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#dc2626' }}>ADMIN</span>
          ) : (
            <img src="public/yamaha-logo-png_seeklogo-154906.png" alt="Yamaha" style={{ height: '150px' }} />
          )}
        </Link>

        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          {/* JIKA BUKAN ADMIN, TAMPILKAN LINK USER */}
          {!isAdmin && (
            <>
              <Link to="/" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '17px' }}>Beranda</Link>
              <Link to="/cart" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '17px' }}>Keranjang</Link>
              <Link to="/orders" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '17px' }}>Pesanan</Link>
            </>
          )}

          {/* JIKA ADMIN, TAMPILKAN LINK ADMIN */}
          {isAdmin && (
            <>
              <Link to="/admin" style={{ color: '#eab308', textDecoration: 'none', fontSize: '14px' }}>Dashboard</Link>
              <Link to="/admin/add-product" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '14px' }}>Tambah Produk</Link>
            </>
          )}

          {user ? (
            <>
              <span style={{ color: '#fff', fontSize: '14px' }}>👤 {user.name}</span>
              <button onClick={handleLogout} style={{ color: '#ef4444', background: 'none', border: '1px solid #ef4444', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" style={{ backgroundColor: '#dc2626', color: 'white', padding: '0.5rem 1rem', borderRadius: '6px', textDecoration: 'none', fontSize: '14px' }}>
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || 'null');
    setUser(userData);
  }, []);

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a' }}>
        <Navbar user={user} onLogout={handleLogout} />

        <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/add-product" element={<AddProduct />} />
            <Route path="/admin/edit-product/:id" element={<EditProduct />} />
          </Routes>
        </main>

        <footer style={{ textAlign: 'center', padding: '2rem', color: '#6b7280', borderTop: '1px solid #222' }}>
          <p>© 2024 Yamaha Dealer</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}
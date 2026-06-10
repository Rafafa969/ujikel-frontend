import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      window.location.href = res.data.user.role === 'ADMIN' ? '/admin' : '/';
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-[#111] border border-[#222] p-8">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-red-600 flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">Y</span>
          </div>
          <h1 className="text-2xl font-bold text-white">LOGIN</h1>
          <p className="text-gray-500 text-sm mt-1">Yamaha Authorized Dealer</p>
        </div>
        
        {error && (
          <div className="bg-red-900/30 border border-red-800 text-red-400 px-4 py-3 mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-400 text-xs mb-2">EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#111] text-white px-4 py-3 border border-[#333] focus:border-red-500 focus:outline-none"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-400 text-xs mb-2">PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#111] text-white px-4 py-3 border border-[#333] focus:border-red-500 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 font-bold disabled:opacity-50"
          >
            {loading ? 'LOADING...' : 'LOGIN'}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-500 text-sm">
          <Link to="/register" className="text-red-500 hover:underline">Daftar akun baru</Link>
        </p>
      </div>
    </div>
  );
}
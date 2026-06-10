import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        name, email, password, role: 'CUSTOMER'
      });
      setSuccess('Registrasi berhasil! Silakan login.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registrasi gagal');
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
          <h1 className="text-2xl font-bold text-white">DAFTAR</h1>
          <p className="text-gray-500 text-sm mt-1">Buat akun baru</p>
        </div>
        
        {error && (
          <div className="bg-red-900/30 border border-red-800 text-red-400 px-4 py-3 mb-4 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-900/30 border border-green-800 text-green-400 px-4 py-3 mb-4 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="block text-gray-400 text-xs mb-2">NAMA</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#111] text-white px-4 py-3 border border-[#333] focus:border-red-500 focus:outline-none"
              required
            />
          </div>

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
            {loading ? 'LOADING...' : 'DAFTAR'}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-500 text-sm">
          Sudah punya akun? 
          <Link to="/login" className="text-red-500 hover:underline ml-1">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
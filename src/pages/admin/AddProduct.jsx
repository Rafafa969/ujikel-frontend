import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function AddProduct() {
  const navigate = useNavigate();
  const [data, setData] = useState({ name: '', type: 'MOTOR', price: '', stock: '', description: '' });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const canvasRef = useRef(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user || user.role !== 'ADMIN') navigate('/login');
  }, [navigate]);

  // COMPRESS IMAGE!
  const compressImage = (imgFile, callback) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Max 800px
        const max = 800;
        let w = img.width;
        let h = img.height;
        if (w > h) {
          if (w > max) { h *= max / w; w = max; }
        } else {
          if (h > max) { w *= max / h; h = max; }
        }
        
        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(img, 0, 0, w, h);
        
        // Compress jadi JPEG 70%
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        callback(dataUrl);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(imgFile);
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      // Preview
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selected);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');
    
    try {
      // Compress dulu baru kirim
      const imageBase64 = await new Promise((resolve) => {
        if (file) {
          compressImage(file, resolve);
        } else {
          resolve(null);
        }
      });

      await axios.post('http://localhost:5000/api/products', {
        name: data.name,
        type: data.type,
        price: parseFloat(data.price),
        stock: parseInt(data.stock),
        description: data.description,
        image: imageBase64
      }, { headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      } });

      setMsg('Berhasil!');
      setTimeout(() => navigate('/admin'), 1500);
    } catch (err) {
      console.error(err);
      alert('Gagal: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-6">
      {msg && <div className="bg-green-900/50 text-green-500 p-3 mb-4">{msg}</div>}

      {preview && (
        <div className="h-40 bg-black mb-4 flex items-center justify-center border border-[#333]">
          <img src={preview} alt="Preview" className="h-full w-full object-contain" />
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-[#1a1a1a] border border-[#222] p-6 space-y-4">
        <div>
          <label className="block text-gray-400 text-xs mb-2">FOTO</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full bg-[#111] text-white px-4 py-3 border border-[#333] file:mr-4 file:px-4 file:rounded file:border-0 file:bg-red-600 file:text-white"
          />
        </div>

        <input
          type="text"
          placeholder="Nama Produk"
          value={data.name}
          onChange={e => setData({...data, name: e.target.value})}
          className="w-full bg-[#111] text-white px-4 py-3 border border-[#333]"
          required
        />

        <select
          value={data.type}
          onChange={e => setData({...data, type: e.target.value})}
          className="w-full bg-[#111] text-white px-4 py-3 border border-[#333]"
        >
          <option value="MOTOR">MOTOR</option>
          <option value="SPAREPART">SPAREPART</option>
        </select>

        <input
          type="number"
          placeholder="Stok"
          value={data.stock}
          onChange={e => setData({...data, stock: e.target.value})}
          className="w-full bg-[#111] text-white px-4 py-3 border border-[#333]"
          required
        />

        <input
          type="number"
          placeholder="Harga"
          value={data.price}
          onChange={e => setData({...data, price: e.target.value})}
          className="w-full bg-[#111] text-white px-4 py-3 border border-[#333]"
          required
        />

        <textarea
          placeholder="Deskripsi"
          value={data.description}
          onChange={e => setData({...data, description: e.target.value})}
          className="w-full bg-[#111] text-white px-4 py-3 border border-[#333] h-24"
        />

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-red-600 py-3 text-white font-bold disabled:opacity-50"
          >
            {loading ? '...' : 'SIMPAN'}
          </button>
          <Link to="/admin" className="px-6 py-3 bg-gray-800 text-white border border-gray-700">
            BATAL
          </Link>
        </div>
      </form>
    </div>
  );
}
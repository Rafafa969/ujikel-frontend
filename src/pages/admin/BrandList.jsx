import { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../../components/ui/Button';

export default function BrandList() {
  const [brands, setBrands] = useState([]);
  const [newBrand, setNewBrand] = useState('');
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/brands');
      setBrands(res.data.brands);
    } catch (err) {
      console.error(err);
    }
  };

  const addBrand = async (e) => {
    e.preventDefault();
    if (!newBrand.trim()) return;
    
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:5000/api/brands', 
        { name: newBrand.trim() },
        { headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }}
      );
      setNewBrand('');
      fetchBrands();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal tambah brand');
    }
  };

  const updateBrand = async (e) => {
    e.preventDefault();
    if (!editName.trim()) return;
    
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:5000/api/brands/${editId}`, 
        { name: editName.trim() },
        { headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }}
      );
      setEditId(null);
      fetchBrands();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal update');
    }
  };

  const deleteBrand = async (id) => {
    if (!confirm('Hapus brand?')) return;
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/brands/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchBrands();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal hapus - hapus dulu produk yang pakai brand ini!');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">🏷️ Kelola Brand</h1>

      <form onSubmit={addBrand} className="flex gap-3 mb-6">
        <input
          type="text"
          value={newBrand}
          onChange={(e) => setNewBrand(e.target.value)}
          placeholder="Nama brand baru"
          className="flex-1 bg-[#1a1a1a] text-white px-4 py-3 rounded-xl border border-white/5 focus:border-blue-500 focus:outline-none"
        />
        <Button type="submit" className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white hover:from-yellow-700 hover:to-orange-700 px-6 py-3 rounded-xl">+ Tambah</Button>
      </form>

      <div className="bg-[#1a1a1a] rounded-xl border border-white/5 overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#252525]">
            <tr>
              <th className="p-4 text-left text-gray-400">ID</th>
              <th className="p-4 text-left text-gray-400">Nama Brand</th>
              <th className="p-4 text-right text-gray-400">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {brands.map(b => (
              <tr key={b.id} className="border-t border-white/5">
                <td className="p-4 text-white">{b.id}</td>
                <td className="p-4 text-white">
                  {editId === b.id ? (
                    <form onSubmit={updateBrand} className="flex gap-2">
                      <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)}
                        className="bg-[#252525] text-white px-3 py-2 rounded border border-white/5" />
                      <button type="submit" className="text-green-400 px-2">✓</button>
                      <button type="button" onClick={() => setEditId(null)} className="text-gray-400 px-2">✕</button>
                    </form>
                  ) : b.name}
                </td>
                <td className="p-4 text-right flex justify-end gap-2">
                  <Button onClick={() => { setEditId(b.id); setEditName(b.name); }} className="text-xs bg-blue-600 text-white hover:bg-blue-700">✏️ Edit</Button>
                  <Button onClick={() => deleteBrand(b.id)} className="text-xs bg-red-600 text-white hover:bg-red-700">🗑️ Hapus</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
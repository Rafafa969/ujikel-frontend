import { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../../components/ui/Button';

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/categories');
      setCategories(res.data.categories);
    } catch (err) {
      console.error(err);
    }
  };

  const addCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:5000/api/categories', 
        { name: newCategory.trim() },
        { headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }}
      );
      setNewCategory('');
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal tambah');
    }
  };

  const updateCategory = async (e) => {
    e.preventDefault();
    if (!editName.trim()) return;
    
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:5000/api/categories/${editId}`, 
        { name: editName.trim() },
        { headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }}
      );
      setEditId(null);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal update');
    }
  };

  const deleteCategory = async (id) => {
    if (!confirm('Hapus kategori?')) return;
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal hapus');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">📂 Kelola Kategori</h1>

      <form onSubmit={addCategory} className="flex gap-3 mb-6">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Nama kategori baru"
          className="flex-1 bg-[#1a1a1a] text-white px-4 py-3 rounded-xl border border-white/5 focus:border-blue-500 focus:outline-none"
        />
        <Button type="submit" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 px-6 py-3 rounded-xl">+ Tambah</Button>
      </form>

      <div className="bg-[#1a1a1a] rounded-xl border border-white/5 overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#252525]">
            <tr>
              <th className="p-4 text-left text-gray-400">ID</th>
              <th className="p-4 text-left text-gray-400">Nama</th>
              <th className="p-4 text-right text-gray-400">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(c => (
              <tr key={c.id} className="border-t border-white/5">
                <td className="p-4 text-white">{c.id}</td>
                <td className="p-4 text-white">
                  {editId === c.id ? (
                    <form onSubmit={updateCategory} className="flex gap-2">
                      <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)}
                        className="bg-[#252525] text-white px-3 py-2 rounded border border-white/5" />
                      <button type="submit" className="text-green-400 px-2">✓</button>
                      <button type="button" onClick={() => setEditId(null)} className="text-gray-400 px-2">✕</button>
                    </form>
                  ) : c.name}
                </td>
                <td className="p-4 text-right flex justify-end gap-2">
                  <Button onClick={() => { setEditId(c.id); setEditName(c.name); }} className="text-xs bg-blue-600 text-white hover:bg-blue-700">✏️ Edit</Button>
                  <Button onClick={() => deleteCategory(c.id)} className="text-xs bg-red-600 text-white hover:bg-red-700">🗑️ Hapus</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
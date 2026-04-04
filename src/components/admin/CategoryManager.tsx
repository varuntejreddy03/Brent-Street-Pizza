import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit2, Trash2, Check, X, 
  Layout, Eye, EyeOff, Search 
} from 'lucide-react';
import { API_URL } from '../../config/api';

interface Category {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
}

const CategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Category>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [newForm, setNewForm] = useState({ id: '', name: '', description: '', isActive: true });

  const token = localStorage.getItem('token');

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/categories`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error('Fetch categories error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleUpdate = async (id: string, data: Partial<Category>) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        setEditingId(null);
        fetchCategories();
      }
    } catch (err) {
      console.error('Update category error:', err);
    }
  };

  const handleCreate = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newForm)
      });
      if (res.ok) {
        setIsAdding(false);
        setNewForm({ id: '', name: '', description: '', isActive: true });
        fetchCategories();
      }
    } catch (err) {
      console.error('Create category error:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this category? Products in this category will become unreachable.')) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/categories/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchCategories();
    } catch (err) {
      console.error('Delete category error:', err);
    }
  };

  const filtered = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-8 text-center animate-pulse text-[#555555]">Loading Categories...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-bebas text-[42px] tracking-tight text-[#1A1A1A] leading-tight flex items-center gap-3">
            <Layout className="w-8 h-8 text-[#C8201A]" />
            Category Manager
          </h1>
          <p className="font-inter text-[14px] text-[#555555]">Manage your menu sections (Pizza, Ice Cream, Desserts)</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-[#C8201A] hover:bg-[#9E110D] text-white px-6 py-3 rounded-xl font-barlow font-700 text-[13px] uppercase tracking-wider transition-all shadow-lg hover:shadow-xl active:scale-95"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#E8D8C8] shadow-sm overflow-hidden mb-6">
        <div className="p-4 border-b border-[#E8D8C8] bg-[#FDF8F2] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#C8201A]" />
          <input 
            type="text" 
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent border-none focus:ring-0 font-inter text-[14px] placeholder-[#A0A0A0]"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#F8F1E7]">
                <th className="px-6 py-4 text-left font-barlow text-[11px] font-700 uppercase tracking-widest text-[#555555] border-b border-[#E8D8C8]">ID / Key</th>
                <th className="px-6 py-4 text-left font-barlow text-[11px] font-700 uppercase tracking-widest text-[#555555] border-b border-[#E8D8C8]">Display Name</th>
                <th className="px-6 py-4 text-left font-barlow text-[11px] font-700 uppercase tracking-widest text-[#555555] border-b border-[#E8D8C8]">Description</th>
                <th className="px-6 py-4 text-center font-barlow text-[11px] font-700 uppercase tracking-widest text-[#555555] border-b border-[#E8D8C8]">Status</th>
                <th className="px-6 py-4 text-right font-barlow text-[11px] font-700 uppercase tracking-widest text-[#555555] border-b border-[#E8D8C8]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8D8C8]">
              {isAdding && (
                <tr className="bg-emerald-50/50">
                  <td className="px-6 py-4">
                    <input 
                      type="text" value={newForm.id} onChange={(e) => setNewForm({...newForm, id: e.target.value})}
                      placeholder="e.cat-desserts" className="w-full border-[#E8D8C8] rounded-lg text-[13px] focus:ring-[#C8201A] focus:border-[#C8201A]"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input 
                      type="text" value={newForm.name} onChange={(e) => setNewForm({...newForm, name: e.target.value})}
                      placeholder="Category Name" className="w-full border-[#E8D8C8] rounded-lg text-[13px]"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input 
                      type="text" value={newForm.description} onChange={(e) => setNewForm({...newForm, description: e.target.value})}
                      placeholder="Optional description" className="w-full border-[#E8D8C8] rounded-lg text-[13px]"
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button onClick={() => setNewForm({...newForm, isActive: !newForm.isActive})} className={`p-2 rounded-lg ${newForm.isActive ? 'text-emerald-600 bg-emerald-100' : 'text-gray-400 bg-gray-100'}`}>
                      {newForm.isActive ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={handleCreate} className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"><Check className="w-5 h-5" /></button>
                      <button onClick={() => setIsAdding(false)} className="p-2 text-[#C8201A] hover:bg-red-100 rounded-lg transition-colors"><X className="w-5 h-5" /></button>
                    </div>
                  </td>
                </tr>
              )}
              {filtered.map(cat => (
                <tr key={cat.id} className="hover:bg-[#FDF8F2] transition-colors">
                  <td className="px-6 py-4 font-mono text-[12px] text-[#C8201A]">{cat.id}</td>
                  <td className="px-6 py-4 font-inter text-[14px] font-600 text-[#1A1A1A]">
                    {editingId === cat.id ? (
                      <input 
                        type="text" value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                        className="w-full border-[#E8D8C8] rounded-lg text-[13px]"
                      />
                    ) : cat.name}
                  </td>
                  <td className="px-6 py-4 font-inter text-[13px] text-[#555555]">
                    {editingId === cat.id ? (
                      <input 
                        type="text" value={editForm.description || ''} onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                        className="w-full border-[#E8D8C8] rounded-lg text-[13px]"
                      />
                    ) : cat.description || '—'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => handleUpdate(cat.id, { isActive: !cat.isActive })}
                      className={`p-2 rounded-lg transition-all ${cat.isActive ? 'text-emerald-600 bg-emerald-100/50' : 'text-gray-400 bg-gray-100'}`}
                    >
                      {cat.isActive ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {editingId === cat.id ? (
                        <>
                          <button onClick={() => handleUpdate(cat.id, editForm)} className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg"><Check className="w-5 h-5" /></button>
                          <button onClick={() => setEditingId(null)} className="p-2 text-[#C8201A] hover:bg-red-100 rounded-lg"><X className="w-5 h-5" /></button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => { setEditingId(cat.id); setEditForm(cat); }} className="p-2 text-[#D4952A] hover:bg-amber-100 rounded-lg transition-colors"><Edit2 className="w-5 h-5" /></button>
                          <button onClick={() => handleDelete(cat.id)} className="p-2 text-[#C8201A] hover:bg-red-100 rounded-lg transition-colors"><Trash2 className="w-5 h-5" /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;

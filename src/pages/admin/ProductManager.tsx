import { useEffect, useState } from 'react';
import { API_URL } from '../../config/api';
import { Plus, Edit2, Trash2, Pizza, Image as ImageIcon } from 'lucide-react';

export default function ProductManager() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    id: '',
    categoryId: 'cat-classic-pizza',
    name: '',
    description: '',
    price: 0,
    image: '',
    hasPizzaExtras: false,
    isFavorite: false,
  });

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_URL}/api/admin/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const uniqueCategories = Array.from(new Set(products.map(p => p.category?.name || p.categoryId))).map(
    name => products.find(p => (p.category?.name || p.categoryId) === name)?.category || { id: name, name: name }
  );

  const handleOpenModal = (product: any = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        id: product.id,
        categoryId: product.categoryId,
        name: product.name,
        description: product.description || '',
        price: Number(product.price),
        image: product.image,
        hasPizzaExtras: product.hasPizzaExtras || false,
        isFavorite: product.isFavorite || false,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        id: `item-${Date.now()}`,
        categoryId: 'cat-classic-pizza',
        name: '',
        description: '',
        price: 0,
        image: '',
        hasPizzaExtras: false,
        isFavorite: false,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const method = editingProduct ? 'PUT' : 'POST';
      const url = editingProduct 
        ? `${API_URL}/api/admin/products/${editingProduct.id}`
        : `${API_URL}/api/admin/products`;

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchProducts();
      } else {
        const err = await res.json();
        alert('Failed: ' + (err.error || 'Unknown error'));
      }
    } catch (err) {
      console.error(err);
      alert('Error saving product');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_URL}/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-12 text-center animate-spin"><Pizza className="w-8 h-8 text-[#C8201A] mx-auto" /></div>;

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="font-bebas text-[36px] tracking-wider text-[#1A1A1A] leading-none mb-2">
            Product Catalog
          </h2>
          <p className="font-inter text-[14px] text-[#555555]">
            Manage all menu items, prices, and categories.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-[#C8201A] hover:bg-[#9E1510] text-white font-barlow text-[13px] font-700 uppercase tracking-widest px-6 py-3 rounded-xl transition-colors shadow-lg shadow-[#C8201A]/30"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white border border-[#E8D8C8] rounded-2xl overflow-hidden shadow-sm flex flex-col group hover:shadow-lg transition-all">
            <div className="relative h-48 bg-[#FDF8F2] flex items-center justify-center overflow-hidden">
              {product.image ? (
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <ImageIcon className="w-12 h-12 text-[#E8D8C8]" />
              )}
              {product.isFavorite && (
                <div className="absolute top-3 right-3 bg-[#D4952A] text-white font-barlow text-[10px] font-700 uppercase tracking-widest px-2 py-1 rounded">
                  Popular
                </div>
              )}
              <div className="absolute bottom-3 left-3 bg-[#1A1A1A]/80 backdrop-blur-sm text-white font-barlow text-[10px] font-700 uppercase tracking-widest px-2.5 py-1 rounded">
                {product.category?.name || product.categoryId}
              </div>
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="font-barlow text-[18px] font-700 text-[#1A1A1A] uppercase tracking-wide mb-1 leading-tight">
                {product.name}
              </h3>
              <p className="font-inter text-[12px] text-[#888888] line-clamp-2 mb-4 flex-1">
                {product.description}
              </p>
              
              <div className="flex items-center justify-between mt-auto">
                <span className="font-bebas text-[24px] text-[#C8201A] leading-none">
                  ${Number(product.price).toFixed(2)}
                </span>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenModal(product)}
                    className="w-8 h-8 rounded-full bg-[#FDFAF6] border border-[#E8D8C8] flex items-center justify-center text-[#555] hover:text-[#D4952A] hover:bg-[#D4952A]/10 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id, product.name)}
                    className="w-8 h-8 rounded-full bg-[#FDFAF6] border border-[#E8D8C8] flex items-center justify-center text-[#555] hover:text-[#C8201A] hover:bg-[#C8201A]/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-[#E8D8C8] p-6 flex justify-between items-center z-10">
              <h3 className="font-bebas text-[28px] tracking-wider text-[#1A1A1A] leading-none">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#FDFAF6] border border-[#E8D8C8] flex items-center justify-center text-[#555] hover:text-[#1A1A1A]"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                 <div>
                  <label className="block font-barlow text-[11px] font-700 uppercase tracking-[0.1em] text-[#555555] mb-2">Internal ID</label>
                  <input
                    required disabled={!!editingProduct}
                    value={formData.id} onChange={e => setFormData({ ...formData, id: e.target.value })}
                    className="w-full border border-[#E8D8C8] rounded-xl px-4 py-3 font-mono text-[13px] text-[#888888] disabled:bg-[#FDF8F2]"
                  />
                  <p className="text-[10px] text-[#AAAAAA] mt-1">E.g., pizza-margherita</p>
                </div>
                <div>
                  <label className="block font-barlow text-[11px] font-700 uppercase tracking-[0.1em] text-[#555555] mb-2">Category</label>
                  <select
                    value={formData.categoryId} onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full border border-[#E8D8C8] rounded-xl px-4 py-3 font-inter text-[14px] text-[#1A1A1A] focus:border-[#C8201A] outline-none"
                  >
                    {uniqueCategories.map((c: any) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-barlow text-[11px] font-700 uppercase tracking-[0.1em] text-[#555555] mb-2">Product Name</label>
                <input
                  required
                  value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-[#E8D8C8] rounded-xl px-4 py-3 font-inter text-[14px] text-[#1A1A1A] focus:border-[#C8201A] outline-none"
                  placeholder="E.g., Margherita"
                />
              </div>

              <div>
                <label className="block font-barlow text-[11px] font-700 uppercase tracking-[0.1em] text-[#555555] mb-2">Description</label>
                <textarea
                  value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-[#E8D8C8] rounded-xl px-4 py-3 font-inter text-[14px] text-[#1A1A1A] focus:border-[#C8201A] outline-none min-h-[100px]"
                  placeholder="Ingredients, taste, specifics..."
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block font-barlow text-[11px] font-700 uppercase tracking-[0.1em] text-[#555555] mb-2">Base Price ($)</label>
                  <input
                    required type="number" step="0.01" min="0"
                    value={formData.price} onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    className="w-full border border-[#E8D8C8] rounded-xl px-4 py-3 font-inter text-[14px] text-[#1A1A1A] focus:border-[#C8201A] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-barlow text-[11px] font-700 uppercase tracking-[0.1em] text-[#555555] mb-2">Image URL</label>
                  <input
                    required type="url"
                    value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })}
                    className="w-full border border-[#E8D8C8] rounded-xl px-4 py-3 font-inter text-[14px] text-[#1A1A1A] focus:border-[#C8201A] outline-none"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={formData.hasPizzaExtras} 
                    onChange={e => setFormData({ ...formData, hasPizzaExtras: e.target.checked })}
                    className="w-4 h-4 text-[#C8201A] rounded border-[#E8D8C8] focus:ring-[#C8201A]"
                  />
                  <span className="font-barlow text-[13px] font-700 uppercase tracking-widest text-[#555] group-hover:text-[#1A1A1A]">Enable Pizza Customization</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={formData.isFavorite} 
                    onChange={e => setFormData({ ...formData, isFavorite: e.target.checked })}
                    className="w-4 h-4 text-[#D4952A] rounded border-[#E8D8C8] focus:ring-[#D4952A]"
                  />
                  <span className="font-barlow text-[13px] font-700 uppercase tracking-widest text-[#555] group-hover:text-[#1A1A1A]">Mark as Popular</span>
                </label>
              </div>

              <div className="pt-6 border-t border-[#E8D8C8] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 rounded-xl border-2 border-[#E8D8C8] hover:bg-[#FDF8F2] font-barlow text-[13px] font-700 uppercase tracking-widest text-[#555555] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 rounded-xl bg-[#C8201A] hover:bg-[#9E1510] text-white font-barlow text-[13px] font-800 uppercase tracking-widest shadow-[0_8px_20px_rgba(200,32,26,0.3)] transition-colors"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

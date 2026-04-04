import { useEffect, useState } from 'react';
import { API_URL } from '../../config/api';
import { RefreshCw, Save, ImageIcon, Type } from 'lucide-react';

export default function ContentManager() {
  const [contentItems, setContentItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [savingCategory, setSavingCategory] = useState<string | null>(null);
  
  // Grouped content: { [section]: [{ key, value, type }, ...] }
  const [groupedContent, setGroupedContent] = useState<Record<string, any[]>>({});

  const fetchContent = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_URL}/api/admin/content`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setContentItems(data);
        
        // Group by section
        const grouped = data.reduce((acc: any, item: any) => {
          if (!acc[item.section]) acc[item.section] = [];
          acc[item.section].push({ ...item });
          return acc;
        }, {});
        setGroupedContent(grouped);
      }

      // Fetch Categories
      const catRes = await fetch(`${API_URL}/api/admin/categories`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (catRes.ok) {
        const catData = await catRes.json();
        setCategories(catData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleValueChange = (section: string, key: string, newValue: string) => {
    setGroupedContent(prev => ({
      ...prev,
      [section]: prev[section].map(item => 
        item.key === key ? { ...item, value: newValue } : item
      )
    }));
  };

  const handleSaveSection = async (section: string) => {
    setSavingSection(section);
    try {
      const token = localStorage.getItem('adminToken');
      const itemsToUpdate = groupedContent[section];
      
      // Update each item in the section sequentially
      for (const item of itemsToUpdate) {
        // Only update if changed
        const original = contentItems.find(c => c.section === item.section && c.key === item.key);
        if (original && original.value === item.value) continue;

        await fetch(`${API_URL}/api/admin/content`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ section: item.section, key: item.key, value: item.value, type: item.type })
        });
      }
      
      // Refresh to get clean state
      await fetchContent();
    } catch (err) {
      console.error(err);
      alert('Failed to save some content.');
    } finally {
      setSavingSection(null);
    }
  };

  const handleToggleCategory = async (id: string, currentStatus: boolean) => {
    setSavingCategory(id);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_URL}/api/admin/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });
      if (res.ok) {
        setCategories(prev => prev.map(c => c.id === id ? { ...c, isActive: !currentStatus } : c));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingCategory(null);
    }
  };

  if (loading) return <div className="p-12 text-center animate-spin text-[#C8201A]"><RefreshCw className="w-8 h-8 mx-auto" /></div>;

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="font-bebas text-[36px] tracking-wider text-[#1A1A1A] leading-none mb-2">
            App Content
          </h2>
          <p className="font-inter text-[14px] text-[#555555]">
            Manage all dynamic text, links, and images across the website.
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Category Management */}
        <div className="bg-white border border-[#E8D8C8] rounded-2xl overflow-hidden shadow-sm mb-8">
          <div className="bg-[#1A1A1A] p-5">
            <h3 className="font-bebas text-[24px] tracking-widest text-white uppercase leading-none mt-1">
              Storefront Categories
            </h3>
          </div>
          <div className="p-6 bg-[#FDFAF6]">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {categories.map(cat => (
                <div key={cat.id} className="bg-white border border-[#E8D8C8] p-4 rounded-xl flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-barlow text-[13px] font-700 uppercase tracking-widest text-[#1A1A1A]">
                      {cat.name}
                    </span>
                    <span className="font-inter text-[11px] text-[#888888]">
                      {cat.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <button
                    onClick={() => handleToggleCategory(cat.id, cat.isActive)}
                    disabled={savingCategory === cat.id}
                    className={`w-12 h-6 rounded-full transition-colors duration-200 relative ${cat.isActive ? 'bg-emerald-500' : 'bg-gray-300'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200 ${cat.isActive ? 'right-1' : 'left-1'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        {Object.entries(groupedContent).map(([section, items]) => (
          <div key={section} className="bg-white border border-[#E8D8C8] rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-[#1A1A1A] p-5 flex items-center justify-between">
              <h3 className="font-bebas text-[24px] tracking-widest text-white uppercase leading-none mt-1">
                {section} Section
              </h3>
              <button 
                onClick={() => handleSaveSection(section)}
                disabled={savingSection === section}
                className="flex items-center gap-2 bg-[#D4952A] hover:bg-[#b07b22] text-white font-barlow text-[12px] font-700 uppercase tracking-widest px-5 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {savingSection === section ? 'Saving...' : <><Save className="w-4 h-4" /> Save changes</>}
              </button>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#FDFAF6]">
              {items.map(item => (
                <div key={item.key} className="bg-white border border-[#E8D8C8] p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-3 border-b border-[#E8D8C8] pb-2">
                    {item.type === 'image' ? <ImageIcon className="w-4 h-4 text-[#D4952A]" /> : <Type className="w-4 h-4 text-[#C8201A]" />}
                    <p className="font-barlow text-[13px] font-700 uppercase tracking-widest text-[#555]">
                      {item.key.replace(/_/g, ' ')}
                    </p>
                    <span className="ml-auto font-mono text-[10px] bg-black/5 px-2 py-0.5 rounded text-[#888]">{item.type}</span>
                  </div>

                  {item.type === 'json' ? (
                    <textarea 
                      value={item.value}
                      onChange={(e) => handleValueChange(section, item.key, e.target.value)}
                      className="w-full font-mono text-[12px] text-[#1A1A1A] bg-[#FDF8F2] border border-[#E8D8C8] rounded-lg p-3 min-h-[120px] focus:outline-none focus:border-[#C8201A]"
                    />
                  ) : item.type === 'image' ? (
                    <div>
                      <input 
                        value={item.value}
                        onChange={(e) => handleValueChange(section, item.key, e.target.value)}
                        className="w-full font-inter text-[13px] text-[#1A1A1A] bg-[#FDF8F2] border border-[#E8D8C8] rounded-lg p-3 mb-2 focus:outline-none focus:border-[#C8201A]"
                      />
                      {item.value && item.value.startsWith('http') && (
                        <div className="h-24 w-full rounded-lg bg-gray-100 overflow-hidden border border-[#E8D8C8]">
                          <img src={item.value} alt={item.key} className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <textarea 
                      value={item.value}
                      onChange={(e) => handleValueChange(section, item.key, e.target.value)}
                      className="w-full font-inter text-[13px] text-[#1A1A1A] bg-[#FDF8F2] border border-[#E8D8C8] rounded-lg p-3 overflow-hidden resize-none min-h-[60px] focus:outline-none focus:border-[#C8201A]"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

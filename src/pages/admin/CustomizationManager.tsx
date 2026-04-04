import { useEffect, useState } from 'react';
import { API_URL } from '../../config/api';
import { 
  Pizza, IceCream, Plus, Trash2, Save, RefreshCw, 
  ChevronDown, ChevronUp, PlusCircle
} from 'lucide-react';

interface Option {
  name: string;
  price: number;
}

interface PizzaExtra {
  id: string;
  name: string;
  options: Option[];
}

interface IceCreamOptions {
  scoops: { label: string; price: number }[];
  flavours: string[];
  toppings: string[];
  sauces: string[];
}

export default function CustomizationManager() {
  const [pizzaExtras, setPizzaExtras] = useState<PizzaExtra[]>([]);
  const [iceCreamOptions, setIceCreamOptions] = useState<IceCreamOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingPizza, setSavingPizza] = useState<string | null>(null);
  const [savingIceCream, setSavingIceCream] = useState(false);
  const [openPizzaId, setOpenPizzaId] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch Pizza Extras
      const pizzaRes = await fetch(`${API_URL}/api/admin/pizza-extras`, { headers });
      if (pizzaRes.ok) setPizzaExtras(await pizzaRes.json());

      // Fetch Ice Cream via Content API
      const contentRes = await fetch(`${API_URL}/api/admin/content`, { headers });
      if (contentRes.ok) {
        const content = await contentRes.json();
        const icScoops = content.find((c: any) => c.section === 'icecream' && c.key === 'scoops');
        const icFlavours = content.find((c: any) => c.section === 'icecream' && c.key === 'flavours');
        const icToppings = content.find((c: any) => c.section === 'icecream' && c.key === 'toppings');
        const icSauces = content.find((c: any) => c.section === 'icecream' && c.key === 'sauces');

        setIceCreamOptions({
          scoops: icScoops ? JSON.parse(icScoops.value) : [],
          flavours: icFlavours ? JSON.parse(icFlavours.value) : [],
          toppings: icToppings ? JSON.parse(icToppings.value) : [],
          sauces: icSauces ? JSON.parse(icSauces.value) : []
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ── Pizza Extra Handlers ─────────────────────────────────────────────────────
  const handleUpdatePizzaOption = (extraId: string, index: number, field: keyof Option, value: string | number) => {
    setPizzaExtras(prev => prev.map(extra => {
      if (extra.id !== extraId) return extra;
      const newOptions = [...extra.options];
      newOptions[index] = { ...newOptions[index], [field]: value };
      return { ...extra, options: newOptions };
    }));
  };

  const handleAddPizzaOption = (extraId: string) => {
    setPizzaExtras(prev => prev.map(extra => {
      if (extra.id !== extraId) return extra;
      return { ...extra, options: [...extra.options, { name: 'New Option', price: 1.5 }] };
    }));
  };

  const handleRemovePizzaOption = (extraId: string, index: number) => {
    setPizzaExtras(prev => prev.map(extra => {
      if (extra.id !== extraId) return extra;
      return { ...extra, options: extra.options.filter((_, i) => i !== index) };
    }));
  };

  const handleSavePizzaExtra = async (extra: PizzaExtra) => {
    setSavingPizza(extra.id);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_URL}/api/admin/pizza-extras/${extra.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ options: extra.options })
      });
      if (!res.ok) alert('Failed to save');
    } catch (err) {
      console.error(err);
    } finally {
      setSavingPizza(null);
    }
  };

  // ── Ice Cream Handlers ───────────────────────────────────────────────────────
  const handleUpdateIceCreamList = (key: keyof IceCreamOptions, index: number, value: any) => {
    if (!iceCreamOptions) return;
    const newList = [...iceCreamOptions[key]];
    newList[index] = value;
    setIceCreamOptions({ ...iceCreamOptions, [key]: newList });
  };

  const handleAddItemToIceCreamList = (key: keyof IceCreamOptions, defaultValue: any) => {
    if (!iceCreamOptions) return;
    setIceCreamOptions({ ...iceCreamOptions, [key]: [...iceCreamOptions[key], defaultValue] });
  };

  const handleRemoveItemFromIceCreamList = (key: keyof IceCreamOptions, index: number) => {
    if (!iceCreamOptions) return;
    setIceCreamOptions({ ...iceCreamOptions, [key]: iceCreamOptions[key].filter((_, i) => i !== index) });
  };

  const handleSaveIceCream = async () => {
    if (!iceCreamOptions) return;
    setSavingIceCream(true);
    try {
      const token = localStorage.getItem('adminToken');
      const keys: (keyof IceCreamOptions)[] = ['scoops', 'flavours', 'toppings', 'sauces'];
      
      for (const key of keys) {
        await fetch(`${API_URL}/api/admin/content`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ 
            section: 'icecream', 
            key, 
            value: JSON.stringify(iceCreamOptions[key]),
            type: 'json'
          })
        });
      }
      alert('Ice Cream options saved!');
    } catch (err) {
      console.error(err);
    } finally {
      setSavingIceCream(false);
    }
  };

  if (loading) return <div className="p-12 text-center animate-spin text-[#C8201A]"><RefreshCw className="w-8 h-8 mx-auto" /></div>;

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in pb-20">
      <div className="mb-8">
        <h2 className="font-bebas text-[36px] tracking-wider text-[#1A1A1A] leading-none mb-2">
          Customization Options
        </h2>
        <p className="font-inter text-[14px] text-[#555555]">
          Manage extras for Pizzas and build-your-own options for Ice Cream.
        </p>
      </div>

      <div className="space-y-12">
        
        {/* ── Pizza Customization Section ────────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#C8201A]/10 flex items-center justify-center">
              <Pizza className="w-5 h-5 text-[#C8201A]" />
            </div>
            <h3 className="font-bebas text-[28px] tracking-widest text-[#1A1A1A] leading-none mt-1 uppercase">
              Pizza Customization
            </h3>
          </div>

          <div className="space-y-4">
            {pizzaExtras.map(extra => (
              <div key={extra.id} className="bg-white border border-[#E8D8C8] rounded-2xl overflow-hidden shadow-sm">
                <button 
                  onClick={() => setOpenPizzaId(openPizzaId === extra.id ? null : extra.id)}
                  className="w-full flex items-center justify-between p-5 bg-[#FDF8F2] hover:bg-[#F5EDE0] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-barlow text-[16px] font-700 uppercase tracking-widest text-[#1A1A1A]">
                      {extra.name}
                    </span>
                    <span className="bg-black/5 px-2 py-0.5 rounded text-[10px] font-mono text-[#888]">
                      {extra.options.length} options
                    </span>
                  </div>
                  {openPizzaId === extra.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>

                {openPizzaId === extra.id && (
                  <div className="p-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
                    <div className="space-y-3">
                      {extra.options.map((opt, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <input 
                            type="text" 
                            value={opt.name}
                            onChange={(e) => handleUpdatePizzaOption(extra.id, idx, 'name', e.target.value)}
                            className="flex-1 border border-[#E8D8C8] rounded-lg px-4 py-2 text-[14px] focus:outline-none focus:border-[#C8201A]"
                            placeholder="Option Name"
                          />
                          <div className="relative w-28">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888] text-[14px]">$</span>
                            <input 
                              type="number" step="0.1"
                              value={opt.price}
                              onChange={(e) => handleUpdatePizzaOption(extra.id, idx, 'price', parseFloat(e.target.value))}
                              className="w-full border border-[#E8D8C8] rounded-lg pl-6 pr-3 py-2 text-[14px] focus:outline-none focus:border-[#C8201A]"
                            />
                          </div>
                          <button 
                            onClick={() => handleRemovePizzaOption(extra.id, idx)}
                            className="p-2 text-[#888] hover:text-[#C8201A] transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-[#E8D8C8]">
                      <button 
                        onClick={() => handleAddPizzaOption(extra.id)}
                        className="flex items-center gap-2 text-[#D4952A] hover:text-[#b07b22] font-barlow text-[12px] font-700 uppercase tracking-widest transition-colors"
                      >
                        <PlusCircle className="w-4 h-4" /> Add Option
                      </button>
                      <button 
                        onClick={() => handleSavePizzaExtra(extra)}
                        disabled={savingPizza === extra.id}
                        className="flex items-center gap-2 bg-[#C8201A] hover:bg-[#9E1510] text-white font-barlow text-[12px] font-700 uppercase tracking-widest px-6 py-2.5 rounded-xl transition-colors disabled:opacity-50"
                      >
                        {savingPizza === extra.id ? 'Saving...' : <><Save className="w-4 h-4" /> Save {extra.name}</>}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── Ice Cream Customization Section ────────────────────────────────── */}
        {iceCreamOptions && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#D4952A]/10 flex items-center justify-center">
                  <IceCream className="w-5 h-5 text-[#D4952A]" />
                </div>
                <h3 className="font-bebas text-[28px] tracking-widest text-[#1A1A1A] leading-none mt-1 uppercase">
                  Ice Cream Customization
                </h3>
              </div>
              <button 
                onClick={handleSaveIceCream}
                disabled={savingIceCream}
                className="flex items-center gap-2 bg-[#D4952A] hover:bg-[#b07b22] text-white font-barlow text-[12px] font-700 uppercase tracking-widest px-8 py-3 rounded-xl transition-colors shadow-lg shadow-[#D4952A]/20 disabled:opacity-50"
              >
                {savingIceCream ? 'Saving...' : <><Save className="w-4 h-4" /> Save All Ice Cream</>}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Scoops Management */}
              <div className="bg-white border border-[#E8D8C8] rounded-2xl p-6 shadow-sm">
                <h4 className="font-barlow text-[14px] font-700 uppercase tracking-widest text-[#1A1A1A] mb-4 border-b border-[#E8D8C8] pb-2">
                  Scoop Pricing
                </h4>
                <div className="space-y-3 mb-4">
                  {iceCreamOptions.scoops.map((s, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input 
                        value={s.label}
                        onChange={(e) => handleUpdateIceCreamList('scoops', idx, { ...s, label: e.target.value })}
                        className="flex-1 border border-[#E8D8C8] rounded-lg px-3 py-1.5 text-[13px]"
                      />
                      <input 
                        type="number" step="0.5"
                        value={s.price}
                        onChange={(e) => handleUpdateIceCreamList('scoops', idx, { ...s, price: parseFloat(e.target.value) })}
                        className="w-16 border border-[#E8D8C8] rounded-lg px-3 py-1.5 text-[13px]"
                      />
                      <button onClick={() => handleRemoveItemFromIceCreamList('scoops', idx)} className="text-[#888] hover:text-[#C8201A]"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => handleAddItemToIceCreamList('scoops', { label: 'New Scoop', price: 5 })}
                  className="text-[#D4952A] text-[12px] font-700 uppercase tracking-widest flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Scoop
                </button>
              </div>

              {/* Flavours Management */}
              <div className="bg-white border border-[#E8D8C8] rounded-2xl p-6 shadow-sm">
                <h4 className="font-barlow text-[14px] font-700 uppercase tracking-widest text-[#1A1A1A] mb-4 border-b border-[#E8D8C8] pb-2">
                  Available Flavours
                </h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  {iceCreamOptions.flavours.map((f, idx) => (
                    <div key={idx} className="flex items-center bg-[#FDF8F2] border border-[#E8D8C8] rounded-lg pl-3 pr-1 py-1 gap-2">
                      <input 
                        value={f}
                        onChange={(e) => handleUpdateIceCreamList('flavours', idx, e.target.value)}
                        className="bg-transparent border-none p-0 text-[13px] outline-none w-24"
                      />
                      <button onClick={() => handleRemoveItemFromIceCreamList('flavours', idx)} className="text-[#888] hover:text-[#C8201A]"><Plus className="w-3.5 h-3.5 rotate-45" /></button>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => handleAddItemToIceCreamList('flavours', 'New Flavour')}
                  className="text-[#D4952A] text-[12px] font-700 uppercase tracking-widest flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Flavour
                </button>
              </div>

              {/* Toppings Management */}
              <div className="bg-white border border-[#E8D8C8] rounded-2xl p-6 shadow-sm">
                <h4 className="font-barlow text-[14px] font-700 uppercase tracking-widest text-[#1A1A1A] mb-4 border-b border-[#E8D8C8] pb-2">
                  Toppings (+75c)
                </h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  {iceCreamOptions.toppings.map((t, idx) => (
                    <div key={idx} className="flex items-center bg-[#FDF8F2] border border-[#E8D8C8] rounded-lg pl-3 pr-1 py-1 gap-2">
                      <input 
                        value={t}
                        onChange={(e) => handleUpdateIceCreamList('toppings', idx, e.target.value)}
                        className="bg-transparent border-none p-0 text-[13px] outline-none w-24"
                      />
                      <button onClick={() => handleRemoveItemFromIceCreamList('toppings', idx)} className="text-[#888] hover:text-[#C8201A]"><Plus className="w-3.5 h-3.5 rotate-45" /></button>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => handleAddItemToIceCreamList('toppings', 'New Topping')}
                  className="text-[#D4952A] text-[12px] font-700 uppercase tracking-widest flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Topping
                </button>
              </div>

              {/* Sauces Management */}
              <div className="bg-white border border-[#E8D8C8] rounded-2xl p-6 shadow-sm">
                <h4 className="font-barlow text-[14px] font-700 uppercase tracking-widest text-[#1A1A1A] mb-4 border-b border-[#E8D8C8] pb-2">
                  Sauces (Free)
                </h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  {iceCreamOptions.sauces.map((s, idx) => (
                    <div key={idx} className="flex items-center bg-[#FDF8F2] border border-[#E8D8C8] rounded-lg pl-3 pr-1 py-1 gap-2">
                      <input 
                        value={s}
                        onChange={(e) => handleUpdateIceCreamList('sauces', idx, e.target.value)}
                        className="bg-transparent border-none p-0 text-[13px] outline-none w-24"
                      />
                      <button onClick={() => handleRemoveItemFromIceCreamList('sauces', idx)} className="text-[#888] hover:text-[#C8201A]"><Plus className="w-3.5 h-3.5 rotate-45" /></button>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => handleAddItemToIceCreamList('sauces', 'New Sauce')}
                  className="text-[#D4952A] text-[12px] font-700 uppercase tracking-widest flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Sauce
                </button>
              </div>

            </div>
          </section>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { API_URL } from '../../config/api';
import { RefreshCw, FileText, Printer, CheckSquare, Square } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function InvoicesManager() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoices, setSelectedInvoices] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_URL}/api/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
          navigate('/admin/login');
          return;
        }
        return;
      }
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [navigate]);

  const toggleSelection = (orderId: string) => {
    const newSelection = new Set(selectedInvoices);
    if (newSelection.has(orderId)) {
      newSelection.delete(orderId);
    } else {
      newSelection.add(orderId);
    }
    setSelectedInvoices(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedInvoices.size === orders.length && orders.length > 0) {
      setSelectedInvoices(new Set());
    } else {
      setSelectedInvoices(new Set(orders.map(o => o.id)));
    }
  };

  const handlePrint = () => {
    if (selectedInvoices.size === 0) {
      alert("Please select at least one invoice to print.");
      return;
    }
    window.print();
  };

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C8201A]"></div>
      </div>
    );
  }

  // Get only the selected orders for printing
  const printOrders = orders.filter(o => selectedInvoices.has(o.id));

  return (
    <>
      <div className="max-w-6xl mx-auto animate-in fade-in duration-500 print:hidden">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="font-bebas text-[36px] tracking-wider text-[#1A1A1A] leading-none mb-2">
              Invoices Manager
            </h2>
            <p className="font-inter text-[14px] text-[#555555]">
              Select orders to print or download as thermal-style receipts.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => { setLoading(true); fetchOrders(); }}
              className="flex items-center gap-2 bg-[#FDFAF6] border border-[#E8D8C8] hover:bg-[#F0E8DC] text-[#1A1A1A] font-barlow text-[12px] font-700 uppercase tracking-widest px-4 py-2 rounded-xl transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
            <button 
              onClick={handlePrint}
              disabled={selectedInvoices.size === 0}
              className="flex items-center gap-2 bg-[#1A1A1A] text-white hover:bg-black font-barlow text-[12px] font-700 uppercase tracking-widest px-6 py-2 rounded-xl transition-all disabled:opacity-50"
            >
              <Printer className="w-4 h-4" /> Print Selected ({selectedInvoices.size})
            </button>
          </div>
        </div>

        <div className="bg-white border border-[#E8D8C8] rounded-2xl overflow-hidden shadow-sm">
          {/* Header Row */}
          <div className="bg-[#FDFAF6] border-b border-[#E8D8C8] p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={toggleSelectAll} className="text-[#1A1A1A] hover:text-[#C8201A] transition-colors p-1">
                {selectedInvoices.size === orders.length && orders.length > 0 ? (
                  <CheckSquare className="w-6 h-6 text-[#C8201A]" />
                ) : (
                  <Square className="w-6 h-6 text-[#888888]" />
                )}
              </button>
              <span className="font-barlow text-[14px] font-700 uppercase tracking-wider text-[#1A1A1A]">
                Select All
              </span>
            </div>
          </div>

          {/* Orders List */}
          <div className="divide-y divide-[#E8D8C8] max-h-[60vh] overflow-y-auto">
            {orders.map((order) => (
              <div 
                key={order.id} 
                className={`p-4 flex items-center justify-between hover:bg-[#FDFAF6] transition-colors cursor-pointer ${selectedInvoices.has(order.id) ? 'bg-[#FAECE8]' : ''}`}
                onClick={() => toggleSelection(order.id)}
              >
                <div className="flex items-center gap-5">
                  <div className="p-1">
                    {selectedInvoices.has(order.id) ? (
                      <CheckSquare className="w-6 h-6 text-[#C8201A]" />
                    ) : (
                      <Square className="w-6 h-6 text-[#AAAAAA]" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="bg-[#1A1A1A] text-white font-mono text-[13px] font-700 px-2 py-0.5 rounded shadow-inner">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                      <span className="font-barlow text-[15px] font-700 text-[#1A1A1A]">
                        {order.customerName || (order.user?.name?.toLowerCase() === 'guest' ? `Guest (#${order.id.slice(0, 5).toUpperCase()})` : order.user?.name)}
                      </span>
                    </div>
                    <div className="text-[13px] text-[#555555] font-inter">
                      {new Date(order.createdAt).toLocaleString()} • {order.orderItems.length} items
                    </div>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <span className={`inline-block px-2 py-0.5 rounded-full font-barlow text-[10px] font-700 uppercase tracking-widest bg-[#E8D8C8] text-[#555555]`}>
                    {order.paymentStatus || 'Pending'}
                  </span>
                  <div className="font-bebas text-[22px] text-[#C8201A] leading-none">
                    ${Number(order.totalAmount).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
            
            {orders.length === 0 && !loading && (
              <div className="p-12 text-center text-[#888888]">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="font-bebas text-[24px] text-[#1A1A1A] tracking-wider mb-2">No orders available</h3>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Printable Area - Hidden on screen, shown when printing */}
      <div className="hidden print:block font-sans text-black w-full max-w-full">
        {printOrders.map((order, idx) => {
          const customerCode = order.id.slice(0, 5).toUpperCase(); // Short code for the user

          return (
            <div key={order.id} className={`w-[320px] mx-auto bg-white p-4 ${idx > 0 ? 'mt-12 [page-break-before:always]' : ''}`}>
              {/* Receipt Header */}
              <div className="flex justify-between items-center mb-2 border-b-2 border-black pb-2">
                <h1 className="text-[20px] font-extrabold tracking-tight">Brent Street Pizza</h1>
                <span className="text-[18px] font-normal tracking-wide">DELIVERY</span>
              </div>

              {/* Customer ID Banner */}
              <div className="bg-black text-white px-2 py-1.5 flex justify-between items-center font-bold text-[22px] tracking-wide mb-3">
                <span className="flex-1">
                  {order.customerName || (order.user?.name?.toLowerCase() === 'guest' ? `Guest (#${order.id.slice(0, 5).toUpperCase()})` : order.user?.name)}
                </span>
                <span className="ml-2 shrink-0">{customerCode}</span>
              </div>

              <div className="mb-4 text-[15px] font-bold leading-tight border-b-2 border-black pb-4">
                <p>PHONE: {order.customerPhone || order.user?.phone || 'N/A'}</p>
              </div>

              {/* Items List */}
              <div className="space-y-4 text-[15px] font-semibold border-b-2 border-black pb-4">
                {order.orderItems.map((item: any, i: number) => {
                  return (
                    <div key={i} className="flex flex-col">
                      <div className="flex justify-between items-start">
                        <span className="mr-2">{item.quantity} x {item.product.name} {item.size ? `(${item.size})` : ''}</span>
                        <span>${Number(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                      
                      {/* Choices / Modifications */}
                      {((item.removedToppings && item.removedToppings.length > 0) || (item.addedExtras && item.addedExtras.length > 0)) && (
                        <div className="ml-4 mt-1 space-y-1 text-[13px] font-normal">
                          {item.removedToppings && item.removedToppings.length > 0 && (
                            <>
                              <div className="text-gray-600 uppercase tracking-wide text-[11px] font-semibold mt-1">Removed Toppings</div>
                              <div className="flex justify-between items-center">
                                <span>1x {item.removedToppings.join(', ')}</span>
                                <span>$0.00</span>
                              </div>
                            </>
                          )}
                          
                          {item.addedExtras && item.addedExtras.length > 0 && (
                            <>
                              <div className="text-gray-600 uppercase tracking-wide text-[11px] font-semibold mt-1">Add Extras</div>
                              {item.addedExtras.map((ex: any, exIdx: number) => (
                                <div key={exIdx} className="flex justify-between items-center">
                                  <span>1x {ex.name}</span>
                                  <span>${Number(ex.price).toFixed(2)}</span>
                                </div>
                              ))}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Totals Section */}
              <div className="mt-4 border-b-2 border-black pb-4 space-y-1 text-[15px] font-semibold">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${Number(order.totalAmount).toFixed(2)}</span>
                </div>
                {/* Ignoring special offers since we don't track them granularly here, but structure allows it */}
                <div className="flex justify-between font-bold text-[18px] pt-1">
                  <span>Amount paid</span>
                  <span>${Number(order.totalAmount).toFixed(2)}</span>
                </div>
              </div>



              {/* Footer */}
              <div className="mt-4 text-center text-[12px] font-medium italic px-4 pb-8">
                Thank you for ordering from Brent Street Pizza (Admin)
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

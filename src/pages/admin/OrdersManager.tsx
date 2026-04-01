import { useEffect, useState } from 'react';
import { API_URL } from '../../config/api';
import { RefreshCw, MapPin, Phone, ChefHat, Bike, CheckCircle2, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function OrdersManager() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_URL}/api/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) navigate('/admin/login');
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
    // Auto refresh every 30 seconds
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [navigate]);

  const handleUpdateStatus = async (orderId: string, status: string, paymentStatus?: string) => {
    setUpdating(orderId);
    try {
      const token = localStorage.getItem('adminToken');
      const payload: any = { status };
      if (paymentStatus) payload.paymentStatus = paymentStatus;

      const res = await fetch(`${API_URL}/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) fetchOrders();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C8201A]"></div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Preparing': return <ChefHat className="w-4 h-4" />;
      case 'Out for Delivery': return <Bike className="w-4 h-4" />;
      case 'Delivered': return <CheckCircle2 className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="font-bebas text-[36px] tracking-wider text-[#1A1A1A] leading-none mb-2">
            Orders Manager
          </h2>
          <p className="font-inter text-[14px] text-[#555555]">
            View and manage all customer orders in real-time.
          </p>
        </div>
        <button 
          onClick={() => { setLoading(true); fetchOrders(); }}
          className="flex items-center gap-2 bg-[#FDFAF6] border border-[#E8D8C8] hover:bg-[#F0E8DC] text-[#1A1A1A] font-barlow text-[12px] font-700 uppercase tracking-widest px-4 py-2 rounded-xl transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white border border-[#E8D8C8] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            {/* Order Header */}
            <div className="bg-[#FDFAF6] border-b border-[#E8D8C8] p-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-[#1A1A1A] text-white font-mono text-[16px] font-700 px-3 py-1.5 rounded-lg shadow-inner">
                  #{order.id.slice(0, 8).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-barlow text-[16px] font-700 text-[#1A1A1A]">{order.user.name}</h3>
                  <div className="flex items-center gap-3 text-[#555555] font-inter text-[13px] mt-0.5">
                    <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {order.user.phone || 'N/A'}</span>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-barlow text-[10px] font-700 uppercase tracking-widest
                      ${order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' : 
                        order.status === 'Preparing' ? 'bg-[#D4952A]/10 text-[#D4952A]' : 
                        'bg-[#E8D8C8] text-[#555555]'}`}
                    >
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-barlow text-[10px] font-700 uppercase tracking-widest
                  ${order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' : 
                    order.status === 'Preparing' ? 'bg-[#D4952A]/10 text-[#D4952A]' : 
                    'bg-[#E8D8C8] text-[#555555]'}`}
                >
                  {getStatusIcon(order.status)}
                  {order.status}
                </span>
                <div className="text-right">
                  <p className="font-barlow text-[11px] font-700 uppercase tracking-widest text-[#888888] mb-0.5">Total</p>
                  <p className="font-bebas text-[28px] text-[#C8201A] leading-none">${Number(order.totalAmount).toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Order Body */}
            <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Items List */}
              <div className="md:col-span-2 space-y-3">
                <p className="font-barlow text-[11px] font-700 uppercase tracking-widest text-[#C8201A] mb-2 border-b border-[#E8D8C8] pb-2">
                  Order Items ({order.orderItems.length})
                </p>
                <div className="space-y-3 max-h-[160px] overflow-y-auto pr-2">
                  {order.orderItems.map((item: any) => (
                    <div key={item.id} className="flex gap-3 text-[14px]">
                      <span className="font-barlow font-700 text-[#1A1A1A] w-6 flex-shrink-0 text-right">{item.quantity}x</span>
                      <div className="flex-1 font-inter">
                        <p className="font-medium text-[#1A1A1A]">{item.product.name} {item.size ? `(${item.size})` : ''}</p>
                        {item.removedToppings?.length > 0 && <p className="text-[12px] text-[#C8201A] italic">No {item.removedToppings.join(', ')}</p>}
                        {item.addedExtras?.length > 0 && <p className="text-[12px] text-[#D4952A]">+ {item.addedExtras.map((e:any)=>e.name).join(', ')}</p>}
                      </div>
                      <span className="font-barlow font-700">${Number(item.price).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Controls */}
              <div className="space-y-5 bg-[#FDFAF6] rounded-xl p-4 border border-[#E8D8C8]">
                 <div>
                  <p className="font-barlow text-[11px] font-700 uppercase tracking-[0.2em] text-[#555555] mb-2">Delivery Details</p>
                  <p className="font-inter text-[13px] text-[#1A1A1A] flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#C8201A] flex-shrink-0 mt-0.5" />
                    {order.payments?.[0]?.provider === 'Stripe' ? 'Online Order' : 'Cash Order'}<br/>
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="font-barlow text-[11px] font-700 uppercase tracking-[0.2em] text-[#555555] mb-2">Order Progress</p>
                  <select
                    disabled={updating === order.id}
                    value={order.status}
                    onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                    className="w-full bg-white border border-[#E8D8C8] rounded-lg px-3 py-2 font-inter text-[14px] text-[#1A1A1A] focus:outline-none focus:border-[#C8201A] disabled:opacity-50 transition-colors"
                  >
                    <option value="Placed">Placed (New)</option>
                    <option value="Preparing">Preparing</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Ready for Pickup">Ready for Pickup</option>
                    <option value="Delivered">Delivered / Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <p className="font-barlow text-[11px] font-700 uppercase tracking-[0.2em] text-[#555555] mb-2">Payment Status</p>
                  <select
                    disabled={updating === order.id}
                    value={order.paymentStatus}
                    onChange={(e) => handleUpdateStatus(order.id, order.status, e.target.value)}
                    className="w-full bg-white border border-[#E8D8C8] rounded-lg px-3 py-2 font-inter text-[14px] text-[#1A1A1A] focus:outline-none focus:border-[#C8201A] disabled:opacity-50 transition-colors"
                  >
                    <option value="Pending">Pending (COD/Unpaid)</option>
                    <option value="Paid">Paid Online</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        ))}
        {orders.length === 0 && !loading && (
          <div className="bg-white border-2 border-dashed border-[#E8D8C8] rounded-3xl p-12 text-center text-[#888888]">
            <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="font-bebas text-[28px] text-[#1A1A1A] tracking-wider leading-none mb-2">No active orders</h3>
            <p className="font-inter text-[15px]">When customers place orders, they will appear here in real-time.</p>
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { API_URL } from '../../config/api';
import { ShoppingBag, Users, Pizza, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardStats {
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  totalRevenue: number;
  recentOrders: any[];
}

export default function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await fetch(`${API_URL}/api/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            navigate('/admin/login');
            return;
          }
          throw new Error('Failed to fetch stats');
        }
        
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [navigate]);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C8201A]"></div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Sales', value: `$${Number(stats.totalRevenue).toFixed(2)}`, icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Total Orders', value: stats.totalOrders.toString(), icon: ShoppingBag, color: 'text-[#C8201A]', bg: 'bg-[#C8201A]/10' },
    { label: 'Active Products', value: stats.totalProducts.toString(), icon: Pizza, color: 'text-[#D4952A]', bg: 'bg-[#D4952A]/10' },
    { label: 'Registered Users', value: stats.totalUsers.toString(), icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  ];

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="font-bebas text-[36px] tracking-wider text-[#1A1A1A] leading-none mb-2">
          Dashboard Overview
        </h2>
        <p className="font-inter text-[14px] text-[#555555]">
          Welcome back. Here is the latest activity on Brent Street Pizza.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((card, idx) => (
          <div key={idx} className="bg-white border border-[#E8D8C8] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.bg}`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
            </div>
            <p className="font-barlow text-[13px] font-700 uppercase tracking-widest text-[#888888] mb-1">
              {card.label}
            </p>
            <h3 className="font-bebas text-[32px] text-[#1A1A1A] leading-none">
              {card.value}
            </h3>
          </div>
        ))}
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white border border-[#E8D8C8] rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#E8D8C8] flex items-center justify-between">
          <h3 className="font-bebas text-[24px] tracking-wider text-[#1A1A1A] leading-none mt-1">
            Recent Orders
          </h3>
          <button onClick={() => navigate('/admin/orders')} className="font-barlow text-[12px] font-700 uppercase tracking-widest text-[#C8201A] hover:text-[#9E1510] transition-colors">
            View All
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#FDFAF6] border-b border-[#E8D8C8]">
              <tr>
                <th className="px-6 py-4 font-barlow text-[11px] font-700 uppercase tracking-widest text-[#888888]">Order ID</th>
                <th className="px-6 py-4 font-barlow text-[11px] font-700 uppercase tracking-widest text-[#888888]">Customer</th>
                <th className="px-6 py-4 font-barlow text-[11px] font-700 uppercase tracking-widest text-[#888888]">Date</th>
                <th className="px-6 py-4 font-barlow text-[11px] font-700 uppercase tracking-widest text-[#888888]">Status</th>
                <th className="px-6 py-4 font-barlow text-[11px] font-700 uppercase tracking-widest text-[#888888] text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8D8C8]">
              {stats.recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-[#888888] font-inter text-[14px]">
                    No recent orders found.
                  </td>
                </tr>
              ) : (
                stats.recentOrders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-[#FDFAF6] transition-colors">
                    <td className="px-6 py-4 font-mono text-[13px] text-[#555555]">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-barlow text-[14px] font-700 text-[#1A1A1A]">{order.user.name}</p>
                      <p className="font-inter text-[12px] text-[#888888]">{order.user.email}</p>
                    </td>
                    <td className="px-6 py-4 font-inter text-[13px] text-[#555555]">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full font-barlow text-[10px] font-700 uppercase tracking-widest
                        ${order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' : 
                          order.status === 'Preparing' ? 'bg-[#D4952A]/10 text-[#D4952A]' : 
                          'bg-[#E8D8C8] text-[#555555]'}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-barlow text-[15px] font-700 text-[#1A1A1A] text-right">
                      ${Number(order.totalAmount).toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

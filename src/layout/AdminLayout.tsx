import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, ShoppingBag, Pizza, Image as ImageIcon, 
  LogOut, ShieldAlert, ChevronRight, Menu as MenuIcon, X, Sliders, Layout
} from 'lucide-react';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const userStr = localStorage.getItem('adminUser');
    
    if (!token || !userStr) {
      navigate('/admin/login');
      return;
    }

    try {
      const user = JSON.parse(userStr);
      if (user?.role === 'ADMIN') {
        setIsAdmin(true);
      } else {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/admin/login');
      }
    } catch {
      navigate('/admin/login');
    }
  }, [navigate]);

  if (isAdmin === null) {
    return <div className="min-h-screen bg-[#FDF8F2] flex items-center justify-center">Loading...</div>;
  }

  const handleLogout = () => {
    // Clear Admin Session
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    
    // Clear Public/Guest Session for "total logout"
    localStorage.removeItem('pizza_token');
    
    // Smooth redirect to home page
    navigate('/');
  };

  const navItems = [
    { name: 'Overview', path: '/admin/overview', icon: LayoutDashboard },
    { name: 'Orders Manager', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Product Catalog', path: '/admin/products', icon: Pizza },
    { name: 'App Content', path: '/admin/content', icon: ImageIcon },
    { name: 'Categories', path: '/admin/categories', icon: Layout },
    { name: 'Customizations', path: '/admin/customizations', icon: Sliders },
  ];

  return (
    <div className="min-h-screen bg-[#FDF8F2] flex font-inter">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen z-50
        w-[280px] bg-[#1A1A1A] text-white flex flex-col transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo/Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <h1 className="font-bebas text-[32px] tracking-wider text-[#D4952A] leading-none mb-1">
              Admin Panel
            </h1>
            <p className="font-barlow text-[10px] font-700 uppercase tracking-widest text-[#AAAAAA] flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-[#C8201A]" /> Brent Street Pizza
            </p>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 text-[#AAAAAA] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <p className="font-barlow text-[11px] font-700 uppercase tracking-[0.2em] text-[#555555] px-4 py-2 mb-2">
            Main Menu
          </p>
          
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (location.pathname.startsWith(item.path) && item.path !== '/admin/overview');

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 group
                  ${isActive 
                    ? 'bg-[#C8201A] text-white shadow-lg shadow-[#C8201A]/20' 
                    : 'text-[#AAAAAA] hover:bg-white/5 hover:text-white'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-[#D4952A] group-hover:scale-110 transition-transform'}`} />
                  <span className="font-barlow text-[14px] font-700 uppercase tracking-wider">
                    {item.name}
                  </span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 opacity-70" />}
              </Link>
            )
          })}
        </nav>

        {/* User Info / Logout */}
        <div className="p-4 border-t border-white/10">
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#C8201A] flex items-center justify-center font-bebas text-[20px] text-white tracking-widest leading-none">
                A
              </div>
              <div>
                <p className="font-barlow text-[13px] font-700 uppercase tracking-wider text-white">Administrator</p>
                <p className="font-inter text-[11px] text-[#25D366]">Online</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-transparent border border-white/20 hover:border-white/50 text-[#AAAAAA] hover:text-white font-barlow text-[12px] font-700 uppercase tracking-widest py-2.5 rounded-lg transition-all"
            >
              <LogOut className="w-4 h-4" /> Secure Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 max-h-screen overflow-y-auto">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-30 bg-[#1A1A1A] text-white p-4 flex items-center justify-between shadow-md">
          <h1 className="font-bebas text-[24px] tracking-wider text-[#D4952A] leading-none mt-1">
            Admin Panel
          </h1>
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-1 text-white hover:text-[#D4952A] transition-colors"
          >
            <MenuIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Page Content injected here */}
        <div className="p-4 md:p-8 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Navbar from './layout/Navbar';
import Footer from './layout/Footer';
import MobileCTABar from './layout/MobileCTABar';
import { CartProvider } from './context/CartContext';
import { MenuProvider } from './context/MenuContext';
import { ContentProvider } from './context/ContentContext';

// Public Pages
import Home from './pages/Home';
import Menu from './pages/Menu';
import ContactUs from './pages/ContactUs';
import About from './pages/About';
import Deals from './pages/Deals';
import IceCream from './pages/IceCream';
import Checkout from './pages/Checkout';

// Admin Pages
import AdminLayout from './layout/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import DashboardOverview from './pages/admin/DashboardOverview';
import OrdersManager from './pages/admin/OrdersManager';
import ProductManager from './pages/admin/ProductManager';
import ContentManager from './pages/admin/ContentManager';
import CustomizationManager from './pages/admin/CustomizationManager';
import CategoryManager from './components/admin/CategoryManager';

function AdminRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('adminToken');
  const userStr = localStorage.getItem('adminUser');
  let isAdmin = false;

  if (token && userStr) {
    try {
      const user = JSON.parse(userStr);
      isAdmin = user?.role === 'ADMIN';
    } catch {
      isAdmin = false;
    }
  }

  return isAdmin ? <>{children}</> : <Navigate to="/admin/login" replace />;
}

function GuestAdminRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('adminToken');
  const userStr = localStorage.getItem('adminUser');
  let isAdmin = false;

  if (token && userStr) {
    try {
      const user = JSON.parse(userStr);
      isAdmin = user?.role === 'ADMIN';
    } catch {
      isAdmin = false;
    }
  }

  return isAdmin ? <Navigate to="/admin/overview" replace /> : <>{children}</>;
}

function PublicLayout() {
  return (
    <div className="font-inter bg-[#FDF8F2] min-h-screen text-[#2B2B2B] antialiased overflow-x-hidden selection:bg-[#C8201A] selection:text-white flex flex-col pb-[52px] sm:pb-0">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <MobileCTABar />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ContentProvider>
        <MenuProvider>
          <CartProvider>
            <Routes>
              {/* 1. Admin Area */}
              <Route path="/admin">
                <Route
                  path="login"
                  element={<GuestAdminRoute><AdminLogin /></GuestAdminRoute>}
                />
                <Route
                  path="login/*"
                  element={<GuestAdminRoute><AdminLogin /></GuestAdminRoute>}
                />
                <Route
                  index
                  element={<Navigate to="/admin/overview" replace />}
                />
                <Route
                  element={<AdminRoute><AdminLayout /></AdminRoute>}
                >
                  <Route path="overview" element={<DashboardOverview />} />
                  <Route path="orders" element={<OrdersManager />} />
                  <Route path="products" element={<ProductManager />} />
                  <Route path="content" element={<ContentManager />} />
                  <Route path="categories" element={<CategoryManager />} />
                  <Route path="customizations" element={<CustomizationManager />} />
                </Route>
                <Route
                  path="*"
                  element={<Navigate to="/admin/overview" replace />}
                />
              </Route>

              <Route
                path="/login"
                element={<Navigate to="/admin/login" replace />}
              />
              <Route
                path="/admin-login"
                element={<Navigate to="/admin/login" replace />}
              />

              {/* 2. Public Routes with Layout */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/about" element={<About />} />
                <Route path="/deals" element={<Deals />} />
                <Route path="/ice-cream" element={<IceCream />} />
              </Route>

              {/* 3. Global Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </CartProvider>
        </MenuProvider>
      </ContentProvider>
    </Router>
  );
}

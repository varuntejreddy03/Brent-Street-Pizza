import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
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
              {/* Public Sub-routing */}
              <Route path="/" element={<PublicLayout />}>
                <Route index element={<Home />} />
                <Route path="menu" element={<Menu />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="contact" element={<ContactUs />} />
                <Route path="about" element={<About />} />
                <Route path="deals" element={<Deals />} />
                <Route path="ice-cream" element={<IceCream />} />
              </Route>
              
              {/* Admin Sub-routing */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<DashboardOverview />} />
                <Route path="orders" element={<OrdersManager />} />
                <Route path="products" element={<ProductManager />} />
                <Route path="content" element={<ContentManager />} />
              </Route>
            </Routes>
          </CartProvider>
        </MenuProvider>
      </ContentProvider>
    </Router>
  );
}

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './layout/Navbar';
import Footer from './layout/Footer';
import MobileCTABar from './layout/MobileCTABar';
import { CartProvider } from './context/CartContext';
import { MenuProvider } from './context/MenuContext';

// Pages
import Home from './pages/Home';
import Menu from './pages/Menu';
import ContactUs from './pages/ContactUs';
import About from './pages/About';
import Admin from './pages/Admin';
import Deals from './pages/Deals';

export default function App() {
  return (
    <Router>
      <MenuProvider>
        <CartProvider>
          <div className="font-inter bg-[#1a0a00] min-h-screen text-white antialiased overflow-x-hidden selection:bg-[#C0392B] selection:text-white flex flex-col pb-[52px] sm:pb-0">
            <Navbar />

            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/about" element={<About />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/deals" element={<Deals />} />
              </Routes>
            </main>

            <Footer />
            <MobileCTABar />
          </div>
        </CartProvider>
      </MenuProvider>
    </Router>
  );
}

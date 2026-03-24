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
import Deals from './pages/Deals';
import IceCream from './pages/IceCream';

export default function App() {
  return (
    <Router>
      <MenuProvider>
        <CartProvider>
          <div className="font-inter bg-[#FDF8F2] min-h-screen text-[#2B2B2B] antialiased overflow-x-hidden selection:bg-[#C8201A] selection:text-white flex flex-col pb-[52px] sm:pb-0">
            <Navbar />

            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/about" element={<About />} />
                <Route path="/deals" element={<Deals />} />
                <Route path="/icecream" element={<IceCream />} />
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

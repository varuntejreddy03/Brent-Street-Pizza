import Hero from '../sections/HeroSlider';
import QuickLinks from '../sections/QuickLinks';

import CategorySection from '../sections/CategorySection';
import MarqueeBanner from '../sections/MarqueeBanner';
import CustomerFavourites from '../sections/CustomerFavourites';
import WhyOrderDirect from '../sections/WhyOrderDirect';
import InfoSection from '../sections/InfoSection';
import DeliveryAreas from '../sections/DeliveryAreas';

export default function Home() {
  return (
    <div className="bg-[#1a0a00] min-h-screen">
      <Hero />
      <QuickLinks />

      <CategorySection />
      <MarqueeBanner />
      <CustomerFavourites />
      <WhyOrderDirect />
      <InfoSection />
      <DeliveryAreas />
    </div>
  );
}

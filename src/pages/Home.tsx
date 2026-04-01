import React, { Suspense } from 'react';
import Hero from '../sections/HeroSlider';
import QuickLinks from '../sections/QuickLinks';

const CategorySection = React.lazy(() => import('../sections/CategorySection'));
const MarqueeBanner = React.lazy(() => import('../sections/MarqueeBanner'));
const CustomerFavourites = React.lazy(() => import('../sections/CustomerFavourites'));
const DeliveryAreas = React.lazy(() => import('../sections/DeliveryAreas'));

export default function Home() {
  return (
    <div className="bg-[#FDF8F2] min-h-screen">
      <Hero />
      <QuickLinks />
      <Suspense fallback={<div className="h-32 bg-[#FDF8F2]" />}>
        <CategorySection />
      </Suspense>
      <Suspense fallback={<div className="h-16 bg-[#1A1A1A]" />}>
        <MarqueeBanner />
      </Suspense>
      <Suspense fallback={<div className="h-96 bg-[#FDF8F2]" />}>
        <CustomerFavourites />
      </Suspense>
      <Suspense fallback={<div className="h-64 bg-[#1A1A1A]" />}>
        <DeliveryAreas />
      </Suspense>
    </div>
  );
}


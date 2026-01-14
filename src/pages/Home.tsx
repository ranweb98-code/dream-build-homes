import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedProperties } from '@/components/home/FeaturedProperties';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { CTASection } from '@/components/home/CTASection';

export default function Home() {
  return (
    <Layout>
      <HeroSection />
      <FeaturedProperties />
      <WhyChooseUs />
      <CTASection />
    </Layout>
  );
}

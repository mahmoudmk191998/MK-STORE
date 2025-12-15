import React from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';
import CategoriesSection from '@/components/home/CategoriesSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import FeaturesSection from '@/components/home/FeaturesSection';
import NewsletterSection from '@/components/home/NewsletterSection';

const Index: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>MK Store | متجرك الأول للتسوق الإلكتروني</title>
        <meta name="description" content="MK Store - اكتشف أفضل المنتجات عالية الجودة بأسعار تنافسية. تسوق الآن واستمتع بتجربة تسوق فريدة مع شحن سريع وخدمة عملاء متميزة." />
        <meta name="keywords" content="متجر إلكتروني، تسوق أونلاين، منتجات، إلكترونيات، ملابس، إكسسوارات" />
      </Helmet>
      <Layout>
        <HeroSection />
        <CategoriesSection />
        <FeaturedProducts />
        <FeaturesSection />
        <NewsletterSection />
      </Layout>
    </>
  );
};

export default Index;

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-cream via-background to-secondary">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-accent blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 rounded-full bg-primary blur-3xl" />
      </div>

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 text-center lg:text-right">
            <div className="space-y-4">
              <p className="text-accent font-medium tracking-widest text-sm uppercase animate-fade-in">
                مرحباً بك في
              </p>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight animate-fade-in-up">
                MK<span className="text-accent">.</span>STORE
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-xl mx-auto lg:mx-0 animate-fade-in-up animation-delay-200">
                اكتشف مجموعة فريدة من المنتجات عالية الجودة بأسعار لا تُقاوم
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up animation-delay-300">
              <Button variant="hero" asChild>
                <Link to="/products" className="gap-2">
                  تسوق الآن
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="heroOutline" asChild>
                <Link to="/about">
                  اعرف المزيد
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 justify-center lg:justify-start pt-8 animate-fade-in-up animation-delay-400">
              <div className="text-center lg:text-right">
                <p className="text-3xl font-display font-bold text-accent">500+</p>
                <p className="text-sm text-muted-foreground">منتج متاح</p>
              </div>
              <div className="text-center lg:text-right">
                <p className="text-3xl font-display font-bold text-accent">10K+</p>
                <p className="text-sm text-muted-foreground">عميل سعيد</p>
              </div>
              <div className="text-center lg:text-right">
                <p className="text-3xl font-display font-bold text-accent">24/7</p>
                <p className="text-sm text-muted-foreground">دعم متواصل</p>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative lg:order-last animate-fade-in animation-delay-200">
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Decorative Elements */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent rounded-full blur-2xl" />
              <div className="absolute -top-4 -right-4 w-full h-full border-2 border-accent/20 rounded-3xl" />
              
              {/* Main Image Container */}
              <div className="relative bg-gradient-to-br from-muted to-secondary rounded-3xl overflow-hidden shadow-2xl">
                <div className="aspect-square flex items-center justify-center p-12">
                  <div className="text-center space-y-4">
                    <div className="w-32 h-32 mx-auto rounded-full bg-accent/10 flex items-center justify-center">
                      <span className="text-5xl font-display font-bold text-accent">MK</span>
                    </div>
                    <p className="text-muted-foreground">تسوق بثقة</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles, Zap, Star } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-[100vh] flex items-center overflow-hidden bg-background">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-accent/20 blur-[100px] animate-float animation-delay-300" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary/10 to-accent/10 blur-[150px]" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--primary)/0.03)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--primary)/0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 text-center lg:text-right">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 animate-fade-in">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">مرحباً بك في متجرنا</span>
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-8xl font-display font-bold leading-tight animate-fade-in-up">
                <span className="text-gradient-static">MK</span>
                <span className="text-foreground">.</span>
                <span className="text-foreground">STORE</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-xl mx-auto lg:mx-0 lg:mr-0 animate-fade-in-up animation-delay-200">
                اكتشف مجموعة فريدة من المنتجات العصرية بأسعار لا تُقاوم
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up animation-delay-300">
              <Button variant="hero" size="lg" asChild className="group">
                <Link to="/products" className="gap-3">
                  تسوق الآن
                  <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="heroOutline" size="lg" asChild>
                <Link to="/about">
                  اعرف المزيد
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 justify-center lg:justify-start pt-8 animate-fade-in-up animation-delay-400">
              <div className="text-center lg:text-right group">
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <Zap className="h-5 w-5 text-accent" />
                  <p className="text-3xl font-display font-bold text-gradient-static">500+</p>
                </div>
                <p className="text-sm text-muted-foreground">منتج متاح</p>
              </div>
              <div className="text-center lg:text-right">
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <Star className="h-5 w-5 text-accent" />
                  <p className="text-3xl font-display font-bold text-gradient-static">10K+</p>
                </div>
                <p className="text-sm text-muted-foreground">عميل سعيد</p>
              </div>
              <div className="text-center lg:text-right">
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <Sparkles className="h-5 w-5 text-accent" />
                  <p className="text-3xl font-display font-bold text-gradient-static">24/7</p>
                </div>
                <p className="text-sm text-muted-foreground">دعم متواصل</p>
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative lg:order-last animate-fade-in animation-delay-200">
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-accent/20 to-primary/30 rounded-full blur-3xl animate-pulse-glow" />
              
              {/* Floating Elements */}
              <div className="absolute -top-8 right-10 w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow animate-float">
                <Sparkles className="h-8 w-8 text-primary-foreground" />
              </div>
              <div className="absolute -bottom-4 left-10 w-16 h-16 rounded-xl bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-glow-accent animate-float animation-delay-200">
                <Zap className="h-6 w-6 text-primary-foreground" />
              </div>
              
              {/* Main Card */}
              <div className="relative card-glass p-8 animate-float animation-delay-100">
                <div className="aspect-square flex items-center justify-center">
                  <div className="text-center space-y-6">
                    <div className="w-40 h-40 mx-auto rounded-3xl bg-gradient-to-br from-primary via-accent to-primary p-[3px] animate-gradient-shift bg-[length:200%_200%]">
                      <div className="w-full h-full rounded-3xl bg-card flex items-center justify-center">
                        <span className="text-6xl font-display font-bold text-gradient-static">MK</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-lg font-display font-semibold text-foreground">تسوق بثقة</p>
                      <p className="text-sm text-muted-foreground">جودة عالية • أسعار منافسة</p>
                    </div>
                    <div className="flex justify-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
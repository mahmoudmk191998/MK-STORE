import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Laptop, Shirt, Watch, Home, Sparkles, ArrowUpRight } from 'lucide-react';

const categoryIcons: Record<string, React.ReactNode> = {
  electronics: <Laptop className="h-8 w-8" />,
  clothing: <Shirt className="h-8 w-8" />,
  accessories: <Watch className="h-8 w-8" />,
  home: <Home className="h-8 w-8" />,
};

const CategoriesSection: React.FC = () => {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/30 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--primary)/0.02)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--primary)/0.02)_1px,transparent_1px)] bg-[size:80px_80px]" />

      <div className="container-custom relative z-10">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mx-auto">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-accent">تصفح حسب الفئة</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold">
            أقسام <span className="text-gradient-static">المتجر</span>
          </h2>
        </div>

        {/* Categories Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-3xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories?.map((category, index) => (
              <Link
                key={category.id}
                to={`/products?category=${category.slug}`}
                className="group animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative aspect-square rounded-3xl bg-card border border-border/30 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2">
                  {/* Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Arrow Icon */}
                  <div className="absolute top-4 left-4 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <ArrowUpRight className="h-5 w-5 text-primary" />
                  </div>
                  
                  {/* Content */}
                  <div className="relative h-full flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/20 transition-all duration-300">
                      {categoryIcons[category.slug] || <Laptop className="h-8 w-8" />}
                    </div>
                    <h3 className="font-display font-bold text-xl text-foreground group-hover:text-primary transition-colors">
                      {category.name_ar || category.name}
                    </h3>
                    {category.description && (
                      <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                        {category.description}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoriesSection;
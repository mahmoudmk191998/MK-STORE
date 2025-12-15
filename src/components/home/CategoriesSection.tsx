import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Laptop, Shirt, Watch, Home } from 'lucide-react';

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
    <section className="py-20 bg-secondary/50">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <p className="text-accent font-medium tracking-widest text-sm uppercase">
            تصفح حسب الفئة
          </p>
          <h2 className="text-3xl md:text-4xl font-display font-bold">
            أقسام المتجر
          </h2>
        </div>

        {/* Categories Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
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
                <div className="relative aspect-square rounded-xl bg-card border border-border overflow-hidden card-hover">
                  {/* Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent group-hover:from-accent/10 transition-all duration-500" />
                  
                  {/* Content */}
                  <div className="relative h-full flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-4 group-hover:scale-110 transition-transform duration-300">
                      {categoryIcons[category.slug] || <Laptop className="h-8 w-8" />}
                    </div>
                    <h3 className="font-display font-semibold text-lg text-foreground group-hover:text-accent transition-colors">
                      {category.name_ar || category.name}
                    </h3>
                    {category.description && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
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

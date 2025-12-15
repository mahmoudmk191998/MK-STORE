import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/products/ProductCard';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

const FeaturedProducts: React.FC = () => {
  const { data: products, isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (name, name_ar)
        `)
        .eq('is_featured', true)
        .eq('is_active', true)
        .limit(8);
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <section className="py-20 bg-background">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div className="space-y-2">
            <p className="text-accent font-medium tracking-widest text-sm uppercase">
              اختيارنا المميز
            </p>
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              منتجات مميزة
            </h2>
          </div>
          <Button variant="outline" asChild className="self-start md:self-auto">
            <Link to="/products" className="gap-2">
              عرض الكل
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-square rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <div 
                key={product.id} 
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProductCard
                  id={product.id}
                  name={product.name_ar || product.name}
                  price={Number(product.price)}
                  originalPrice={product.original_price ? Number(product.original_price) : undefined}
                  image={product.images?.[0] || '/placeholder.svg'}
                  slug={product.slug}
                  category={product.categories?.name_ar || product.categories?.name}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">لا توجد منتجات مميزة حالياً</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;

import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/products/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Filter, X } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category') || '';
  
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedCategory, setSelectedCategory] = useState(categoryFilter);

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    }
  });

  const { data: products, isLoading } = useQuery({
    queryKey: ['products', selectedCategory, sortBy],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select(`
          *,
          categories (name, name_ar, slug)
        `)
        .eq('is_active', true);

      if (selectedCategory) {
        query = query.eq('categories.slug', selectedCategory);
      }

      if (sortBy === 'newest') {
        query = query.order('created_at', { ascending: false });
      } else if (sortBy === 'price-low') {
        query = query.order('price', { ascending: true });
      } else if (sortBy === 'price-high') {
        query = query.order('price', { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter(product => {
      const price = Number(product.price);
      const inPriceRange = price >= priceRange[0] && price <= priceRange[1];
      const inCategory = !selectedCategory || product.categories?.slug === selectedCategory;
      return inPriceRange && inCategory;
    });
  }, [products, priceRange, selectedCategory]);

  const clearFilters = () => {
    setSelectedCategory('');
    setPriceRange([0, 10000]);
    setSortBy('newest');
    setSearchParams({});
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="space-y-3">
        <h4 className="font-medium text-foreground">الفئة</h4>
        <div className="space-y-2">
          <Button
            variant={selectedCategory === '' ? 'default' : 'ghost'}
            size="sm"
            className="w-full justify-start"
            onClick={() => setSelectedCategory('')}
          >
            جميع الفئات
          </Button>
          {categories?.map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.slug ? 'default' : 'ghost'}
              size="sm"
              className="w-full justify-start"
              onClick={() => setSelectedCategory(category.slug)}
            >
              {category.name_ar || category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div className="space-y-3">
        <h4 className="font-medium text-foreground">السعر</h4>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          max={10000}
          step={100}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{priceRange[0]} ج.م</span>
          <span>{priceRange[1]} ج.م</span>
        </div>
      </div>

      {/* Clear Filters */}
      <Button variant="outline" className="w-full" onClick={clearFilters}>
        <X className="h-4 w-4 ml-2" />
        مسح الفلاتر
      </Button>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>المنتجات | MK Store</title>
        <meta name="description" content="تصفح جميع منتجات MK Store - إلكترونيات، ملابس، إكسسوارات وأكثر. اختر من بين مجموعة واسعة من المنتجات عالية الجودة." />
      </Helmet>
      <Layout>
        <div className="container-custom py-8 lg:py-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold">المنتجات</h1>
              <p className="text-muted-foreground mt-2">
                {filteredProducts.length} منتج
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Mobile Filter */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden">
                    <Filter className="h-4 w-4 ml-2" />
                    تصفية
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <SheetHeader>
                    <SheetTitle>تصفية المنتجات</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="ترتيب حسب" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">الأحدث</SelectItem>
                  <SelectItem value="price-low">السعر: الأقل</SelectItem>
                  <SelectItem value="price-high">السعر: الأعلى</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-24 space-y-6 p-6 bg-card rounded-xl border border-border">
                <h3 className="font-display font-semibold text-lg">تصفية</h3>
                <FilterContent />
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="space-y-4">
                      <Skeleton className="aspect-square rounded-lg" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ))}
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {filteredProducts.map((product, index) => (
                    <div 
                      key={product.id}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${index * 50}ms` }}
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
                <div className="text-center py-16">
                  <p className="text-xl text-muted-foreground">لا توجد منتجات</p>
                  <Button variant="outline" className="mt-4" onClick={clearFilters}>
                    مسح الفلاتر
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Products;

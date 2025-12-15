import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  slug: string;
  category?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  originalPrice,
  image,
  slug,
  category
}) => {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ id, name, price, image });
    toast.success('تمت الإضافة إلى السلة');
  };

  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  return (
    <Link to={`/products/${slug}`} className="group block">
      <div className="bg-card rounded-2xl overflow-hidden border border-border/30 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-2">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={image || '/placeholder.svg'}
            alt={name}
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Discount Badge */}
          {discount > 0 && (
            <span className="absolute top-3 right-3 bg-gradient-to-r from-destructive to-destructive/80 text-destructive-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              -{discount}%
            </span>
          )}

          {/* Quick Add Button */}
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <Button 
              variant="default" 
              className="w-full gap-2 rounded-xl"
              onClick={handleAddToCart}
            >
              <ShoppingBag className="h-4 w-4" />
              أضف للسلة
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          {category && (
            <span className="inline-block text-xs text-primary font-medium bg-primary/10 px-3 py-1 rounded-full">
              {category}
            </span>
          )}
          <h3 className="font-display font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {name}
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-gradient-static">
              {price.toFixed(2)} ج.م
            </span>
            {originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {originalPrice.toFixed(2)} ج.م
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

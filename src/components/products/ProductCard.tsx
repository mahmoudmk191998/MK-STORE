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
      <div className="bg-card rounded-lg overflow-hidden card-hover border border-border/50">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={image || '/placeholder.svg'}
            alt={name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Discount Badge */}
          {discount > 0 && (
            <span className="absolute top-3 right-3 bg-destructive text-destructive-foreground text-xs font-medium px-2 py-1 rounded">
              -{discount}%
            </span>
          )}

          {/* Quick Add Button */}
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <Button 
              variant="gold" 
              className="w-full gap-2"
              onClick={handleAddToCart}
            >
              <ShoppingBag className="h-4 w-4" />
              أضف للسلة
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          {category && (
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              {category}
            </p>
          )}
          <h3 className="font-medium text-foreground line-clamp-2 group-hover:text-accent transition-colors">
            {name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-foreground">
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

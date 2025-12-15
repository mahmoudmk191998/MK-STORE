import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Grid, Heart, ShoppingCart, User } from 'lucide-react';

const BottomNavigation: React.FC = () => {
  const items = [
    { name: 'الرئيسية', href: '/', icon: <Home className="h-5 w-5" /> },
    { name: 'المنتجات', href: '/products', icon: <Grid className="h-5 w-5" /> },
    { name: 'المفضلة', href: '/favorites', icon: <Heart className="h-5 w-5" /> },
    { name: 'عربة', href: '/cart', icon: <ShoppingCart className="h-5 w-5" /> },
    { name: 'حسابي', href: '/account', icon: <User className="h-5 w-5" /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-background/95 backdrop-blur border-t border-border">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex items-center justify-between py-2">
          {items.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="flex-1 flex flex-col items-center gap-1 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              aria-label={item.name}
            >
              {item.icon}
              <span className="leading-none">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;

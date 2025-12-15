import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  FolderOpen, 
  MessageSquare, 
  Truck, 
  ArrowRight,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const menuItems = [
  { icon: LayoutDashboard, label: 'الرئيسية', href: '/admin' },
  { icon: Package, label: 'المنتجات', href: '/admin/products' },
  { icon: ShoppingCart, label: 'الطلبات', href: '/admin/orders' },
  { icon: FolderOpen, label: 'الفئات', href: '/admin/categories' },
  { icon: MessageSquare, label: 'الرسائل', href: '/admin/messages' },
  { icon: Truck, label: 'الشحن', href: '/admin/shipping' },
];

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const { signOut } = useAuth();

  const isActive = (href: string) => {
    if (href === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <aside className="w-64 bg-card border-l border-border min-h-screen sticky top-0 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link to="/admin" className="flex items-center gap-2">
          <span className="text-xl font-display font-bold">
            MK<span className="text-accent">.</span>ADMIN
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
              isActive(item.href)
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-2">
        <Button variant="outline" className="w-full justify-start" asChild>
          <Link to="/">
            <ArrowRight className="h-4 w-4 ml-2" />
            العودة للمتجر
          </Link>
        </Button>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-destructive hover:text-destructive"
          onClick={() => signOut()}
        >
          <LogOut className="h-4 w-4 ml-2" />
          تسجيل الخروج
        </Button>
      </div>
    </aside>
  );
};

export default AdminSidebar;

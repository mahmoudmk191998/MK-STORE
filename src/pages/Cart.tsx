import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft } from 'lucide-react';

const Cart: React.FC = () => {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <>
        <Helmet>
          <title>سلة التسوق | MK Store</title>
        </Helmet>
        <Layout>
          <div className="container-custom py-20">
            <div className="max-w-md mx-auto text-center space-y-6">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto">
                <ShoppingBag className="h-12 w-12 text-muted-foreground" />
              </div>
              <h1 className="text-2xl font-display font-bold">سلتك فارغة</h1>
              <p className="text-muted-foreground">
                لم تقم بإضافة أي منتجات بعد. تصفح منتجاتنا وأضف ما يعجبك!
              </p>
              <Button asChild variant="gold" size="lg">
                <Link to="/products">
                  تسوق الآن
                  <ArrowLeft className="h-4 w-4 mr-2" />
                </Link>
              </Button>
            </div>
          </div>
        </Layout>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>سلة التسوق | MK Store</title>
      </Helmet>
      <Layout>
        <div className="container-custom py-8 lg:py-12">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-8">سلة التسوق</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div 
                  key={item.id}
                  className="flex gap-4 p-4 bg-card rounded-xl border border-border"
                >
                  <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground line-clamp-2">
                      {item.name}
                    </h3>
                    <p className="text-accent font-semibold mt-1">
                      {item.price.toFixed(2)} ج.م
                    </p>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-border rounded-lg">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              <Button 
                variant="outline" 
                className="text-destructive hover:text-destructive"
                onClick={clearCart}
              >
                <Trash2 className="h-4 w-4 ml-2" />
                إفراغ السلة
              </Button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-xl border border-border p-6 sticky top-24 space-y-6">
                <h2 className="text-xl font-display font-semibold">ملخص الطلب</h2>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">المجموع الفرعي</span>
                    <span>{totalPrice.toFixed(2)} ج.م</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">الشحن</span>
                    <span>يُحسب لاحقاً</span>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>الإجمالي</span>
                    <span className="text-accent">{totalPrice.toFixed(2)} ج.م</span>
                  </div>
                </div>

                <Button 
                  variant="gold" 
                  size="xl" 
                  className="w-full"
                  onClick={() => navigate('/checkout')}
                >
                  إتمام الطلب
                </Button>

                <Button variant="outline" className="w-full" asChild>
                  <Link to="/products">
                    <ArrowLeft className="h-4 w-4 ml-2" />
                    متابعة التسوق
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Cart;

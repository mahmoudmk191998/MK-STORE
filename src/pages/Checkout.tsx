import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { CreditCard, Banknote, Truck } from 'lucide-react';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    notes: '',
    paymentMethod: 'cash_on_delivery' as 'bank_transfer' | 'cash_on_delivery'
  });

  const { data: shippingSettings } = useQuery({
    queryKey: ['shipping-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shipping_settings')
        .select('*')
        .eq('is_active', true);
      if (error) throw error;
      return data;
    }
  });

  const selectedShipping = shippingSettings?.find(s => s.city === formData.city);
  const shippingCost = selectedShipping?.cost ? Number(selectedShipping.cost) : 0;
  const estimatedDays = selectedShipping?.estimated_days || 5;
  const grandTotal = totalPrice + shippingCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      toast.error('السلة فارغة');
      return;
    }

    setLoading(true);

    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user?.id || null,
          status: 'pending',
          payment_method: formData.paymentMethod,
          subtotal: totalPrice,
          shipping_cost: shippingCost,
          total: grandTotal,
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          shipping_address: formData.address,
          shipping_city: formData.city,
          notes: formData.notes,
          estimated_delivery: `${estimatedDays} أيام عمل`
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        product_price: item.price,
        quantity: item.quantity,
        total: item.price * item.quantity
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Send confirmation email
      try {
        await supabase.functions.invoke('send-order-confirmation', {
          body: {
            orderId: order.id,
            customerName: formData.name,
            customerEmail: formData.email,
            customerPhone: formData.phone,
            shippingAddress: formData.address,
            shippingCity: formData.city,
            paymentMethod: formData.paymentMethod,
            subtotal: totalPrice,
            shippingCost: shippingCost,
            total: grandTotal,
            estimatedDelivery: `${estimatedDays} أيام عمل`,
            items: orderItems.map(item => ({
              product_name: item.product_name,
              quantity: item.quantity,
              product_price: item.product_price,
              total: item.total
            }))
          }
        });
        console.log('Order confirmation email sent');
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
        // Don't fail the order if email fails
      }

      clearCart();
      toast.success('تم إنشاء طلبك بنجاح!');
      navigate('/order-success', { state: { orderId: order.id } });
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('حدث خطأ أثناء إنشاء الطلب');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <>
      <Helmet>
        <title>إتمام الطلب | MK Store</title>
      </Helmet>
      <Layout>
        <div className="container-custom py-8 lg:py-12">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-8">إتمام الطلب</h1>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Form */}
              <div className="lg:col-span-2 space-y-8">
                {/* Contact Info */}
                <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                  <h2 className="text-xl font-display font-semibold">بيانات التواصل</h2>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">الاسم الكامل *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">البريد الإلكتروني *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="phone">رقم الهاتف *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Shipping */}
                <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                  <h2 className="text-xl font-display font-semibold flex items-center gap-2">
                    <Truck className="h-5 w-5 text-accent" />
                    عنوان الشحن
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">المدينة *</Label>
                      <Select
                        value={formData.city}
                        onValueChange={(value) => setFormData({ ...formData, city: value })}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر المدينة" />
                        </SelectTrigger>
                        <SelectContent>
                          {shippingSettings?.map((setting) => (
                            <SelectItem key={setting.id} value={setting.city}>
                              {setting.city} - {Number(setting.cost).toFixed(2)} ج.م
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">العنوان التفصيلي *</Label>
                      <Textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="الشارع، رقم المبنى، الطابق، علامة مميزة..."
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">ملاحظات إضافية</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="أي تعليمات خاصة للتوصيل..."
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                  <h2 className="text-xl font-display font-semibold">طريقة الدفع</h2>
                  
                  <RadioGroup
                    value={formData.paymentMethod}
                    onValueChange={(value) => setFormData({ ...formData, paymentMethod: value as any })}
                  >
                    <div className="flex items-center space-x-4 space-x-reverse p-4 border border-border rounded-lg cursor-pointer hover:border-accent transition-colors">
                      <RadioGroupItem value="cash_on_delivery" id="cod" />
                      <Label htmlFor="cod" className="flex items-center gap-3 cursor-pointer flex-1">
                        <Banknote className="h-5 w-5 text-accent" />
                        <div>
                          <p className="font-medium">الدفع عند الاستلام</p>
                          <p className="text-sm text-muted-foreground">ادفع نقداً عند استلام طلبك</p>
                        </div>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-4 space-x-reverse p-4 border border-border rounded-lg cursor-pointer hover:border-accent transition-colors">
                      <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                      <Label htmlFor="bank_transfer" className="flex items-center gap-3 cursor-pointer flex-1">
                        <CreditCard className="h-5 w-5 text-accent" />
                        <div>
                          <p className="font-medium">تحويل بنكي</p>
                          <p className="text-sm text-muted-foreground">تحويل فوري عبر البنك أو InstaPay</p>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded-xl border border-border p-6 sticky top-24 space-y-6">
                  <h2 className="text-xl font-display font-semibold">ملخص الطلب</h2>
                  
                  <div className="space-y-4 max-h-60 overflow-y-auto">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden shrink-0">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-2">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.quantity} × {item.price.toFixed(2)} ج.م
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border pt-4 space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">المجموع الفرعي</span>
                      <span>{totalPrice.toFixed(2)} ج.م</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">الشحن</span>
                      <span>{shippingCost.toFixed(2)} ج.م</span>
                    </div>
                    {selectedShipping && (
                      <div className="flex justify-between text-muted-foreground">
                        <span>وقت التوصيل المتوقع</span>
                        <span>{estimatedDays} أيام</span>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>الإجمالي</span>
                      <span className="text-accent">{grandTotal.toFixed(2)} ج.م</span>
                    </div>
                  </div>

                  <Button 
                    type="submit"
                    variant="gold" 
                    size="xl" 
                    className="w-full"
                    disabled={loading || !formData.city}
                  >
                    {loading ? 'جاري إنشاء الطلب...' : 'تأكيد الطلب'}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </Layout>
    </>
  );
};

export default Checkout;

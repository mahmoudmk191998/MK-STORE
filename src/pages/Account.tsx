import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { User, Package, LogOut, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';

const statusConfig = {
  pending: { label: 'قيد الانتظار', icon: Clock, color: 'bg-yellow-100 text-yellow-800' },
  processing: { label: 'جاري التجهيز', icon: Package, color: 'bg-blue-100 text-blue-800' },
  shipped: { label: 'تم الشحن', icon: Truck, color: 'bg-purple-100 text-purple-800' },
  delivered: { label: 'تم التوصيل', icon: CheckCircle, color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'ملغي', icon: XCircle, color: 'bg-red-100 text-red-800' }
};

const Account: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut, loading: authLoading } = useAuth();
  const [saving, setSaving] = useState(false);

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  const [formData, setFormData] = useState({
    fullName: profile?.full_name || '',
    phone: profile?.phone || '',
    address: profile?.address || '',
    city: profile?.city || ''
  });

  React.useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.full_name || '',
        phone: profile.phone || '',
        address: profile.address || '',
        city: profile.city || ''
      });
    }
  }, [profile]);

  React.useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        full_name: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        city: formData.city
      });

    if (error) {
      toast.error('حدث خطأ أثناء الحفظ');
    } else {
      toast.success('تم حفظ البيانات بنجاح');
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    await signOut();
    toast.success('تم تسجيل الخروج');
    navigate('/');
  };

  if (authLoading || !user) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>حسابي | MK Store</title>
      </Helmet>
      <Layout>
        <div className="container-custom py-8 lg:py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold">حسابي</h1>
              <p className="text-muted-foreground mt-2">{user.email}</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 ml-2" />
              تسجيل الخروج
            </Button>
          </div>

          <Tabs defaultValue="profile" className="space-y-8">
            <TabsList>
              <TabsTrigger value="profile" className="gap-2">
                <User className="h-4 w-4" />
                البيانات الشخصية
              </TabsTrigger>
              <TabsTrigger value="orders" className="gap-2">
                <Package className="h-4 w-4" />
                طلباتي
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <div className="bg-card rounded-xl border border-border p-6 max-w-2xl">
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">الاسم الكامل</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">رقم الهاتف</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">المدينة</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">العنوان</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      />
                    </div>
                  </div>

                  <Button type="submit" variant="gold" disabled={saving}>
                    {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                  </Button>
                </form>
              </div>
            </TabsContent>

            <TabsContent value="orders">
              {ordersLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-32 rounded-xl" />
                  ))}
                </div>
              ) : orders && orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => {
                    const status = statusConfig[order.status as keyof typeof statusConfig];
                    const StatusIcon = status.icon;
                    
                    return (
                      <div key={order.id} className="bg-card rounded-xl border border-border p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              رقم الطلب: <span className="font-mono">{order.id.slice(0, 8).toUpperCase()}</span>
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.created_at).toLocaleDateString('ar-EG', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                          <Badge className={`${status.color} gap-1`}>
                            <StatusIcon className="h-3 w-3" />
                            {status.label}
                          </Badge>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {order.order_items?.slice(0, 3).map((item: any) => (
                            <span key={item.id} className="text-sm bg-muted px-2 py-1 rounded">
                              {item.product_name} × {item.quantity}
                            </span>
                          ))}
                          {order.order_items?.length > 3 && (
                            <span className="text-sm text-muted-foreground">
                              +{order.order_items.length - 3} منتجات أخرى
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <span className="text-muted-foreground">الإجمالي</span>
                          <span className="font-semibold text-accent">
                            {Number(order.total).toFixed(2)} ج.م
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">لا توجد طلبات بعد</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </Layout>
    </>
  );
};

export default Account;

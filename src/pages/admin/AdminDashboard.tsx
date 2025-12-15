import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import StatsCard from '@/components/admin/StatsCard';
import { 
  DollarSign, 
  ShoppingCart, 
  Package, 
  Users, 
  TrendingUp,
  Clock,
  CheckCircle,
  Truck
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const statusConfig = {
  pending: { label: 'قيد الانتظار', color: 'bg-yellow-100 text-yellow-800' },
  processing: { label: 'جاري التجهيز', color: 'bg-blue-100 text-blue-800' },
  shipped: { label: 'تم الشحن', color: 'bg-purple-100 text-purple-800' },
  delivered: { label: 'تم التوصيل', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'ملغي', color: 'bg-red-100 text-red-800' }
};

const AdminDashboard: React.FC = () => {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [ordersResult, productsResult] = await Promise.all([
        supabase.from('orders').select('*'),
        supabase.from('products').select('id', { count: 'exact' })
      ]);

      const orders = ordersResult.data || [];
      const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total), 0);
      const pendingOrders = orders.filter(o => o.status === 'pending').length;
      const deliveredOrders = orders.filter(o => o.status === 'delivered').length;

      return {
        totalRevenue,
        totalOrders: orders.length,
        totalProducts: productsResult.count || 0,
        pendingOrders,
        deliveredOrders
      };
    }
  });

  const { data: recentOrders } = useQuery({
    queryKey: ['recent-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    }
  });

  const { data: topProducts } = useQuery({
    queryKey: ['top-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_featured', true)
        .limit(5);
      if (error) throw error;
      return data;
    }
  });

  return (
    <>
      <Helmet>
        <title>لوحة التحكم | MK Store Admin</title>
      </Helmet>
      <AdminLayout>
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold">لوحة التحكم</h1>
            <p className="text-muted-foreground mt-1">مرحباً بك في لوحة تحكم MK Store</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="إجمالي المبيعات"
              value={`${(stats?.totalRevenue || 0).toLocaleString()} ج.م`}
              icon={DollarSign}
              trend="up"
            />
            <StatsCard
              title="إجمالي الطلبات"
              value={stats?.totalOrders || 0}
              icon={ShoppingCart}
            />
            <StatsCard
              title="المنتجات"
              value={stats?.totalProducts || 0}
              icon={Package}
            />
            <StatsCard
              title="طلبات معلقة"
              value={stats?.pendingOrders || 0}
              icon={Clock}
              trend={stats?.pendingOrders ? 'down' : 'neutral'}
            />
          </div>

          {/* Order Status Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats?.pendingOrders || 0}</p>
                  <p className="text-sm text-muted-foreground">طلبات معلقة</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Truck className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {recentOrders?.filter(o => o.status === 'shipped').length || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">قيد الشحن</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats?.deliveredOrders || 0}</p>
                  <p className="text-sm text-muted-foreground">تم التوصيل</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Recent Orders */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-xl font-display font-semibold mb-4">أحدث الطلبات</h2>
              <div className="space-y-4">
                {recentOrders?.map((order) => {
                  const status = statusConfig[order.status as keyof typeof statusConfig];
                  return (
                    <div key={order.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                      <div>
                        <p className="font-medium">{order.customer_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString('ar-EG')}
                        </p>
                      </div>
                      <div className="text-left">
                        <p className="font-semibold">{Number(order.total).toFixed(2)} ج.م</p>
                        <Badge className={status.color}>{status.label}</Badge>
                      </div>
                    </div>
                  );
                })}
                {!recentOrders?.length && (
                  <p className="text-center text-muted-foreground py-4">لا توجد طلبات</p>
                )}
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-xl font-display font-semibold mb-4">المنتجات المميزة</h2>
              <div className="space-y-4">
                {topProducts?.map((product) => (
                  <div key={product.id} className="flex items-center gap-4 py-3 border-b border-border last:border-0">
                    <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden">
                      <img 
                        src={product.images?.[0] || '/placeholder.svg'} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{product.name_ar || product.name}</p>
                      <p className="text-sm text-muted-foreground">المخزون: {product.stock}</p>
                    </div>
                    <p className="font-semibold text-accent">{Number(product.price).toFixed(2)} ج.م</p>
                  </div>
                ))}
                {!topProducts?.length && (
                  <p className="text-center text-muted-foreground py-4">لا توجد منتجات</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminDashboard;

import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Search, Eye, Loader2 } from 'lucide-react';

const statusConfig = {
  pending: { label: 'قيد الانتظار', color: 'bg-yellow-100 text-yellow-800' },
  processing: { label: 'جاري التجهيز', color: 'bg-blue-100 text-blue-800' },
  shipped: { label: 'تم الشحن', color: 'bg-purple-100 text-purple-800' },
  delivered: { label: 'تم التوصيل', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'ملغي', color: 'bg-red-100 text-red-800' }
};

const paymentMethodLabels = {
  cash_on_delivery: 'الدفع عند الاستلام',
  instapay: 'InstaPay'
};

const AdminOrders: React.FC = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const { data: orders, isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`*, order_items(*)`)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' }) => {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success('تم تحديث حالة الطلب');
    }
  });

  const filteredOrders = orders?.filter((order) => {
    const matchesSearch =
      order.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(search.toLowerCase()) ||
      order.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <Helmet>
        <title>إدارة الطلبات | MK Store Admin</title>
      </Helmet>
      <AdminLayout>
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold">الطلبات</h1>
            <p className="text-muted-foreground mt-1">{orders?.length || 0} طلب</p>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="بحث بالاسم أو الإيميل أو رقم الطلب..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pr-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                {Object.entries(statusConfig).map(([key, { label }]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Orders Table */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-right p-4 font-medium">رقم الطلب</th>
                  <th className="text-right p-4 font-medium">العميل</th>
                  <th className="text-right p-4 font-medium">الإجمالي</th>
                  <th className="text-right p-4 font-medium">طريقة الدفع</th>
                  <th className="text-right p-4 font-medium">الحالة</th>
                  <th className="text-right p-4 font-medium">التاريخ</th>
                  <th className="text-right p-4 font-medium">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    </td>
                  </tr>
                ) : filteredOrders?.length ? (
                  filteredOrders.map((order) => {
                    const status = statusConfig[order.status as keyof typeof statusConfig];
                    return (
                      <tr key={order.id} className="border-t border-border hover:bg-muted/30">
                        <td className="p-4 font-mono text-sm">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </td>
                        <td className="p-4">
                          <p className="font-medium">{order.customer_name}</p>
                          <p className="text-sm text-muted-foreground">{order.customer_email}</p>
                        </td>
                        <td className="p-4 font-semibold">
                          {Number(order.total).toFixed(2)} ج.م
                        </td>
                        <td className="p-4 text-sm">
                          {paymentMethodLabels[order.payment_method as keyof typeof paymentMethodLabels]}
                        </td>
                        <td className="p-4">
                          <Select
                            value={order.status}
                            onValueChange={(value: string) => 
                              updateStatusMutation.mutate({ id: order.id, status: value as 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' })
                            }
                          >
                            <SelectTrigger className="w-36 h-8">
                              <Badge className={status.color}>{status.label}</Badge>
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(statusConfig).map(([key, { label }]) => (
                                <SelectItem key={key} value={key}>{label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString('ar-EG', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="p-4">
                          <Button size="sm" variant="ghost" onClick={() => setSelectedOrder(order)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                      لا توجد طلبات
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Order Details Dialog */}
          <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  تفاصيل الطلب #{selectedOrder?.id.slice(0, 8).toUpperCase()}
                </DialogTitle>
              </DialogHeader>
              {selectedOrder && (
                <div className="space-y-6 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">معلومات العميل</h4>
                      <div className="text-sm space-y-1 text-muted-foreground">
                        <p>الاسم: {selectedOrder.customer_name}</p>
                        <p>الإيميل: {selectedOrder.customer_email}</p>
                        <p>الهاتف: {selectedOrder.customer_phone}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">عنوان الشحن</h4>
                      <div className="text-sm space-y-1 text-muted-foreground">
                        <p>{selectedOrder.shipping_address}</p>
                        <p>{selectedOrder.shipping_city}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">المنتجات</h4>
                    <div className="space-y-2">
                      {selectedOrder.order_items?.map((item: any) => (
                        <div key={item.id} className="flex justify-between py-2 border-b border-border">
                          <div>
                            <p className="font-medium">{item.product_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.quantity} × {Number(item.product_price).toFixed(2)} ج.م
                            </p>
                          </div>
                          <p className="font-medium">{Number(item.total).toFixed(2)} ج.م</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-border pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>المجموع الفرعي</span>
                      <span>{Number(selectedOrder.subtotal).toFixed(2)} ج.م</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>الشحن</span>
                      <span>{Number(selectedOrder.shipping_cost).toFixed(2)} ج.م</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg">
                      <span>الإجمالي</span>
                      <span className="text-accent">{Number(selectedOrder.total).toFixed(2)} ج.م</span>
                    </div>
                  </div>

                  {selectedOrder.notes && (
                    <div>
                      <h4 className="font-medium mb-2">ملاحظات</h4>
                      <p className="text-sm text-muted-foreground">{selectedOrder.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminOrders;

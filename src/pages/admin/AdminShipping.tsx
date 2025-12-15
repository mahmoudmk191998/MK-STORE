import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Loader2, Truck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ShippingForm {
  id?: string;
  city: string;
  cost: string;
  estimated_days: string;
  is_active: boolean;
}

const emptyForm: ShippingForm = {
  city: '',
  cost: '',
  estimated_days: '3',
  is_active: true
};

const AdminShipping: React.FC = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState<ShippingForm>(emptyForm);

  const { data: settings, isLoading } = useQuery({
    queryKey: ['admin-shipping'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shipping_settings')
        .select('*')
        .order('city');
      if (error) throw error;
      return data;
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (setting: ShippingForm) => {
      const settingData = {
        city: setting.city,
        cost: parseFloat(setting.cost),
        estimated_days: parseInt(setting.estimated_days),
        is_active: setting.is_active
      };

      if (setting.id) {
        const { error } = await supabase
          .from('shipping_settings')
          .update(settingData)
          .eq('id', setting.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('shipping_settings')
          .insert(settingData);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-shipping'] });
      toast.success(form.id ? 'تم تحديث إعدادات الشحن' : 'تم إضافة منطقة شحن جديدة');
      setIsDialogOpen(false);
      setForm(emptyForm);
    },
    onError: (error) => {
      console.error(error);
      toast.error('حدث خطأ');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('shipping_settings').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-shipping'] });
      toast.success('تم حذف منطقة الشحن');
    }
  });

  const handleEdit = (setting: any) => {
    setForm({
      id: setting.id,
      city: setting.city,
      cost: setting.cost.toString(),
      estimated_days: setting.estimated_days.toString(),
      is_active: setting.is_active
    });
    setIsDialogOpen(true);
  };

  return (
    <>
      <Helmet>
        <title>إعدادات الشحن | MK Store Admin</title>
      </Helmet>
      <AdminLayout>
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold">إعدادات الشحن</h1>
              <p className="text-muted-foreground mt-1">{settings?.length || 0} منطقة</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="gold" onClick={() => setForm(emptyForm)}>
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة منطقة
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{form.id ? 'تعديل منطقة الشحن' : 'إضافة منطقة شحن جديدة'}</DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    saveMutation.mutate(form);
                  }}
                  className="space-y-4 mt-4"
                >
                  <div className="space-y-2">
                    <Label>المدينة / المنطقة</Label>
                    <Input
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      required
                      placeholder="القاهرة"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>تكلفة الشحن (ج.م)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={form.cost}
                        onChange={(e) => setForm({ ...form, cost: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>أيام التوصيل المتوقعة</Label>
                      <Input
                        type="number"
                        value={form.estimated_days}
                        onChange={(e) => setForm({ ...form, estimated_days: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch
                      checked={form.is_active}
                      onCheckedChange={(checked) => setForm({ ...form, is_active: checked })}
                    />
                    <Label>نشط</Label>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button type="submit" variant="gold" disabled={saveMutation.isPending}>
                      {saveMutation.isPending && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
                      {form.id ? 'تحديث' : 'إضافة'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      إلغاء
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Shipping Settings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="col-span-full flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : settings?.length ? (
              settings.map((setting) => (
                <div key={setting.id} className="bg-card rounded-xl border border-border p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                        <Truck className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{setting.city}</h3>
                        <Badge variant={setting.is_active ? 'default' : 'secondary'}>
                          {setting.is_active ? 'نشط' : 'معطل'}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => handleEdit(setting)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        onClick={() => deleteMutation.mutate(setting.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">تكلفة الشحن</p>
                      <p className="font-semibold text-accent">{Number(setting.cost).toFixed(2)} ج.م</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">وقت التوصيل</p>
                      <p className="font-semibold">{setting.estimated_days} أيام</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                لا توجد مناطق شحن
              </div>
            )}
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminShipping;

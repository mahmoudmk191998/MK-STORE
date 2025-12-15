import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Eye, Trash2, Loader2, Mail, MailOpen } from 'lucide-react';

const AdminMessages: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedMessage, setSelectedMessage] = useState<any>(null);

  const { data: messages, isLoading } = useQuery({
    queryKey: ['admin-messages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('contact_messages')
        .update({ is_read: true })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-messages'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('contact_messages').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-messages'] });
      toast.success('تم حذف الرسالة');
    }
  });

  const handleView = (message: any) => {
    setSelectedMessage(message);
    if (!message.is_read) {
      markAsReadMutation.mutate(message.id);
    }
  };

  const unreadCount = messages?.filter(m => !m.is_read).length || 0;

  return (
    <>
      <Helmet>
        <title>الرسائل | MK Store Admin</title>
      </Helmet>
      <AdminLayout>
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold">الرسائل</h1>
            <p className="text-muted-foreground mt-1">
              {messages?.length || 0} رسالة
              {unreadCount > 0 && ` (${unreadCount} غير مقروءة)`}
            </p>
          </div>

          {/* Messages List */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-right p-4 font-medium w-8"></th>
                  <th className="text-right p-4 font-medium">المرسل</th>
                  <th className="text-right p-4 font-medium">الموضوع</th>
                  <th className="text-right p-4 font-medium">التاريخ</th>
                  <th className="text-right p-4 font-medium">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    </td>
                  </tr>
                ) : messages?.length ? (
                  messages.map((message) => (
                    <tr 
                      key={message.id} 
                      className={`border-t border-border hover:bg-muted/30 ${!message.is_read ? 'bg-accent/5' : ''}`}
                    >
                      <td className="p-4">
                        {message.is_read ? (
                          <MailOpen className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Mail className="h-4 w-4 text-accent" />
                        )}
                      </td>
                      <td className="p-4">
                        <p className={`font-medium ${!message.is_read ? 'font-semibold' : ''}`}>
                          {message.name}
                        </p>
                        <p className="text-sm text-muted-foreground">{message.email}</p>
                      </td>
                      <td className="p-4">
                        <p className={`${!message.is_read ? 'font-semibold' : ''}`}>
                          {message.subject || 'بدون موضوع'}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {message.message}
                        </p>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {new Date(message.created_at).toLocaleDateString('ar-EG', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => handleView(message)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                            onClick={() => deleteMutation.mutate(message.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                      لا توجد رسائل
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Message Dialog */}
          <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>تفاصيل الرسالة</DialogTitle>
              </DialogHeader>
              {selectedMessage && (
                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">الاسم</p>
                      <p className="font-medium">{selectedMessage.name}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">البريد الإلكتروني</p>
                      <p className="font-medium">{selectedMessage.email}</p>
                    </div>
                    {selectedMessage.phone && (
                      <div>
                        <p className="text-muted-foreground">الهاتف</p>
                        <p className="font-medium">{selectedMessage.phone}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-muted-foreground">التاريخ</p>
                      <p className="font-medium">
                        {new Date(selectedMessage.created_at).toLocaleString('ar-EG')}
                      </p>
                    </div>
                  </div>

                  {selectedMessage.subject && (
                    <div>
                      <p className="text-sm text-muted-foreground">الموضوع</p>
                      <p className="font-medium">{selectedMessage.subject}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">الرسالة</p>
                    <div className="bg-muted rounded-lg p-4 text-sm whitespace-pre-wrap">
                      {selectedMessage.message}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" asChild>
                      <a href={`mailto:${selectedMessage.email}`}>
                        رد بالإيميل
                      </a>
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminMessages;

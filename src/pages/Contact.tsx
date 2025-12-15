import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('contact_messages')
      .insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message
      });

    if (error) {
      toast.error('حدث خطأ أثناء إرسال الرسالة');
    } else {
      toast.success('تم إرسال رسالتك بنجاح!');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }

    setLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>تواصل معنا | MK Store</title>
        <meta name="description" content="تواصل مع فريق MK Store - نحن هنا لمساعدتك. راسلنا أو اتصل بنا للحصول على الدعم والمساعدة." />
      </Helmet>
      <Layout>
        {/* Hero */}
        <section className="py-20 bg-gradient-to-br from-cream via-background to-secondary/50">
          <div className="container-custom text-center">
            <p className="text-accent font-medium tracking-widest text-sm uppercase mb-4 animate-fade-in">
              نسعد بتواصلكم
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 animate-fade-in-up">
              تواصل معنا
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
              نحن هنا لمساعدتك. راسلنا وسنرد عليك في أقرب وقت ممكن
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="py-20">
          <div className="container-custom">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Contact Info */}
              <div className="space-y-8">
                <h2 className="text-2xl font-display font-bold">معلومات التواصل</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">الهاتف</h3>
                      <p className="text-muted-foreground" dir="ltr">+20 123 456 7890</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">البريد الإلكتروني</h3>
                      <p className="text-muted-foreground">info@mkstore.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">العنوان</h3>
                      <p className="text-muted-foreground">القاهرة، مصر</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-muted rounded-xl">
                  <h3 className="font-medium mb-2">ساعات العمل</h3>
                  <p className="text-muted-foreground text-sm">
                    السبت - الخميس: 9 صباحاً - 9 مساءً<br />
                    الجمعة: 2 ظهراً - 9 مساءً
                  </p>
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div className="bg-card rounded-xl border border-border p-8">
                  <h2 className="text-2xl font-display font-bold mb-6">أرسل رسالة</h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">الاسم *</Label>
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
                      <div className="space-y-2">
                        <Label htmlFor="phone">رقم الهاتف</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">الموضوع</Label>
                        <Input
                          id="subject"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">الرسالة *</Label>
                      <Textarea
                        id="message"
                        rows={6}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                      />
                    </div>

                    <Button type="submit" variant="gold" size="lg" disabled={loading}>
                      {loading ? 'جاري الإرسال...' : (
                        <>
                          إرسال الرسالة
                          <Send className="h-4 w-4 mr-2" />
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Contact;

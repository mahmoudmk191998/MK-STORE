import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Send } from 'lucide-react';

const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    // Simulate subscription
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('تم الاشتراك بنجاح!');
    setEmail('');
    setLoading(false);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-accent/10 via-background to-secondary/50">
      <div className="container-custom">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              اشترك في نشرتنا البريدية
            </h2>
            <p className="text-muted-foreground">
              احصل على أحدث العروض والمنتجات الجديدة مباشرة في بريدك الإلكتروني
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="أدخل بريدك الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 h-12 text-right"
              dir="rtl"
            />
            <Button type="submit" variant="gold" size="lg" disabled={loading}>
              {loading ? 'جاري الإرسال...' : (
                <>
                  اشترك الآن
                  <Send className="h-4 w-4 mr-2" />
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;

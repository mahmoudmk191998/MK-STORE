import React from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';

const Privacy: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>سياسة الخصوصية | MK Store</title>
      </Helmet>
      <Layout>
        <div className="container-custom py-12 lg:py-20">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-display font-bold mb-8">سياسة الخصوصية</h1>
            
            <div className="prose prose-lg max-w-none space-y-6 text-muted-foreground">
              <section>
                <h2 className="text-2xl font-display font-semibold text-foreground mb-4">1. جمع المعلومات</h2>
                <p>
                  نقوم بجمع المعلومات التي تقدمها لنا مباشرة، مثل الاسم والبريد الإلكتروني ورقم الهاتف وعنوان الشحن عند إتمام عملية الشراء.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-semibold text-foreground mb-4">2. استخدام المعلومات</h2>
                <p>
                  نستخدم المعلومات التي نجمعها لمعالجة طلباتك، والتواصل معك بخصوص طلبك، وتحسين خدماتنا.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-semibold text-foreground mb-4">3. حماية المعلومات</h2>
                <p>
                  نتخذ إجراءات أمنية مناسبة لحماية معلوماتك الشخصية من الوصول غير المصرح به أو التغيير أو الإفصاح.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-semibold text-foreground mb-4">4. مشاركة المعلومات</h2>
                <p>
                  لا نبيع أو نؤجر معلوماتك الشخصية لأطراف ثالثة. قد نشارك المعلومات مع شركاء الشحن لإتمام عملية التوصيل.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-semibold text-foreground mb-4">5. ملفات تعريف الارتباط</h2>
                <p>
                  نستخدم ملفات تعريف الارتباط لتحسين تجربتك على موقعنا. يمكنك تعطيلها من إعدادات متصفحك.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-semibold text-foreground mb-4">6. التواصل</h2>
                <p>
                  للاستفسارات حول سياسة الخصوصية، يرجى التواصل معنا عبر صفحة التواصل.
                </p>
              </section>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Privacy;

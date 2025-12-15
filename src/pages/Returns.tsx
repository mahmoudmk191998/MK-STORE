import React from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';

const Returns: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>سياسة الاسترجاع | MK Store</title>
      </Helmet>
      <Layout>
        <div className="container-custom py-12 lg:py-20">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-display font-bold mb-8">سياسة الاسترجاع</h1>
            
            <div className="prose prose-lg max-w-none space-y-6 text-muted-foreground">
              <section>
                <h2 className="text-2xl font-display font-semibold text-foreground mb-4">1. فترة الاسترجاع</h2>
                <p>
                  يمكنك استرجاع المنتجات خلال 14 يوماً من تاريخ الاستلام، بشرط أن يكون المنتج في حالته الأصلية.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-semibold text-foreground mb-4">2. شروط الاسترجاع</h2>
                <ul className="list-disc list-inside space-y-2">
                  <li>يجب أن يكون المنتج في حالته الأصلية وغير مستخدم</li>
                  <li>يجب إرفاق الفاتورة الأصلية</li>
                  <li>يجب أن تكون جميع العلامات والملصقات سليمة</li>
                  <li>يجب أن يكون المنتج في عبوته الأصلية</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-display font-semibold text-foreground mb-4">3. المنتجات غير القابلة للاسترجاع</h2>
                <ul className="list-disc list-inside space-y-2">
                  <li>المنتجات المستخدمة أو التالفة</li>
                  <li>المنتجات المخصصة حسب الطلب</li>
                  <li>المنتجات المعروضة بخصم خاص</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-display font-semibold text-foreground mb-4">4. إجراءات الاسترجاع</h2>
                <p>
                  للاسترجاع، يرجى التواصل معنا عبر صفحة التواصل أو الاتصال بخدمة العملاء. سيتم توجيهك للخطوات اللازمة.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-semibold text-foreground mb-4">5. استرداد الأموال</h2>
                <p>
                  يتم استرداد المبلغ خلال 7-14 يوم عمل بعد استلام المنتج والتحقق من حالته. يتم الاسترداد بنفس طريقة الدفع الأصلية.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-semibold text-foreground mb-4">6. التواصل</h2>
                <p>
                  لأي استفسارات حول الاسترجاع، يرجى التواصل معنا.
                </p>
              </section>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Returns;

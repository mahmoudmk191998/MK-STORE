import React from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';

const Terms: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>الشروط والأحكام | MK Store</title>
      </Helmet>
      <Layout>
        <div className="container-custom py-12 lg:py-20">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-display font-bold mb-8">الشروط والأحكام</h1>
            
            <div className="prose prose-lg max-w-none space-y-6 text-muted-foreground">
              <section>
                <h2 className="text-2xl font-display font-semibold text-foreground mb-4">1. مقدمة</h2>
                <p>
                  مرحباً بك في MK Store. باستخدامك لموقعنا، فإنك توافق على الالتزام بهذه الشروط والأحكام. يرجى قراءتها بعناية.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-semibold text-foreground mb-4">2. استخدام الموقع</h2>
                <p>
                  يجب استخدام هذا الموقع لأغراض مشروعة فقط. يحظر استخدام الموقع بأي طريقة قد تتسبب في إلحاق الضرر بالموقع أو بأي طرف ثالث.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-semibold text-foreground mb-4">3. المنتجات والأسعار</h2>
                <p>
                  نحتفظ بحق تغيير الأسعار في أي وقت دون إشعار مسبق. جميع الأسعار المعروضة بالجنيه المصري وتشمل الضرائب المطبقة.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-semibold text-foreground mb-4">4. الطلبات والدفع</h2>
                <p>
                  عند تقديم طلب، فإنك تؤكد أن جميع المعلومات المقدمة صحيحة ودقيقة. نحتفظ بحق رفض أي طلب لأي سبب.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-semibold text-foreground mb-4">5. الشحن والتوصيل</h2>
                <p>
                  نسعى جاهدين لتوصيل طلباتكم في الوقت المحدد. أوقات التوصيل المذكورة هي تقديرية وقد تختلف حسب الظروف.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-semibold text-foreground mb-4">6. التواصل</h2>
                <p>
                  للاستفسارات حول هذه الشروط، يرجى التواصل معنا عبر صفحة التواصل أو البريد الإلكتروني.
                </p>
              </section>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Terms;

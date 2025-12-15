import React from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import { Target, Heart, Award, Users } from 'lucide-react';

const values = [
  {
    icon: <Target className="h-8 w-8" />,
    title: 'رؤيتنا',
    description: 'أن نكون الوجهة الأولى للتسوق الإلكتروني في مصر والوطن العربي'
  },
  {
    icon: <Heart className="h-8 w-8" />,
    title: 'مهمتنا',
    description: 'تقديم تجربة تسوق استثنائية مع منتجات عالية الجودة وخدمة عملاء متميزة'
  },
  {
    icon: <Award className="h-8 w-8" />,
    title: 'الجودة',
    description: 'نختار منتجاتنا بعناية فائقة لضمان أعلى معايير الجودة'
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: 'العملاء أولاً',
    description: 'رضا عملائنا هو أولويتنا القصوى في كل ما نقوم به'
  }
];

const About: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>من نحن | MK Store</title>
        <meta name="description" content="تعرف على MK Store - متجرك الأول للتسوق الإلكتروني. نقدم لك أفضل المنتجات بأسعار تنافسية مع خدمة عملاء متميزة." />
      </Helmet>
      <Layout>
        {/* Hero */}
        <section className="py-20 bg-gradient-to-br from-cream via-background to-secondary/50">
          <div className="container-custom text-center">
            <p className="text-accent font-medium tracking-widest text-sm uppercase mb-4 animate-fade-in">
              تعرف علينا
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 animate-fade-in-up">
              من نحن
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
              MK Store هو متجرك الإلكتروني الموثوق للحصول على أفضل المنتجات بأسعار منافسة
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="py-20">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-display font-bold">
                  قصتنا
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    بدأت رحلتنا في عام 2020 برؤية واضحة: توفير تجربة تسوق إلكتروني استثنائية للعملاء في مصر والوطن العربي.
                  </p>
                  <p>
                    نؤمن بأن التسوق عبر الإنترنت يجب أن يكون سهلاً وممتعاً وآمناً. لذلك نعمل باستمرار على تطوير خدماتنا وتوسيع مجموعة منتجاتنا لتلبية احتياجات عملائنا المتنوعة.
                  </p>
                  <p>
                    اليوم، نفتخر بخدمة آلاف العملاء الراضين وتقديم مئات المنتجات عالية الجودة مع خدمة توصيل سريعة وموثوقة.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-accent/20 to-transparent rounded-3xl flex items-center justify-center">
                  <span className="text-8xl font-display font-bold text-accent/30">MK</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-secondary/50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold">
                قيمنا
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div 
                  key={value.title}
                  className="text-center space-y-4 p-6 bg-card rounded-xl border border-border animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center text-accent mx-auto">
                    {value.icon}
                  </div>
                  <h3 className="font-display font-semibold text-lg">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default About;

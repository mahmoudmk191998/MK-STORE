import React from 'react';
import { Truck, Shield, Headphones, CreditCard } from 'lucide-react';

const features = [
  {
    icon: <Truck className="h-8 w-8" />,
    title: 'شحن سريع',
    description: 'توصيل لجميع أنحاء مصر خلال 2-5 أيام عمل'
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: 'ضمان الجودة',
    description: 'جميع منتجاتنا أصلية 100% مع ضمان الاستبدال'
  },
  {
    icon: <Headphones className="h-8 w-8" />,
    title: 'دعم 24/7',
    description: 'فريق دعم متخصص متاح على مدار الساعة'
  },
  {
    icon: <CreditCard className="h-8 w-8" />,
    title: 'دفع آمن',
    description: 'طرق دفع متعددة وآمنة تناسب الجميع'
  }
];

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="text-center space-y-4 p-6 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center text-accent mx-auto">
                {feature.icon}
              </div>
              <h3 className="font-display font-semibold text-lg">
                {feature.title}
              </h3>
              <p className="text-primary-foreground/70 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

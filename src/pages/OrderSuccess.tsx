import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package, ArrowLeft } from 'lucide-react';

const OrderSuccess: React.FC = () => {
  const location = useLocation();
  const orderId = location.state?.orderId;

  return (
    <>
      <Helmet>
        <title>تم الطلب بنجاح | MK Store</title>
      </Helmet>
      <Layout>
        <div className="container-custom py-20">
          <div className="max-w-lg mx-auto text-center space-y-6">
            <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto animate-scale-in">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            
            <h1 className="text-3xl font-display font-bold animate-fade-in-up animation-delay-100">
              تم تأكيد طلبك بنجاح!
            </h1>
            
            <p className="text-muted-foreground animate-fade-in-up animation-delay-200">
              شكراً لتسوقك معنا. سنتواصل معك قريباً لتأكيد التفاصيل.
            </p>

            {orderId && (
              <div className="bg-muted rounded-lg p-4 animate-fade-in-up animation-delay-300">
                <p className="text-sm text-muted-foreground">رقم الطلب</p>
                <p className="font-mono font-medium text-lg">{orderId.slice(0, 8).toUpperCase()}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-fade-in-up animation-delay-400">
              <Button asChild variant="gold" size="lg">
                <Link to="/account">
                  <Package className="h-4 w-4 ml-2" />
                  تتبع طلبك
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/products">
                  <ArrowLeft className="h-4 w-4 ml-2" />
                  متابعة التسوق
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default OrderSuccess;

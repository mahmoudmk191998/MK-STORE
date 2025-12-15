import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <span className="text-2xl font-display font-bold">
                MK<span className="text-accent">.</span>STORE
              </span>
            </Link>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              متجرك الأول للمنتجات عالية الجودة. نقدم لك أفضل المنتجات بأسعار تنافسية وخدمة عملاء متميزة.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-accent transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">روابط سريعة</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/products" className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">
                  المنتجات
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">
                  من نحن
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">
                  تواصل معنا
                </Link>
              </li>
              <li>
                <Link to="/account" className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">
                  حسابي
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">السياسات</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/terms" className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">
                  الشروط والأحكام
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">
                  سياسة الخصوصية
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">
                  سياسة الاسترجاع
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">تواصل معنا</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-primary-foreground/70">
                <Phone className="h-4 w-4 text-accent" />
                <span dir="ltr">+20 123 456 7890</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-primary-foreground/70">
                <Mail className="h-4 w-4 text-accent" />
                <span>info@mkstore.com</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-primary-foreground/70">
                <MapPin className="h-4 w-4 text-accent mt-0.5" />
                <span>القاهرة، مصر</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-12 pt-8">
          <p className="text-center text-sm text-primary-foreground/50">
            © {new Date().getFullYear()} MK Store. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

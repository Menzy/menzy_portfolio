import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Shop } from '@/components/Shop';

export function ShopPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32">
        <Shop />
      </div>
      <Footer />
    </div>
  );
}
import { useParams } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductDetails } from '@/components/ProductDetails';

export function ProductPage() {
  const { slug } = useParams();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32">
        <ProductDetails slug={slug} />
      </div>
      <Footer />
    </div>
  );
}
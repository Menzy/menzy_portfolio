import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Blog } from '@/components/Blog';

export function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32">
        <Blog />
      </div>
      <Footer />
    </div>
  );
}
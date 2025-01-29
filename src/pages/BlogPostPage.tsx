import { useParams } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { BlogPost } from '@/components/BlogPost';

export function BlogPostPage() {
  const { slug } = useParams();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32">
        <BlogPost slug={slug} />
      </div>
      <Footer />
    </div>
  );
}
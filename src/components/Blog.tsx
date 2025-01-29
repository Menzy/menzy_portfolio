import { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const blogPosts = [
  {
    slug: "the-art-of-visual-storytelling",
    title: "The Art of Visual Storytelling",
    excerpt: "Discover how to create compelling narratives through photography",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32",
    date: "April 15, 2024",
    category: "Photography",
    readTime: "5 min read"
  },
  {
    slug: "behind-the-lens-wedding-photography",
    title: "Behind the Lens: Wedding Photography",
    excerpt: "Tips and tricks for capturing perfect wedding moments",
    image: "https://images.unsplash.com/photo-1537633552985-df8429e8048b",
    date: "April 12, 2024",
    category: "Weddings",
    readTime: "4 min read"
  },
  {
    slug: "essential-camera-gear-2024",
    title: "Essential Camera Gear for 2024",
    excerpt: "A comprehensive guide to must-have photography equipment",
    image: "https://images.unsplash.com/photo-1516035645876-b019b3e64958",
    date: "April 8, 2024",
    category: "Gear",
    readTime: "7 min read"
  }
];

export function Blog() {
  const postsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    postsRef.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="blog" className="pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold animate-slide-up">
            Latest Stories
          </h2>
          <Button variant="ghost" className="group">
            View all posts
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <Link to={`/blog/${post.slug}`} key={index}>
              <Card 
                className="overflow-hidden group opacity-0 h-full"
                ref={el => postsRef.current[index] = el}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-muted-foreground mb-3">
                    <span>{post.category}</span>
                    <span className="mx-2">•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {post.excerpt}
                  </p>
                  <div className="text-sm text-muted-foreground">
                    {post.date}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
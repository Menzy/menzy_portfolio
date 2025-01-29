import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const blogPosts = {
  'the-art-of-visual-storytelling': {
    title: "The Art of Visual Storytelling",
    content: `
      <p>Visual storytelling is one of the most powerful ways to communicate ideas and emotions. Through carefully composed images, photographers can create narratives that resonate deeply with viewers.</p>
      
      <h2>The Elements of Visual Storytelling</h2>
      <p>Effective visual storytelling combines several key elements:</p>
      <ul>
        <li>Composition</li>
        <li>Lighting</li>
        <li>Color theory</li>
        <li>Subject matter</li>
      </ul>

      <h2>Creating Emotional Connection</h2>
      <p>The most impactful photographs are those that forge an emotional connection with the viewer. This can be achieved through:</p>
      <ul>
        <li>Authentic moments</li>
        <li>Human elements</li>
        <li>Environmental context</li>
      </ul>
    `,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32",
    date: "April 15, 2024",
    category: "Photography",
    readTime: "5 min read",
    author: {
      name: "James Lens",
      image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36",
      role: "Professional Photographer"
    }
  }
};

interface BlogPostProps {
  slug?: string;
}

export function BlogPost({ slug }: BlogPostProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const post = slug ? blogPosts[slug as keyof typeof blogPosts] : null;

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

    if (contentRef.current) {
      observer.observe(contentRef.current);
    }

    return () => observer.disconnect();
  }, []);

  if (!post) {
    return (
      <div className="container-content py-12">
        <p>Post not found</p>
      </div>
    );
  }

  return (
    <article className="container-content py-12">
      <Link to="/blog">
        <Button variant="ghost" className="group mb-8">
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Blog
        </Button>
      </Link>

      <div ref={contentRef} className="space-y-8 opacity-0">
        <div className="aspect-[2/1] overflow-hidden rounded-lg">
          <img 
            src={post.image} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={post.author.image} alt={post.author.name} />
              <AvatarFallback>{post.author.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">{post.author.name}</div>
              <div className="text-sm text-muted-foreground">{post.author.role}</div>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              {post.date}
            </div>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              {post.readTime}
            </div>
            <div className="flex items-center">
              <Tag className="mr-2 h-4 w-4" />
              {post.category}
            </div>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold">{post.title}</h1>

        <div 
          className="prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </article>
  );
}
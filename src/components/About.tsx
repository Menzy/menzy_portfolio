import { useEffect, useRef } from 'react';
import { Mail, Instagram, Timer as Vimeo } from 'lucide-react';
import { Button } from "@/components/ui/button";

export function About() {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-slide-in');
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

  return (
    <section id="about" className="pt-32 pb-20">
      <div className="container-content">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1605379399642-870262d3d051" 
              alt="Profile"
              className="rounded-lg hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div ref={contentRef} className="opacity-0">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">About Me</h2>
            <p className="text-lg text-muted-foreground mb-6">
              With over a decade of experience in visual storytelling, I've had the privilege of working 
              with brandes and individuals to bring their stories to life through the lens of my camera.
            </p>
            <div className="flex space-x-4">
              <Button 
                variant="outline" 
                size="icon"
                className="hover:scale-110 transition-transform"
              >
                <Instagram className="h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                className="hover:scale-110 transition-transform"
              >
                <Vimeo className="h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                className="hover:scale-110 transition-transform"
              >
                <Mail className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
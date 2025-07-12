import { useEffect, useRef } from 'react';
import { Sparkles, Camera, Palette, BookOpen } from 'lucide-react';
import { Card } from "@/components/ui/card";

const comingSoonItems = [
  {
    icon: Camera,
    title: "Photography Presets",
    description: "Professional Lightroom presets to transform your photos"
  },
  {
    icon: BookOpen,
    title: "Masterclasses",
    description: "In-depth courses covering advanced photography techniques"
  },
  {
    icon: Palette,
    title: "Editing Guides",
    description: "Step-by-step tutorials for stunning photo editing"
  },
  {
    icon: Sparkles,
    title: "Exclusive Bundles",
    description: "Curated collections at special prices"
  }
];

export function Shop() {
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

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

    itemsRef.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="shop" className="pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 animate-slide-up">
            Shop
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-center mb-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Sparkles className="h-8 w-8 text-primary mr-3 animate-pulse" />
              <h3 className="text-2xl md:text-3xl font-semibold text-primary">
                Something Amazing is Coming Soon!
              </h3>
              <Sparkles className="h-8 w-8 text-primary ml-3 animate-pulse" />
            </div>
            <p className="text-lg text-muted-foreground mb-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              We're crafting an exclusive collection of photography resources that will elevate your creative journey. 
              Get ready for premium presets, masterclasses, and tools designed by professionals, for professionals.
            </p>
            <div className="inline-flex items-center px-6 py-3 bg-primary/10 rounded-full border border-primary/20 animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <span className="text-primary font-medium">🎯 Launching Soon - Stay Tuned!</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {comingSoonItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <Card 
                key={index}
                className="p-8 text-center opacity-0 hover:shadow-lg transition-all duration-300 border-dashed border-2 hover:border-primary/50"
                ref={el => itemsRef.current[index] = el}
                style={{ animationDelay: `${0.8 + index * 0.2}s` }}
              >
                <div className="mb-6">
                  <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <IconComponent className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className="text-xs text-primary font-medium uppercase tracking-wider">
                  Coming Soon
                </div>
              </Card>
            );
          })}
        </div>
        
        <div className="text-center mt-16">
          <div className="max-w-md mx-auto p-6 bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl border border-primary/20 animate-slide-up" style={{ animationDelay: '1.6s' }}>
            <h4 className="text-lg font-semibold mb-2">Want to be the first to know?</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Follow our journey and get notified when we launch our exclusive photography collection.
            </p>
            <div className="text-primary font-medium text-sm">
              📧 Updates coming to your inbox soon!
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
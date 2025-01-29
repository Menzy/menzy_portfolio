import { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import Typewriter from 'typewriter-effect';

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrolled = window.scrollY;
        heroRef.current.style.setProperty('--scroll-offset', `${scrolled * 0.5}px`);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={heroRef} className="relative h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <iframe 
          className="w-[300%] h-[300%] absolute -left-[100%] -top-[100%]"
          src="https://www.youtube.com/embed/rzjF6_uxkJw?autoplay=1&loop=1&playlist=rzjF6_uxkJw&controls=0&mute=1&showinfo=0&rel=0&playsinline=1&vq=hd2160&hd=1&modestbranding=1"
          title="Background Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          style={{ pointerEvents: 'none' }}
        />
      </div>
      {/* Subtle top overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent" />
      {/* Bottom gradient for smooth transition */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" style={{ top: '50%' }} />
      <div className="relative z-10 container mx-auto px-6">
        <div className="max-w-4xl">
          <h1 className="text-[4rem] md:text-[5rem] font-bold text-white leading-none mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div>Capturing</div>
            <div>Stories</div>
            <div>People <span className="text-primary inline-block">
              <Typewriter
                options={{
                  strings: ['Want', 'Share', 'Love'],
                  autoStart: true,
                  loop: true,
                  deleteSpeed: 50,
                  delay: 80,
                  pauseFor: 1500,
                }}
              />
            </span></div>
          </h1>
          <p className="text-2xl text-white/80 mb-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            Award-winning filmmaker and photographer
          </p>
          <Button 
            size="lg" 
            className="rounded-full animate-slide-up hover:scale-105 transition-transform text-lg px-8 py-6"
            style={{ animationDelay: '0.6s' }}
          >
            View My Work
          </Button>
        </div>
      </div>
    </section>
  );
}
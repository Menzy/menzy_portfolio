import { useEffect, useRef } from "react";

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!footerRef.current || !textRef.current) return;

      const footerRect = footerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate when footer starts coming into view
      const footerTop = footerRect.top;
      const triggerPoint = windowHeight * 0.8; // Start effect when footer is 80% down the screen
      
      if (footerTop <= triggerPoint) {
        // Calculate progress from 0 to 1 as footer comes into view
        const progress = Math.min(1, (triggerPoint - footerTop) / (windowHeight * 0.5));
        
        // Move text down by 120px with easing
        const translateY = -120 + (progress * 120);
        textRef.current.style.transform = `translateY(${translateY}px)`;
      } else {
        // Reset position when footer is out of view
        textRef.current.style.transform = `translateY(-120px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <footer ref={footerRef} className="relative min-h-[70vh] border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black overflow-hidden">
      {/* Background Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <h1 
          ref={textRef}
          className="font-bold text-[clamp(50px,12vw,250px)] tracking-tight text-black select-none transition-transform duration-300 ease-out"
          style={{ transform: 'translateY(-120px)' }}
        >
          wanmenzy
        </h1>
      </div>

      {/* Bento Grid */}
      <div className="relative z-10 p-2">
        {/* Bento Grid with specific heights like the reference */}
        <div className="px-2 lg:px-4 pt-8 lg:pt-16 pb-8 lg:pb-4 grid grid-cols-12 gap-2 lg:gap-4">
          
          {/* Work - Large card on left */}
          <a 
            href="/work"
            className="col-span-12 lg:col-span-8 flex items-end p-4 lg:p-6 bg-neutral-300/50 backdrop-blur-sm h-[200px] lg:h-[350px] rounded-lg lg:rounded-xl text-[clamp(16px,1.4vw,24px)] font-medium leading-tight cursor-pointer hover:backdrop-blur-md transition-all duration-500"
          >
            Work
          </a>

          {/* Lab - Tall card on top right */}
          <a 
            href="/lab"
            className="col-span-12 lg:col-span-4 flex items-end p-4 lg:p-6 bg-neutral-300/50 backdrop-blur-sm h-[200px] lg:h-[350px] rounded-lg lg:rounded-xl text-[clamp(16px,1.4vw,24px)] font-medium leading-tight cursor-pointer hover:backdrop-blur-md transition-all duration-500"
          >
            Lab
          </a>

          {/* Contact & Github - Small cards stacked on mobile, side by side on desktop */}
          <div className="col-span-12 lg:col-span-4 grid grid-cols-2 lg:grid-rows-2 gap-2 lg:gap-4">
            <a 
              href="mailto:contact@wanmenzy.com" 
              className="lg:col-span-12 flex items-end p-4 lg:p-6 bg-neutral-300/50 backdrop-blur-sm h-[120px] lg:h-full rounded-lg lg:rounded-xl text-[clamp(16px,1.4vw,24px)] font-medium leading-tight cursor-pointer hover:backdrop-blur-md transition-all duration-500"
            >
              Contact
            </a>
            <a 
              href="https://github.com/menzy" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="lg:col-span-12 flex items-end p-4 lg:p-6 bg-neutral-300/50 backdrop-blur-sm h-[120px] lg:h-full rounded-lg lg:rounded-xl text-[clamp(16px,1.4vw,24px)] font-medium leading-tight cursor-pointer hover:backdrop-blur-md transition-all duration-500"
            >
              Github
            </a>
          </div>

          {/* Instagram - Bottom left */}
          <a 
            href="https://instagram.com/1menzy" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="col-span-6 lg:col-span-4 flex items-end p-4 lg:p-6 bg-neutral-300/50 backdrop-blur-sm h-[120px] lg:h-[350px] rounded-lg lg:rounded-xl text-[clamp(16px,1.4vw,24px)] font-medium leading-tight cursor-pointer hover:backdrop-blur-md transition-all duration-500"
          >
            Instagram
          </a>

          {/* LinkedIn - Bottom right */}
          <a 
            href="https://linkedin.com/in/wanmenzy" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="col-span-6 lg:col-span-4 flex items-end p-4 lg:p-6 bg-neutral-300/50 backdrop-blur-sm h-[120px] lg:h-[350px] rounded-lg lg:rounded-xl text-[clamp(16px,1.4vw,24px)] font-medium leading-tight cursor-pointer hover:backdrop-blur-md transition-all duration-500"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}

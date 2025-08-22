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
    <footer ref={footerRef} className="relative h-[70vh] border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black overflow-hidden">
      {/* Background Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <h1 
          ref={textRef}
          className="text-[8rem] md:text-[10rem] lg:text-[12rem] font-black text-black select-none transition-transform duration-300 ease-out"
          style={{ transform: 'translateY(-120px)' }}
        >
          wanmenzy
        </h1>
      </div>

      {/* Bento Grid */}
      <div className="relative z-10 h-full p-2">
        {/* 3x3 grid with first row twice the height of second and third rows */}
        <div className="w-full h-full p-2 grid grid-cols-3 gap-4" style={{ gridTemplateRows: '2fr 1fr 1fr' }}>
          {/* Top Row */}
          {/* Work - top-left spanning 2 columns */}
          <div className="col-start-1 col-span-2 row-start-1 bg-neutral-200/50 backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-2xl p-6 flex items-end justify-start hover:bg-neutral-200/65 hover:backdrop-blur-md transition-all duration-300 cursor-pointer">
            <span className="text-lg font-medium text-foreground">Work</span>
          </div>

          {/* Lab - top-right single cell */}
          <div className="col-start-3 row-start-1 bg-neutral-200/50 backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-2xl p-6 flex items-end justify-start hover:bg-neutral-200/65 hover:backdrop-blur-md transition-all duration-300 cursor-pointer">
            <span className="text-lg font-medium text-foreground">Lab</span>
          </div>

          {/* Middle/Bottom Rows */}
          {/* YouTube - middle-left */}
          <a
            href="https://youtube.com/@menzy"
            target="_blank"
            rel="noopener noreferrer"
            className="col-start-1 row-start-2 bg-neutral-200/50 backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-2xl p-6 flex items-end justify-start hover:bg-neutral-200/65 hover:backdrop-blur-md transition-all duration-300"
          >
            <span className="text-lg font-medium text-foreground">YouTube</span>
          </a>

          {/* Github - bottom-left */}
          <a
            href="https://github.com/menzy"
            target="_blank"
            rel="noopener noreferrer"
            className="col-start-1 row-start-3 bg-neutral-200/50 backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-2xl p-6 flex items-end justify-start hover:bg-neutral-200/65 hover:backdrop-blur-md transition-all duration-300"
          >
            <span className="text-lg font-medium text-foreground">Github</span>
          </a>

          {/* Instagram - center column spanning two rows (middle and bottom) */}
          <a
            href="https://instagram.com/1menzy"
            target="_blank"
            rel="noopener noreferrer"
            className="col-start-2 row-start-2 row-span-2 bg-neutral-200/50 backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-2xl p-6 flex items-end justify-start hover:bg-neutral-200/65 hover:backdrop-blur-md transition-all duration-300"
          >
            <span className="text-lg font-medium text-foreground">Instagram</span>
          </a>

          {/* LinkedIn - middle-right */}
          <a
            href="https://linkedin.com/in/wanmenzy"
            target="_blank"
            rel="noopener noreferrer"
            className="col-start-3 row-start-2 row-span-2 bg-neutral-200/50 backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-2xl p-6 flex items-end justify-start hover:bg-neutral-200/65 hover:backdrop-blur-md transition-all duration-300"
          >
            <span className="text-lg font-medium text-foreground">LinkedIn</span>
          </a>
        </div>
      </div>
    </footer>
  );
}

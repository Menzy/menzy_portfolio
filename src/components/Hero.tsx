import { useEffect, useRef } from "react";

export function Hero() {
  const videoRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!videoRef.current) return;

      const scrollY = window.scrollY;
      const videoHeight = videoRef.current.offsetHeight;
      // Progress completes when bottom of video reaches top of viewport
      const progress = Math.min(scrollY / videoHeight, 1);

      // Only scale down, no translateY to keep natural scroll flow
      const scale = 1 - progress * 0.05; // Very subtle 5% scale down (1.0 to 0.95)
      
      videoRef.current.style.transform = `scale(${scale})`;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const adjustTextScale = () => {
      if (textRef.current && containerRef.current) {
        const container = containerRef.current;
        const text = textRef.current;
        
        // Reset transform to get natural width
        text.style.transform = 'scaleX(1)';
        
        const containerWidth = container.offsetWidth;
        const textWidth = text.scrollWidth;
        
        if (textWidth > 0) {
          const scaleX = containerWidth / textWidth;
          text.style.transform = `scaleX(${scaleX})`;
        }
      }
    };

    adjustTextScale();
    window.addEventListener('resize', adjustTextScale);
    
    return () => window.removeEventListener('resize', adjustTextScale);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-[100vh] dark:bg-black bg-white"
    >
      {/* Video Container */}
      <div
        ref={videoRef}
        className="sticky overflow-hidden bg-black will-change-transform"
        style={{
          top: "60px", // Space for new navbar height
          left: "6px",
          right: "6px",
          bottom: "6px", 
          width: "calc(100% - 12px)", // Full width minus left + right padding
          height: "calc(100vh - 66px)", // Full height minus navbar space and bottom padding
          borderRadius: "24px", // Increased rounded corners
          transformOrigin: "center center",
          transition: "transform 0.2s ease-out",
        }}
      >
        <div className="relative w-full h-full">
          <iframe
            className="absolute w-[177.78vh] h-[100vw] min-w-full min-h-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:w-[200%] md:h-[200%] md:-left-[50%] md:-top-[50%] md:translate-x-0 md:translate-y-0 lg:w-[160%] lg:h-[160%] lg:-left-[30%] lg:-top-[30%]"
            src="https://www.youtube.com/embed/rzjF6_uxkJw?autoplay=1&loop=1&playlist=rzjF6_uxkJw&controls=0&mute=1&showinfo=0&rel=0&playsinline=1&vq=hd1080&hd=1&modestbranding=1"
            title="Background Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            style={{ pointerEvents: "none" }}
          />
        </div>

        {/* Hero Text - spans full width */}
        <div className="absolute bottom-6 left-0 right-0 z-10 px-6">
          <div className="flex items-center justify-between w-full leading-none">
            <span className="text-white text-sm font-medium tracking-wider uppercase">A</span>
            <span className="text-white text-sm font-medium tracking-wider uppercase">REALLY</span>
            <span className="text-white text-sm font-medium tracking-wider uppercase">GOOD</span>
          </div>
          <div ref={containerRef} className="mt-1 w-full -mx-6 overflow-hidden">
            <span 
              ref={textRef}
              className="text-white font-bold tracking-tight uppercase whitespace-nowrap block"
              style={{
                fontSize: '15vw',
                transformOrigin: 'left center',
                width: 'fit-content',
                lineHeight: '0.8'
              }}
            >
              FILMMAKER
            </span>
          </div>
        </div>

        {/* Let's Work Button - centered in video */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 group">
          <div className="relative bg-white text-black rounded-lg shadow-none transition-all duration-300 ease-in-out group-hover:h-32 group-hover:w-64 h-12 w-32 overflow-hidden cursor-pointer"
               onClick={() => {
                 const element = document.getElementById("contact");
                 if (element) {
                   element.scrollIntoView({ behavior: "smooth" });
                 }
               }}>
            {/* Default state - Let's Work */}
            <div className="flex items-center justify-center h-12 px-6 text-sm font-medium group-hover:opacity-0 transition-opacity duration-300">
              Let's Work
            </div>
            
            {/* Expanded state - Contact info */}
             <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2 flex flex-col justify-between">
               <div className="text-left">
                 <div className="text-xs font-semibold mb-1">Team Lead at</div>
                 <div className="text-xs mb-1">EnzymsGH</div>
                 <div className="text-xl font-bold">Wan Menzy</div>
               </div>
              
              <div className="flex items-center justify-between">
                {/* Circle on bottom left */}
                <div className="w-4 h-4 bg-black rounded-full"></div>
                
                {/* Small Let's talk button on right */}
                <button className="bg-black text-white text-xs px-2 py-1 rounded text-[10px]">
                  Let's talk
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

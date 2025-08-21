import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

export function Hero() {
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!videoRef.current) return;

      const scrollY = window.scrollY;
      const videoHeight = videoRef.current.offsetHeight;
      // Progress completes when bottom of video reaches top of viewport
      const progress = Math.min(scrollY / videoHeight, 1);

      // Scale down and move up simultaneously - both finish together
      const scale = 1 - progress * 0.05; // Very subtle 5% scale down (1.0 to 0.95)
      const translateY = -progress * videoHeight; // Move up by video height
      
      videoRef.current.style.transform = `scale(${scale}) translateY(${translateY}px)`;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-[200vh] dark:bg-black bg-white"
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

        {/* Let's Work Button - anchored to bottom right of video */}
        <Button
          onClick={() => {
            const element = document.getElementById("contact");
            if (element) {
              element.scrollIntoView({ behavior: "smooth" });
            }
          }}
          variant="default"
          className="absolute bottom-6 right-6 rounded-full h-12 px-6 text-sm font-medium z-10"
        >
          Let's Work
        </Button>

      </div>
    </section>
  );
}

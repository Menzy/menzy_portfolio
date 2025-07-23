import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import Typewriter from "typewriter-effect";

export function Hero() {
  const videoRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!videoRef.current || !contentRef.current) return;

      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const progress = Math.min(scrollY / viewportHeight, 1);

      // Scale and round corners of video container
      const scale = 1 - progress * 0.1;
      const borderRadius = Math.min(32 * progress, 32);
      videoRef.current.style.transform = `scale(${scale})`;
      videoRef.current.style.borderRadius = `${borderRadius}px`;

      // Fade out content
      const opacity = 1 - progress * 1.5;
      if (contentRef.current) {
        contentRef.current.style.opacity = Math.max(opacity, 0).toString();
      }
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
        className="sticky top-0 w-full h-screen overflow-hidden bg-black will-change-transform"
        style={{
          transformOrigin: "center center",
          transition: "transform 0.2s ease-out, border-radius 0.2s ease-out",
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

        {/* Content */}
        <div
          ref={contentRef}
          className="absolute inset-0 flex items-center z-10"
          style={{ transition: "opacity 0.2s ease-out" }}
        >
          <div className="container mx-auto px-6">
            <div className="max-w-4xl">
              <h1
                className="text-[3rem] md:text-[5rem] font-bold text-white leading-none mb-8 animate-slide-up"
                style={{ animationDelay: "0.2s" }}
              >
                <div>Capturing</div>
                <div>Stories</div>
                <div className="flex flex-wrap items-center">
                  People{" "}
                  <span className="text-primary inline-block ml-2">
                    <Typewriter
                      options={{
                        strings: ["Want", "Share", "Love"],
                        autoStart: true,
                        loop: true,
                        deleteSpeed: 50,
                        delay: 80,
                      }}
                    />
                  </span>
                </div>
              </h1>
              <p
                className="text-2xl text-white/80 mb-8 animate-slide-up"
                style={{ animationDelay: "0.4s" }}
              >
                Mobile Content Creator and Filmmaker
              </p>
              <Button
                size="lg"
                className="rounded-full animate-slide-up hover:scale-105 transition-transform text-lg px-8 py-6"
                style={{ animationDelay: "0.6s" }}
              >
                View My Work
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const projects = [
  {
    id: 1,
    title: "Fly",
    subtitle: "Shot on iPhone 11 with the Zhiyun Crane M2 and the SandMarc Hybrid PL filters. A cinematic showcase demonstrating the power of mobile filmmaking with professional-grade accessories and techniques.",
    videoId: "83aPs5jSBoA",
    thumbnailUrl: `https://img.youtube.com/vi/83aPs5jSBoA/maxresdefault.jpg`,
  },
  {
    id: 2,
    title: "Alone",
    subtitle: "The Zhiyun Crane 4 has been an amazing Gimbal to work with, and over the past 10 months of usage, here's what I've been testing with this new Gimbal. A showcase of advanced gimbal techniques and cinematic storytelling.",
    videoId: "YdbXTZ2RljE",
    thumbnailUrl: `https://img.youtube.com/vi/YdbXTZ2RljE/maxresdefault.jpg`,
  },
  {
    id: 3,
    title: "VET Toolbox",
    subtitle: "Building skills for agricultural productivity in Ghana. The British Council's VET Toolbox programme addresses skills shortage in Ghana's agricultural sector through tailored youth training and public-private partnerships.",
    videoId: "9Z8-O2f6egE",
    thumbnailUrl: `https://img.youtube.com/vi/9Z8-O2f6egE/maxresdefault.jpg`,
  },
  {
    id: 4,
    title: "Scary Deep Trails",
    subtitle: "Shot on Xiaomi 11T Pro - A cinematic journey exploring the depths of the ocean and overcoming fears.",
    videoId: "L_dHJKwtlBc",
    thumbnailUrl: `https://img.youtube.com/vi/L_dHJKwtlBc/maxresdefault.jpg`,
  },
];

interface ProjectCardProps {
  project: typeof projects[0];
}

function ProjectCard({ project }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showIframe, setShowIframe] = useState(false);
  const tickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tickerRef.current) {
      const element = tickerRef.current;
      const scrollWidth = element.scrollWidth;
      const clientWidth = element.clientWidth;
      
      if (scrollWidth > clientWidth) {
        // Calculate duration based on text length for consistent speed
        const duration = scrollWidth / 60; // Adjust speed as needed
        element.style.animation = `scroll-ticker-seamless ${duration}s linear infinite`;
      }
    }
  }, []);

  useEffect(() => {
    if (isHovered) {
      // Immediate start of scaling animation
      setShowIframe(true);
    } else {
      setShowIframe(false);
    }
  }, [isHovered]);

  return (
    <motion.div
      className="relative bg-black p-4 rounded-xl group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Thumbnail Section with all corners rounded */}
      <div className="relative w-full aspect-video overflow-hidden rounded-lg">
        <img
          src={project.thumbnailUrl}
          alt={project.title}
          className={`w-full h-full object-cover transition-all duration-500 ${
            showIframe ? 'blur-md scale-105 opacity-70' : 'blur-0 scale-100 opacity-100'
          }`}
        />

        {/* YouTube Iframe - appears on hover as overlay (half size, centered) */}
        <AnimatePresence>
          {showIframe && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
            >
              <motion.div
                initial={{ scaleY: 0, scaleX: 0.6 }}
                animate={{ scaleY: 1, scaleX: 1 }}
                exit={{ scaleY: 0, scaleX: 0.6 }}
                transition={{ 
                  duration: isHovered ? 0.5 : 0.3,
                  ease: isHovered ? [0.34, 1.56, 0.64, 1] : [0.25, 0.1, 0.25, 1],
                  type: "tween"
                }}
                style={{ originY: 1, originX: 0.5 }}
                className="w-4/5 md:w-3/5 h-4/5 md:h-3/5 rounded-lg overflow-hidden shadow-lg bg-black"
              >
                <iframe
                  src={`https://www.youtube.com/embed/${project.videoId}?autoplay=1&controls=0&showinfo=0&rel=0&modestbranding=1&loop=1&playlist=${project.videoId}&iv_load_policy=3&cc_load_policy=0&fs=0&disablekb=1`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom content section with sharp cut from thumbnail */}
      <div className="bg-black py-4">
        <h3 className="text-white text-2xl font-bold mb-3 px-4">{project.title}</h3>
        <div className="relative overflow-hidden">
          {/* Fade in gradient on the left */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-black via-black/80 to-transparent z-10 pointer-events-none" />
          
          {/* Fade out gradient on the right */}
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-black via-black/80 to-transparent z-10 pointer-events-none" />
          
          <div
            ref={tickerRef}
            className="text-white/70 text-base whitespace-nowrap ticker-text-seamless px-4"
          >
            <span className="inline-block">
              {project.subtitle} • {project.subtitle} • {project.subtitle} • {project.subtitle} • {project.subtitle} • {project.subtitle} • 
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Projects() {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
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

  useEffect(() => {
    // Add CSS for ticker animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes scroll-ticker {
        0% {
          transform: translateX(100%);
        }
        100% {
          transform: translateX(-100%);
        }
      }
      
      @keyframes scroll-ticker-seamless {
        0% {
          transform: translateX(0%);
        }
        100% {
          transform: translateX(-50%);
        }
      }
      
      .ticker-text {
        animation: scroll-ticker 15s linear infinite;
      }
      
      .ticker-text-seamless {
        animation: scroll-ticker-seamless 15s linear infinite;
      }
      
      .ticker-text:hover,
      .ticker-text-seamless:hover {
        animation-play-state: paused;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <section
      id="projects"
      className="min-h-screen py-32 bg-background"
    >
      {/* Section Header */}
      <div className="px-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-left"
        >
          <h2 className="text-7xl md:text-9xl font-extrabold uppercase tracking-tight">
            Selected Projects
          </h2>
        </motion.div>
      </div>

      {/* Projects Grid - Full Width with Grey Container */}
      <div className="px-4">
        <div className="bg-gray-200 dark:bg-gray-800 rounded-2xl p-4">
          <div 
            ref={contentRef}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full"
          >
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1 
                }}
                viewport={{ once: true }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

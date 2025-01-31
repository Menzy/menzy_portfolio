import { useEffect, useRef, useState } from "react";
import { Play, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const projects = [
  {
    number: "00",
    title: "Global Commercial",
    description:
      "A cinematic journey through the Rockies, capturing the raw beauty of nature and the spirit of adventure. Our team of 12 professionals ventured deep into the wilderness, battling extreme conditions to document the untold stories of these majestic peaks. Using state-of-the-art equipment and innovative techniques, we've created a visual narrative that showcases both the grandeur of the mountains and the intimate details of their delicate ecosystem.",
    websiteUrl: "www.newbalance.com",
    videoId: "-nf57pBJDTk",
    bgColor: "bg-blue-500/10",
  },
  {
    number: "01",
    title: "Urban Stories",
    description:
      "Exploring the vibrant pulse of city life through a cinematic lens. Our crew captured the essence of urban culture, from street artists to night markets. This documentary-style piece weaves together stories of community, creativity, and the relentless energy that defines modern metropolitan life.",
    websiteUrl: "www.nike.com",
    videoId: "dQw4w9WgXcQ",
    bgColor: "bg-lime-500/10",
  },
  {
    number: "02",
    title: "Ocean Depths",
    description:
      "Diving into the mysterious world beneath the waves. This groundbreaking underwater campaign required innovative camera techniques and custom-built equipment. Working with marine biologists, we documented rare species and captured the delicate balance of marine ecosystems.",
    websiteUrl: "www.patagonia.com",
    videoId: "ScMzIvxBSi4",
    bgColor: "bg-emerald-500",
  },
  {
    number: "03",
    title: "Desert Dreams",
    description:
      "A mesmerizing journey through the world's most dramatic desert landscapes. Our team braved extreme temperatures and challenging conditions to capture the stark beauty of these ancient landscapes. Using drone technology and time-lapse photography, we revealed patterns and colors that tell the story of time itself.",
    websiteUrl: "www.natgeo.com",
    videoId: "u9Dg-g7t2l4",
    bgColor: "bg-orange-500",
  },
];

export function BehindScenes() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const currentProject = projects[currentIndex];

  const nextProject = () => {
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const previousProject = () => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

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

  return (
    <section id="behind-scenes" className="min-h-screen py-32">
      <div className="container mx-auto px-4">
        {/* Project Navigation */}
        <div className="relative flex items-center mb-8">
          {/* Left Arrow */}
          <Button
            variant="outline"
            size="icon"
            onClick={previousProject}
            className="absolute left-0 rounded-full z-10"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Center Line Indicators */}
          <div className="flex items-center justify-center gap-4 w-full px-16">
            {projects.map((project, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className="group flex flex-col items-center gap-2"
              >
                <div
                  className={`h-[2px] w-12 transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-primary w-16"
                      : "bg-muted-foreground/30 group-hover:bg-muted-foreground/50"
                  }`}
                />
                <span
                  className={`text-xs transition-colors ${
                    index === currentIndex
                      ? "text-primary"
                      : "text-muted-foreground group-hover:text-muted-foreground/80"
                  }`}
                >
                  {project.number}
                </span>
              </button>
            ))}
          </div>

          {/* Right Arrow */}
          <Button
            variant="outline"
            size="icon"
            onClick={nextProject}
            className="absolute right-0 rounded-full z-10"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 md:gap-6 lg:h-[80vh] lg:max-h-[800px]">
          {/* Content Section */}
          <div className="order-2 lg:order-1 lg:col-span-5 flex flex-col gap-4 md:gap-6">
            {/* Number, Title, and URL Section */}
            <div className={`h-[40%] relative overflow-hidden rounded-3xl ${currentProject.bgColor} hover:bg-opacity-20 transition-all duration-300 backdrop-blur p-8 flex flex-col justify-between border border-white/5`}>
              <div className="space-y-6">
                <div className="text-4xl font-bold opacity-50">
                  {currentProject.number}
                </div>
                <h2 className="text-4xl font-bold">
                  {currentProject.title}
                </h2>
              </div>
              <a
                href={`https://${currentProject.websiteUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors group w-fit"
              >
                {currentProject.websiteUrl}
                <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>
            </div>

            {/* Description Section */}
            <div className="lg:h-[60%] rounded-3xl bg-muted p-6 md:p-8 flex flex-col overflow-hidden">
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-base md:text-lg leading-relaxed">
                  {currentProject.description}
                </p>
              </div>
            </div>
          </div>

          {/* Video Section */}
          <div className="order-1 lg:order-2 lg:col-span-7 relative overflow-hidden rounded-3xl group aspect-video lg:aspect-auto">
            {/* Background Video */}
            <div className="relative w-full h-full overflow-hidden">
              <iframe
                className="absolute inset-0 w-full h-full object-cover 
               lg:scale-[2]   
               scale-100 translate-x-0 translate-y-0"
                src={`https://www.youtube.com/embed/${currentProject.videoId}?autoplay=1&loop=1&playlist=${currentProject.videoId}&controls=0&mute=1&showinfo=0&rel=0`}
                title="Behind the Scenes"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              ></iframe>
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

            {/* Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                variant="outline"
                size="icon"
                className="w-16 h-16 rounded-full bg-black/50 hover:bg-black/70 border-white/50 hover:border-white transition-all duration-300 group-hover:scale-110"
                onClick={() => setShowVideo(true)}
              >
                <Play className="h-8 w-8 text-white" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <Dialog open={showVideo} onOpenChange={setShowVideo}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {currentProject.title} - Behind the Scenes
            </DialogTitle>
          </DialogHeader>
          <div className="aspect-video">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${currentProject.videoId}?autoplay=1`}
              title="Behind the Scenes"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}

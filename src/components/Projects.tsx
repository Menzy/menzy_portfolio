import { useEffect, useRef, useState } from "react";
import { Play, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "motion/react";

const projects = [
  {
    number: "00",
    title: "Fly",
    description:
      "Shot on iPhone 11 with the Zhiyun Crane M2 and the SandMarc Hybrid PL filters. A cinematic showcase demonstrating the power of mobile filmmaking with professional-grade accessories and techniques.",
    websiteUrl: "www.sandmarc.com",
    videoId: "83aPs5jSBoA",
    bgColor: "bg-blue-200 dark:bg-blue-900/60",
  },
  {
    number: "01",
    title: "Alone",
    description:
      "The Zhiyun Crane 4 has been an amazing Gimbal to work with, and over the past 10 months of usage, here's what I've been testing with this new Gimbal. A showcase of advanced gimbal techniques and cinematic storytelling.",
    websiteUrl: "www.zhiyun.com",
    videoId: "YdbXTZ2RljE",
    bgColor: "bg-green-200 dark:bg-green-900/60",
  },
  {
    number: "02",
    title: "VET Toolbox ",
    description:
      "Building skills for agricultural productivity in Ghana. The British Council's VET Toolbox programme addresses skills shortage in Ghana's agricultural sector through tailored youth training and public-private partnerships.",
    websiteUrl: "www.vettoolbox.com",
    videoId: "9Z8-O2f6egE",
    bgColor: "bg-purple-200 dark:bg-purple-900/60",
  },
  {
    number: "03",
    title: "Scary Deep Trails",
    description:
      "Shot on Xiaomi 11T Pro - A cinematic journey exploring the depths of the ocean and overcoming fears.",
    websiteUrl: "www.xiaomi.com",
    videoId: "L_dHJKwtlBc",
    bgColor: "bg-orange-200 dark:bg-orange-900/60",
  },
];

export function Projects() {
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
    <section
      id="projects"
      className="min-h-screen py-32"
    >
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
                <motion.div
                  className={`h-[2px] w-12 transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-primary w-16"
                      : "bg-muted-foreground/30 group-hover:bg-muted-foreground/50"
                  }`}
                  animate={{ width: index === currentIndex ? 64 : 48 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
                <motion.span
                  className={`text-xs transition-colors ${
                    index === currentIndex
                      ? "text-primary"
                      : "text-muted-foreground group-hover:text-muted-foreground/80"
                  }`}
                  animate={{ scale: index === currentIndex ? 1.1 : 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  {project.number}
                </motion.span>
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
            <AnimatePresence mode="wait">
              <motion.div
                key={currentProject.number}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={`h-[40%] relative overflow-hidden rounded-3xl ${currentProject.bgColor} hover:bg-opacity-20 transition-all duration-300 backdrop-blur p-8 flex flex-col justify-between border border-white/5`}
              >
                <div className="space-y-6">
                  <motion.div
                    className="text-4xl font-bold opacity-50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 0.5, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {currentProject.number}
                  </motion.div>
                  <motion.h2
                    className="text-4xl font-bold"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {currentProject.title}
                  </motion.h2>
                </div>
                <motion.a
                  href={`https://${currentProject.websiteUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg text-gray-700 dark:text-gray-300 hover:text-primary flex items-center gap-2 transition-colors group w-fit"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {currentProject.websiteUrl}
                  <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </motion.a>
              </motion.div>
            </AnimatePresence>

            {/* Description Section */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentProject.number}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  delay: 0.2,
                }}
                className="lg:h-[60%] rounded-3xl bg-muted p-6 md:p-8 flex flex-col overflow-hidden"
              >
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-base md:text-lg leading-relaxed">
                    {currentProject.description}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Video Section */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentProject.number}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="order-1 lg:order-2 lg:col-span-7 relative overflow-hidden rounded-3xl group aspect-video lg:aspect-auto"
            >
              {/* Rest of the video section content remains the same */}
              <div className="relative w-full h-full overflow-hidden">
                {currentProject.websiteUrl.includes('instagram.com') ? (
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="text-6xl mb-4">📱</div>
                      <p className="text-xl font-semibold">Instagram Reel</p>
                      <p className="text-sm opacity-80">Click to view on Instagram</p>
                    </div>
                  </div>
                ) : (
                  <iframe
                    className="absolute inset-0 w-full h-full object-cover lg:scale-[2.2] scale-100 translate-x-0 translate-y-0"
                    src={`https://www.youtube.com/embed/${currentProject.videoId}?autoplay=1&loop=1&playlist=${currentProject.videoId}&controls=0&mute=1&showinfo=0&rel=0`}
                    title="Project Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  ></iframe>
                )}
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

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
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Video Modal */}
      <Dialog open={showVideo} onOpenChange={setShowVideo}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {currentProject.title} - Project Details
            </DialogTitle>
          </DialogHeader>
          <div className="aspect-video">
            {currentProject.websiteUrl.includes('instagram.com') ? (
              <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center rounded-lg">
                <div className="text-white text-center">
                  <div className="text-8xl mb-6">📱</div>
                  <p className="text-2xl font-semibold mb-4">Instagram Reel</p>
                  <p className="text-lg opacity-80 mb-6">This content is available on Instagram</p>
                  <a
                    href={`https://${currentProject.websiteUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white text-purple-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                  >
                    View on Instagram
                    <ArrowUpRight className="h-5 w-5" />
                  </a>
                </div>
              </div>
            ) : (
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${currentProject.videoId}?autoplay=1`}
                title="Behind the Scenes"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}

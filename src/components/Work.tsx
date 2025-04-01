import { useEffect, useRef } from "react";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const projects = [
  {
    title: "Mountain Adventure",
    description: "A cinematic journey through the Rockies",
    thumbnail: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba",
    videoId: "YdbXTZ2RljE",
  },
  {
    title: "Urban Stories",
    description: "Documentary series exploring city life",
    thumbnail: "https://images.unsplash.com/photo-1682687220509-61b8a906ca19",
    videoId: "h-pAyOarKSU",
  },
  {
    title: "Ocean Dreams",
    description: "Underwater photography collection",
    thumbnail: "https://images.unsplash.com/photo-1682687220199-d0124f48f95b",
    videoId: "83aPs5jSBoA",
  },
  {
    title: "Wedding Stories",
    description: "Capturing love and celebrations",
    thumbnail: "https://images.unsplash.com/photo-1737749684915-29624dc30552",
    videoId: "48RFJTv7_O0",
  },
  {
    title: "Brand Campaign",
    description: "Commercial work for leading brands",
    thumbnail: "https://images.unsplash.com/photo-1682687220923-c58b9a4592ae",
    videoId: "YdbXTZ2RljE",
  },
  {
    title: "Nature's Canvas",
    description: "Landscape photography series",
    thumbnail: "https://images.unsplash.com/photo-1536882240095-0379873feb4e",
    videoId: "L_dHJKwtlBc",
  },
];

export function Work() {
  const projectRefs = useRef<(HTMLDivElement | null)[]>([]);

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

    projectRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="work" className="pt-32 pb-20  dark:bg-black bg-white">
      <div className="container">
        <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center animate-slide-up">
          Featured Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <Card
              key={index}
              className="overflow-hidden group opacity-0"
              ref={(el) => (projectRefs.current[index] = el)}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="relative aspect-video">
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className="object-cover w-full h-full transform transition-[transform] duration-500 will-change-transform group-hover:scale-110"
                />
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300"
                    >
                      <Play className="h-6 w-6" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>{project.title}</DialogTitle>
                    </DialogHeader>
                    <div className="aspect-video">
                      <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${project.videoId}?autoplay=1`}
                        title={project.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2">{project.title}</h3>
                <p className="text-muted-foreground">{project.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

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
    title: "2020",
    description: "A compilation of projects from 2020 showcasing exciting endeavours",
    thumbnail: "https://img.youtube.com/vi/WVQctL_IQYE/maxresdefault.jpg",
    videoId: "WVQctL_IQYE",
  },
  {
    title: "Scary Deep Trails",
    description: "Shot on Xiaomi 11T Pro - A cinematic journey chasing fishes in the ocean",
    thumbnail: "https://img.youtube.com/vi/L_dHJKwtlBc/maxresdefault.jpg",
    videoId: "L_dHJKwtlBc",
  },
  {
    title: "Moment Anamorphic Lens",
    description: "Cinematic 4K footage shot in Lagos with the Moment anamorphic lens",
    thumbnail: "https://img.youtube.com/vi/48RFJTv7_O0/maxresdefault.jpg",
    videoId: "48RFJTv7_O0",
  },
  {
    title: "Shot on iPhone 11 - Kokrobitey",
    description: "A cinematic 4K walk through the beautiful town of Kokrobitey",
    thumbnail: "https://img.youtube.com/vi/74iMQUbocLo/maxresdefault.jpg",
    videoId: "74iMQUbocLo",
  },
  {
    title: "Couture - A Fashion Story",
    description: "Fashion project shot for Tailored by Oboshie",
    thumbnail: "https://img.youtube.com/vi/zEoQoP1RiEg/maxresdefault.jpg",
    videoId: "zEoQoP1RiEg",
  },
  {
    title: "Bonds",
    description: "Shot on Xiaomi 12 Pro - Capturing intimate work moments of fisherfolks in Kokrobitey",
    thumbnail: "https://img.youtube.com/vi/txIbBKTuWhs/maxresdefault.jpg",
    videoId: "txIbBKTuWhs",
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

import { useState } from "react";
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
    color: "#a5ebf3",
  },
  {
    title: "Scary Deep Trails",
    description: "Shot on Xiaomi 11T Pro - A cinematic journey chasing fishes in the ocean",
    thumbnail: "https://img.youtube.com/vi/L_dHJKwtlBc/maxresdefault.jpg",
    videoId: "L_dHJKwtlBc",
    color: "#f7b9d8",
  },
  {
    title: "Moment Anamorphic Lens",
    description: "Cinematic 4K footage shot in Lagos with the Moment anamorphic lens",
    thumbnail: "https://img.youtube.com/vi/48RFJTv7_O0/maxresdefault.jpg",
    videoId: "48RFJTv7_O0",
    color: "#f7c7bc",
  },
  {
    title: "Shot on iPhone 11 - Kokrobitey",
    description: "A cinematic 4K walk through the beautiful town of Kokrobitey",
    thumbnail: "https://img.youtube.com/vi/74iMQUbocLo/maxresdefault.jpg",
    videoId: "74iMQUbocLo",
    color: "#feec67",
  },
  {
    title: "Couture - A Fashion Story",
    description: "Fashion project shot for Tailored by Oboshie",
    thumbnail: "https://img.youtube.com/vi/zEoQoP1RiEg/maxresdefault.jpg",
    videoId: "zEoQoP1RiEg",
    color: "#fdd1a1",
  },
  {
    title: "Bonds",
    description: "Shot on Xiaomi 12 Pro - Capturing intimate work moments of fisherfolks in Kokrobitey",
    thumbnail: "https://img.youtube.com/vi/txIbBKTuWhs/maxresdefault.jpg",
    videoId: "txIbBKTuWhs",
    color: "#e0d7f9",
  },
];

export function Work() {
  const [playingInlineVideos, setPlayingInlineVideos] = useState<{[key: number]: boolean}>({});

  const handlePlayInlineVideo = (index: number) => {
    setPlayingInlineVideos(prev => ({ ...prev, [index]: true }));
  };

  return (
    <section 
      id="work" 
      className="relative dark:bg-black bg-white pt-20"
    >
      {/* Header */}
      <div className="pb-8">
        <div className="container">
          <h2 className="text-4xl md:text-6xl font-bold text-center">
            Featured Projects
          </h2>
        </div>
      </div>

      {/* Projects Stack */}
      <div className="space-y-8">
        {projects.map((project, index) => (
          <div
            key={index}
            className="flex items-start justify-center"
          >
            <Card
              className={`w-full max-w-6xl mx-4 overflow-hidden border-0 shadow-none`}
              style={{ 
                backgroundColor: project.color,
                borderRadius: '96px 24px 24px 24px'
              }}
            >
              <div className="flex flex-col md:flex-row h-full min-h-[400px]">
                {/* Left Content */}
                <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
                  <h3 className="text-3xl md:text-4xl font-bold mb-4 text-foreground dark:text-white">
                    {project.title}
                  </h3>
                  <p className="text-lg md:text-xl text-gray-700 dark:text-gray-200 mb-8 leading-relaxed">
                    {project.description}
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="lg"
                        className="w-fit bg-foreground hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 dark:text-foreground text-white rounded-full px-8 py-3 font-semibold transition-all duration-300 hover:scale-105"
                      >
                        <Play className="h-5 w-5 mr-2" />
                        Watch Project
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>{project.title}</DialogTitle>
                      </DialogHeader>
                      <div className="aspect-video relative">
                        <iframe
                          className="w-full h-full rounded-lg"
                          src={`https://www.youtube.com/embed/${project.videoId}`}
                          title={project.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Right Media */}
                <div className="flex-1 relative p-8 md:p-12 flex items-center justify-center">
                  <div className="relative w-full max-w-md aspect-video rounded-2xl overflow-hidden">
                    {!playingInlineVideos[index] ? (
                      <div className="relative w-full h-full group cursor-pointer" onClick={() => handlePlayInlineVideo(index)}>
                        <img
                          src={project.thumbnail}
                          alt={project.title}
                          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                            <Play className="h-8 w-8 text-foreground ml-1" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <iframe
                        className="w-full h-full rounded-2xl"
                        src={`https://www.youtube.com/embed/${project.videoId}?autoplay=1`}
                        title={project.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>


    </section>
  );
}

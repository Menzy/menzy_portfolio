import { useEffect, useRef } from "react";
import { Mail, Instagram, Timer as Vimeo, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const stats = [
  { label: "Years of Experience", value: "10+" },
  { label: "Projects Completed", value: "200+" },
  { label: "Happy Clients", value: "150+" },
  { label: "Awards Won", value: "25+" },
];

const skills = [
  "Cinematography",
  "Photography",
  "Color Grading",
  "Aerial Filming",
  "Post Production",
  "Sound Design",
];

export function About() {
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

  return (
    <section
      id="about"
      className="relative py-32 overflow-hidden bg-gradient-to-b from-background to-black"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      <div className="container relative">
        <div ref={contentRef} className="opacity-0">
          {/* Grid Layout */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            {/* Left Column - Image and Stats */}
            <div className="space-y-12">
              {/* Main Image with Floating Elements */}
              <div className="relative group">
                {/* Main Image */}
                <div className="relative rounded-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1605379399642-870262d3d051"
                    alt="Profile"
                    className="w-full aspect-[4/5] object-cover transform transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>

                {/* Floating Stats Cards */}
                <div className="grid grid-cols-2 gap-4 absolute -bottom-6 left-1/2 -translate-x-1/2 w-[90%]">
                  {stats.map((stat, index) => (
                    <div
                      key={index}
                      className="bg-background/80 backdrop-blur-md p-4 rounded-xl border border-white/10 transform transition-transform duration-300 hover:-translate-y-1"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="text-2xl font-bold text-primary">
                        {stat.value}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Content */}
            <div className="lg:py-12 space-y-8">
              {/* Section Title */}
              <div className="space-y-4">
                <h2 className="text-4xl lg:text-6xl font-bold">
                  Crafting Visual
                  <span className="block text-primary">Stories</span>
                </h2>
                <p className="text-lg text-muted-foreground max-w-lg">
                  With over a decade of experience in visual storytelling, I've
                  had the privilege of working with brands and individuals to
                  bring their stories to life through the lens of my camera.
                </p>
              </div>

              {/* Skills Grid */}
              <div className="py-8">
                <h3 className="text-lg font-semibold mb-4">Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="px-4 py-2 text-sm"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* CTA Section */}
              <div className="space-y-6">
                <div className="flex space-x-4">
                  <Button size="lg" className="group">
                    View Portfolio
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                  <Button variant="outline" size="lg">
                    Download CV
                  </Button>
                </div>

                {/* Social Links */}
                <div className="flex items-center space-x-4 pt-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:scale-110 transition-transform"
                  >
                    <Instagram className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:scale-110 transition-transform"
                  >
                    <Vimeo className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:scale-110 transition-transform"
                  >
                    <Mail className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

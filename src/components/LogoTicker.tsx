import { useEffect, useState } from 'react';

const logos = [
  {
    name: "Canon",
    url: "https://upload.wikimedia.org/wikipedia/commons/3/3f/Canon_logo_vector.png",
  },
  {
    name: "Sony",
    url: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Sony_logo.png",
  },
  {
    name: "Adobe",
    url: "https://upload.wikimedia.org/wikipedia/commons/8/8d/Adobe_Corporate_Logo.png",
  },
  {
    name: "DJI",
    url: "https://upload.wikimedia.org/wikipedia/commons/e/e9/DJI_Logo.png",
  },
  {
    name: "RED",
    url: "https://upload.wikimedia.org/wikipedia/commons/c/c6/RED_Digital_Cinema_Camera_Company_logo.png",
  },
  {
    name: "Nikon",
    url: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Nikon_Corporation_Logo.png"
  }
];

export function LogoTicker() {
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.logo-ticker');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-16 dark:bg-black bg-white">
      <div className="container">
        <h3 className="text-center text-lg text-muted-foreground mb-12 animate-fade-in">
          Trusted by leading brands worldwide
        </h3>
        <div className="relative">
          {/* Left gradient mask */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white dark:from-black to-transparent z-10" />
          
          {/* Right gradient mask */}
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white dark:from-black to-transparent z-10" />
          
          <div 
            className="logo-ticker relative overflow-hidden opacity-0"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div 
              className={`flex space-x-12 animate-scroll ${isHovered ? 'pause-animation' : ''}`}
              style={{ animationDuration: '30s' }}
            >
              {[...logos, ...logos].map((logo, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-center min-w-[150px] h-16 grayscale hover:grayscale-0 transition-all duration-300"
                >
                  <img
                    src={logo.url}
                    alt={logo.name}
                    className="max-h-full max-w-full object-contain dark:brightness-0 dark:invert"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
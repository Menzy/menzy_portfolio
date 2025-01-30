import { useEffect, useState } from "react";
import sandmarcLogo from "/assets/logos/SANDMARC.png";
import momentLogo from "/assets/logos/moment.svg";
import zhiyunLogo from "/assets/logos/Zhiyun.svg";
import xiaomiLogo from "/assets/logos/xiaomi.svg";
import hohemLogo from "/assets/logos/hohem.svg";
import mozaLogo from "/assets/logos/moza.png";

const logos = [
  {
    name: "SANDMARC",
    url: sandmarcLogo,
    hasBackground: true
  },
  {
    name: "Zhiyun",
    url: zhiyunLogo,
    hasBackground: true
  },
  {
    name: "Xiaomi",
    url: xiaomiLogo,
    hasBackground: false
  },
  {
    name: "Moment",
    url: momentLogo,
    hasBackground: false
  },
  {
    name: "Hohem",
    url: hohemLogo,
    hasBackground: false
  },
  {
    name: "Moza",
    url: mozaLogo,
    hasBackground: true
  },
];

export function LogoTicker() {
  const [isHovered, setIsHovered] = useState(false);

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

    const elements = document.querySelectorAll(".logo-ticker");
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
              className={`flex space-x-12 animate-scroll ${
                isHovered ? "pause-animation" : ""
              }`}
              style={{ animationDuration: "30s", animationIterationCount: "infinite" }}
            >
              {[...logos, ...logos, ...logos].map((logo, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center min-w-[150px] h-16 grayscale hover:grayscale-0 transition-all duration-300"
                >
                  <img
                    src={logo.url}
                    alt={logo.name}
                    className={`max-h-full max-w-full object-contain ${
                      logo.hasBackground ? 'dark:opacity-90' : 'dark:brightness-0 dark:invert'
                    }`}
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

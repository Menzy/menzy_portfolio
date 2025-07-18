import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
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
    hasBackground: true,
  },
  {
    name: "Hohem",
    url: hohemLogo,
    hasBackground: false,
  },
  {
    name: "Zhiyun",
    url: zhiyunLogo,
    hasBackground: true,
  },
  {
    name: "Moment",
    url: momentLogo,
    hasBackground: false,
  },
  {
    name: "Xiaomi",
    url: xiaomiLogo,
    hasBackground: false,
  },
  {
    name: "Moza",
    url: mozaLogo,
    hasBackground: false,
  },
];

export function LogoTicker() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [animationDistance, setAnimationDistance] = useState(0);

  useEffect(() => {
    const calculateDistance = () => {
      if (containerRef.current) {
        const firstSet = containerRef.current.children[0];
        if (firstSet) {
          const width = firstSet.getBoundingClientRect().width;
          // Only animate the distance of one set instead of the full width
          setAnimationDistance(-(width + 48)); // Adding gap (12 * 4)
        }
      }
    };

    // Initial calculation after a small delay to ensure proper rendering
    setTimeout(calculateDistance, 100);

    const resizeObserver = new ResizeObserver(calculateDistance);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <section className="py-16 dark:bg-black bg-white">
      <div className="px-20">
        <h3 className="text-center text-md text-muted-foreground mb-12 animate-fade-in">
          TRUSTED BY BRANDS AT
        </h3>
        <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <motion.div
            ref={containerRef}
            animate={{ x: animationDistance }}
            transition={{
              duration: 20, // Shorter duration for one set
              ease: "linear",
              repeat: Infinity,
              repeatType: "loop",
              delay: 0.5,
            }}
            className="flex gap-12 items-center"
          >
            {Array.from({ length: 6 }).map(
              (
                _,
                i // Increased copies to 6
              ) => (
                <div key={i} className="flex gap-12">
                  {logos.map((logo) => (
                    <div
                      key={`${logo.name}-${i}`}
                      className="flex items-center justify-center min-w-[150px] h-16 grayscale hover:grayscale-0 transition-all duration-300"
                    >
                      <img
                        src={logo.url}
                        alt={logo.name}
                        className={`max-h-full max-w-full object-contain ${
                          logo.hasBackground
                            ? "dark:opacity-90"
                            : "dark:brightness-0 dark:invert"
                        }`}
                      />
                    </div>
                  ))}
                </div>
              )
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

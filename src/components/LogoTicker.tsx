import { useState, useEffect } from "react";
import { motion } from "motion/react";
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
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(0);

  // Load saved hover state from sessionStorage on component mount
  useEffect(() => {
    const savedIndex = sessionStorage.getItem('logoTickerHoverIndex');
    if (savedIndex !== null) {
      setHoveredIndex(parseInt(savedIndex, 10));
    }
  }, []);

  // Save hover state to sessionStorage whenever it changes
  const handleHoverChange = (index: number) => {
    setHoveredIndex(index);
    sessionStorage.setItem('logoTickerHoverIndex', index.toString());
  };

  // Split logos differently based on screen size
  // For mobile/tablet: 2 logos per row (2x3 grid)
  // For desktop: 2 on top, 4 on bottom
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const topRowLogos = isMobile ? logos.slice(0, 2) : logos.slice(0, 2);
  const bottomRowLogos = isMobile ? logos.slice(2, 4) : logos.slice(2);
  const thirdRowLogos = isMobile ? logos.slice(4) : [];

  // Calculate position for the animated background
  const getBackgroundPosition = () => {
    if (hoveredIndex === null) return { opacity: 0 };
    
    let rowIndex, indexInRow, totalInRow, yPosition;
    
    if (isMobile) {
      // Mobile: 3 rows of 2 logos each
      if (hoveredIndex < 2) {
        rowIndex = 0;
        indexInRow = hoveredIndex;
        totalInRow = 2;
        yPosition = 0; // 0% for top row
      } else if (hoveredIndex < 4) {
        rowIndex = 1;
        indexInRow = hoveredIndex - 2;
        totalInRow = 2;
        yPosition = 33.33; // 33.33% for middle row
      } else {
        rowIndex = 2;
        indexInRow = hoveredIndex - 4;
        totalInRow = 2;
        yPosition = 66.66; // 66.66% for bottom row
      }
    } else {
      // Desktop: 2 rows (2 logos top, 4 logos bottom)
      const isTopRow = hoveredIndex < 2;
      indexInRow = isTopRow ? hoveredIndex : hoveredIndex - 2;
      totalInRow = isTopRow ? topRowLogos.length : bottomRowLogos.length;
      yPosition = isTopRow ? 0 : 50; // 0% for top row, 50% for bottom row
    }
    
    // Calculate exact position to match the hovered div
    const containerWidth = 100; // Use percentage for responsive design
    const itemWidth = containerWidth / totalInRow;
    const xPosition = indexInRow * itemWidth;
    const height = isMobile ? '33.33%' : '50%';
    
    return {
      left: `${xPosition}%`,
      top: `${yPosition}%`,
      width: `${itemWidth}%`,
      height: height,
      opacity: 1
    };
  };

  const LogoItem = ({ logo, index, rowType, totalInRow }: { logo: typeof logos[0], index: number, rowType: 'top' | 'bottom' | 'third', totalInRow: number }) => {
    let globalIndex;
    if (rowType === 'top') {
      globalIndex = index;
    } else if (rowType === 'bottom') {
      globalIndex = index + 2;
    } else {
      globalIndex = index + 4;
    }
    const isHovered = hoveredIndex === globalIndex;
    
    // Determine border classes based on position
    const isFirst = index === 0;
    const isLast = index === totalInRow - 1;
    const borderClasses = `${
      isFirst ? "" : "border-l border-l-[0.5px]"
    } ${
      isLast ? "" : "border-r border-r-[0.5px]"
    } border-gray-300 dark:border-gray-600`;
    
    return (
      <div
        className={`relative flex items-center justify-center h-full ${borderClasses} cursor-pointer z-10`}
        onMouseEnter={() => handleHoverChange(globalIndex)}
      >
        <motion.img
          src={logo.url}
          alt={logo.name}
          className={`max-h-12 max-w-32 object-contain relative z-20 grayscale`}
          animate={{
            filter: isHovered 
              ? (logo.hasBackground ? "grayscale(1) invert(1)" : "brightness(0) invert(1)") 
              : (logo.hasBackground ? "grayscale(1)" : "brightness(0)"),
          }}
          transition={{
            duration: 0.15,
            ease: [0.4, 0, 0.2, 1],
          }}
        />
      </div>
    );
  };

  return (
    <section className="relative py-8 px-4 md:px-8 lg:px-10 dark:bg-black bg-white z-10">
      <div className="w-full">
        <h3 className="text-left text-xl md:text-xl lg:text-2xl font-bold text-black dark:text-black mb-6 animate-fade-in tracking-wider">
          TRUSTED BY
        </h3>
        <div className={`relative flex flex-col w-full`} style={{ height: '50vh' }}>
          {/* Animated Background */}
          <motion.div
            className="absolute bg-black z-0"
            animate={getBackgroundPosition()}
            transition={{
              duration: 0.15,
              ease: [0.4, 0, 0.2, 1],
            }}
          />
          
          {/* Top Row */}
          <div className={`flex ${isMobile ? 'h-1/3' : 'h-1/2'} border-b border-b-[0.5px] border-gray-300 dark:border-gray-600 relative z-10`}>
            {topRowLogos.map((logo, index) => (
              <div key={logo.name} className="flex-1">
                <LogoItem logo={logo} index={index} rowType="top" totalInRow={topRowLogos.length} />
              </div>
            ))}
          </div>
          
          {/* Bottom Row */}
          <div className={`flex ${isMobile ? 'h-1/3' : 'h-1/2'} ${isMobile && thirdRowLogos.length > 0 ? 'border-b border-b-[0.5px] border-gray-300 dark:border-gray-600' : ''} relative z-10`}>
            {bottomRowLogos.map((logo, index) => (
              <div key={logo.name} className="flex-1">
                <LogoItem logo={logo} index={index} rowType="bottom" totalInRow={bottomRowLogos.length} />
              </div>
            ))}
          </div>
          
          {/* Third Row - Mobile only */}
          {isMobile && thirdRowLogos.length > 0 && (
            <div className="flex h-1/3 relative z-10">
              {thirdRowLogos.map((logo, index) => (
                <div key={logo.name} className="flex-1">
                  <LogoItem logo={logo} index={index} rowType="third" totalInRow={thirdRowLogos.length} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

import { motion, AnimatePresence } from "motion/react";
import { useLocation } from "react-router-dom";
import { ReactNode, useState, useEffect, useRef } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

export const PageTransition = ({ children }: PageTransitionProps) => {
  const location = useLocation();
  const [showMask, setShowMask] = useState(false);
  const isFirstLoad = useRef(true);
  const previousPath = useRef(location.pathname);

  useEffect(() => {
    // Skip transition on first load
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      previousPath.current = location.pathname;
      return;
    }

    // Only show wipe if actually changing routes
    if (previousPath.current !== location.pathname) {
      // Scroll to top when route changes
      window.scrollTo(0, 0);
      
      // Show mask immediately with exit animation
      setShowMask(true);
      
      // Hide mask and finish transition
      const finishTimer = setTimeout(() => {
        setShowMask(false);
      }, 600);
      
      previousPath.current = location.pathname;
      
      return () => {
        clearTimeout(finishTimer);
      };
    }
  }, [location.pathname]);

  return (
    <>
      {/* Independent mask component */}
      <AnimatePresence>
        {showMask && (
          <motion.div
            className="fixed inset-0 bg-black z-50 pointer-events-none"
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "-100%" }}
            transition={{
              duration: 0.25,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          />
        )}
      </AnimatePresence>

      {/* Page content transitions - only handles exit, children handle their own appear */}
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          className="relative min-h-screen w-full"
          exit={{ 
            y: "-8%",
            opacity: 0,
            transition: {
              duration: 0.4,
              ease: [0.16, 1, 0.3, 1],
            }
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
};
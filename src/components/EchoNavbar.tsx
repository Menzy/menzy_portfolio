import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";

export function EchoNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const scrollToSection = (sectionId: string) => {
    if (location.pathname === "/echo") {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        setIsMenuOpen(false);
      }
    } else {
      window.location.href = `/echo#${sectionId}`;
    }
  };

  const scrollToTop = () => {
    if (location.pathname === "/echo") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  return (
    <>
      <nav className={`fixed top-0 w-full h-[60px] z-50 ${isMenuOpen ? 'bg-background' : 'bg-background/95 backdrop-blur-sm'}`}>
        <div className="h-full px-6 flex justify-between items-center">
          {/* Layout when menu is closed - evenly spaced items */}
          {!isMenuOpen && (
            <>
              <button
                onClick={scrollToTop}
                className="text-xl font-bold hover:text-primary transition-colors flex items-center gap-2"
              >
                EchoNote
              </button>
              
              <button
                onClick={() => scrollToSection('features')}
                className="hidden md:block text-foreground/80 hover:text-primary transition-colors"
                style={{ fontSize: '16px', fontWeight: 600 }}
              >
                Features
              </button>
              
              <button
                onClick={() => scrollToSection('use-cases')}
                className="hidden md:block text-foreground/80 hover:text-primary transition-colors"
                style={{ fontSize: '16px', fontWeight: 600 }}
              >
                Use Cases
              </button>
              
              <button
                onClick={() => scrollToSection('download')}
                className="hidden md:block text-foreground/80 hover:text-primary transition-colors"
                style={{ fontSize: '16px', fontWeight: 600 }}
              >
                Download
              </button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="hover:bg-transparent"
              >
                <div className="flex flex-col justify-center items-center w-6 h-6">
                  <motion.div
                    className="w-5 h-0.5 bg-current mb-1"
                    animate={{
                      rotate: isMenuOpen ? 45 : 0,
                      y: isMenuOpen ? 3 : 0,
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                  <motion.div
                    className="w-5 h-0.5 bg-current"
                    animate={{
                      rotate: isMenuOpen ? -45 : 0,
                      y: isMenuOpen ? -3 : 0,
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                </div>
              </Button>
            </>
          )}

          {/* Layout when menu is open - only logo and hamburger */}
          {isMenuOpen && (
            <>
              <button
                onClick={scrollToTop}
                className="text-xl font-bold hover:text-primary transition-colors flex items-center gap-2"
              >
                EchoNote
              </button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="hover:bg-transparent"
              >
                <div className="flex flex-col justify-center items-center w-6 h-6">
                  <motion.div
                    className="w-5 h-0.5 bg-current mb-1"
                    animate={{
                      rotate: isMenuOpen ? 45 : 0,
                      y: isMenuOpen ? 3 : 0,
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                  <motion.div
                    className="w-5 h-0.5 bg-current"
                    animate={{
                      rotate: isMenuOpen ? -45 : 0,
                      y: isMenuOpen ? -3 : 0,
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                </div>
              </Button>
            </>
          )}
        </div>
      </nav>

      {/* Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ y: "-60vh" }}
            animate={{ y: 0 }}
            exit={{ y: "-60vh" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed top-0 left-0 right-0 h-[calc(60px+60vh)] z-40 bg-background backdrop-blur-sm"
          >
            <div className="h-full flex flex-col justify-center items-center space-y-2 -mt-[30px]">
              {/* Main navigation items */}
              <motion.button
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }}
                onClick={() => scrollToSection('features')}
                className="text-foreground/80 hover:text-primary transition-colors"
                style={{ 
                  fontSize: '60px', 
                  fontWeight: 600, 
                  lineHeight: '100%' 
                }}
              >
                Features
              </motion.button>
              
              <motion.button
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
                onClick={() => scrollToSection('use-cases')}
                className="text-foreground/80 hover:text-primary transition-colors"
                style={{ 
                  fontSize: '60px', 
                  fontWeight: 600, 
                  lineHeight: '100%' 
                }}
              >
                Use Cases
              </motion.button>
              
              <motion.button
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
                onClick={() => scrollToSection('download')}
                className="text-foreground/80 hover:text-primary transition-colors"
                style={{ 
                  fontSize: '60px', 
                  fontWeight: 600, 
                  lineHeight: '100%' 
                }}
              >
                Download
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
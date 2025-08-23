import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCallback, useState } from "react";
import { ThemeLogo } from "./ThemeLogo";
import { motion, AnimatePresence } from "motion/react";

export function TimelapseNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isMainPage = location.pathname === "/timelapse";

  const scrollToSection = useCallback((sectionId: string) => {
    if (isMainPage) {
      const element = document.getElementById(sectionId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ 
            behavior: "smooth",
            block: "start"
          });
          setIsMenuOpen(false);
        }, 50);
      }
    }
  }, [isMainPage]);

  const handleNavigation = useCallback((sectionId: string) => {
    if (isMainPage) {
      scrollToSection(sectionId);
    } else {
      setIsMenuOpen(false);
    }
  }, [isMainPage, scrollToSection]);

  return (
    <>
      <nav className={`fixed top-0 w-full h-[60px] z-50 ${isMenuOpen ? 'bg-background' : 'bg-background/95 backdrop-blur-sm'}`}>
        <div className="h-full px-6 flex justify-between items-center">
          {/* Layout when menu is closed - evenly spaced items */}
          {!isMenuOpen && (
            <>
              <Link to="/timelapse" className="flex items-center space-x-3">
                <ThemeLogo width={36} height={36} className="mr-2" roundedSize="rounded-md" />
                <span className="text-xl font-bold hover:text-primary transition-colors">TimeLapse</span>
              </Link>
              
              {isMainPage ? (
                <button 
                  onClick={() => handleNavigation('features')} 
                  className="hidden md:block text-foreground/80 hover:text-primary transition-colors"
                  style={{ fontSize: '16px', fontWeight: 600 }}
                >
                  Features
                </button>
              ) : (
                <Link 
                  to="/timelapse#features" 
                  className="hidden md:block text-foreground/80 hover:text-primary transition-colors"
                  style={{ fontSize: '16px', fontWeight: 600 }}
                >
                  Features
                </Link>
              )}
              
              {isMainPage ? (
                <button 
                  onClick={() => handleNavigation('getting-started')} 
                  className="hidden md:block text-foreground/80 hover:text-primary transition-colors"
                  style={{ fontSize: '16px', fontWeight: 600 }}
                >
                  Getting Started
                </button>
              ) : (
                <Link 
                  to="/timelapse#getting-started" 
                  className="hidden md:block text-foreground/80 hover:text-primary transition-colors"
                  style={{ fontSize: '16px', fontWeight: 600 }}
                >
                  Getting Started
                </Link>
              )}
              
              <Link 
                to="/timelapse/support" 
                className="hidden md:block text-foreground/80 hover:text-primary transition-colors"
                style={{ fontSize: '16px', fontWeight: 600 }}
              >
                Support
              </Link>
              
              <Link 
                to="/privacy-policy" 
                className="hidden md:block text-foreground/80 hover:text-primary transition-colors"
                style={{ fontSize: '16px', fontWeight: 600 }}
              >
                Privacy
              </Link>
              
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
              <Link to="/timelapse" className="flex items-center space-x-3">
                <ThemeLogo width={36} height={36} className="mr-2" roundedSize="rounded-md" />
                <span className="text-xl font-bold hover:text-primary transition-colors">TimeLapse</span>
              </Link>
              
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
              {isMainPage ? (
                <motion.button
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }}
                  onClick={() => handleNavigation('features')}
                  className="text-foreground/80 hover:text-primary transition-colors"
                  style={{ 
                    fontSize: '60px', 
                    fontWeight: 600, 
                    lineHeight: '100%' 
                  }}
                >
                  Features
                </motion.button>
              ) : (
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }}
                >
                  <Link 
                    to="/timelapse#features" 
                    className="text-foreground/80 hover:text-primary transition-colors"
                    style={{ 
                      fontSize: '60px', 
                      fontWeight: 600, 
                      lineHeight: '100%' 
                    }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Features
                  </Link>
                </motion.div>
              )}

              {isMainPage ? (
                <motion.button
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
                  onClick={() => handleNavigation('getting-started')}
                  className="text-foreground/80 hover:text-primary transition-colors"
                  style={{ 
                    fontSize: '60px', 
                    fontWeight: 600, 
                    lineHeight: '100%' 
                  }}
                >
                  Getting Started
                </motion.button>
              ) : (
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
                >
                  <Link 
                    to="/timelapse#getting-started" 
                    className="text-foreground/80 hover:text-primary transition-colors"
                    style={{ 
                      fontSize: '60px', 
                      fontWeight: 600, 
                      lineHeight: '100%' 
                    }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Getting Started
                  </Link>
                </motion.div>
              )}
              
              {/* Bottom Actions */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
                className="absolute bottom-6 left-0 right-0 flex items-center justify-between px-12"
              >
                <Link
                  to="/timelapse/support"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-sm font-normal text-foreground/70 hover:text-primary transition-colors"
                >
                  Support
                </Link>
                <Link
                  to="/privacy-policy"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-sm font-normal text-foreground/70 hover:text-primary transition-colors"
                >
                  Privacy
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
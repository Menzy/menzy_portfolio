import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Cart } from "@/components/Cart";
import { motion, AnimatePresence } from "motion/react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isShopPage = location.pathname === "/shop";
  const isItemDetailsPage = location.pathname.startsWith("/shop/");

  const scrollToSection = (sectionId: string) => {
    if (isHomePage) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        setIsMenuOpen(false);
      }
    }
  };

  return (
    <>
      <nav className="fixed top-0 w-full h-[60px] z-50 bg-background/95 backdrop-blur-sm">
        <div className="h-full px-6 flex justify-between items-center">
          {/* Homepage Layout - 5 items evenly spaced */}
          {isHomePage && !isMenuOpen && (
            <>
              <Link
                to="/"
                className="text-xl font-bold hover:text-primary transition-colors flex items-center gap-2"
              >
                Wan Menzy
              </Link>
              <button
                onClick={() => scrollToSection("work")}
                className="hidden md:block text-foreground/80 hover:text-primary transition-colors"
                style={{ fontSize: '16px', fontWeight: 600 }}
              >
                Work
              </button>
              <button
                onClick={() => scrollToSection("projects")}
                className="hidden md:block text-foreground/80 hover:text-primary transition-colors"
                style={{ fontSize: '16px', fontWeight: 600 }}
              >
                Projects
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="hidden md:block text-foreground/80 hover:text-primary transition-colors"
                style={{ fontSize: '16px', fontWeight: 600 }}
              >
                Contact
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

          {/* Homepage with menu open - only logo and hamburger */}
          {isHomePage && isMenuOpen && (
            <>
              <Link
                to="/"
                className="text-xl font-bold hover:text-primary transition-colors flex items-center gap-2"
              >
                Wan Menzy
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

          {/* Other pages navigation - hide when menu is open */}
          {!isHomePage && !isMenuOpen && (
            <>
              <Link
                to="/"
                className="text-xl font-bold hover:text-primary transition-colors flex items-center gap-2"
              >
                Wan Menzy
              </Link>
              <div className="hidden md:flex items-center space-x-8">
                <Link 
                  to="/shop" 
                  className="text-foreground/80 hover:text-primary transition-colors"
                  style={{ fontSize: '16px', fontWeight: 600 }}
                >
                  Shop
                </Link>
                <Link 
                  to="/timelapse" 
                  className="text-foreground/80 hover:text-primary transition-colors"
                  style={{ fontSize: '16px', fontWeight: 600 }}
                >
                  Timelapse
                </Link>
                <Link 
                  to="/echo" 
                  className="text-foreground/80 hover:text-primary transition-colors"
                  style={{ fontSize: '16px', fontWeight: 600 }}
                >
                  Echo
                </Link>
                {(isShopPage || isItemDetailsPage) && <Cart />}
                <ThemeToggle />
              </div>
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

          {/* Other pages with menu open - only logo and hamburger */}
          {!isHomePage && isMenuOpen && (
            <>
              <Link
                to="/"
                className="text-xl font-bold hover:text-primary transition-colors flex items-center gap-2"
              >
                Wan Menzy
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
            className="fixed top-[60px] left-0 right-0 h-[60vh] z-40 bg-background backdrop-blur-sm"
          >
            <div className="h-full flex flex-col justify-center items-center space-y-1">
              {/* Section Navigation */}
              {isHomePage && (
                <>
                  <motion.button
                    initial={{ y: 30 }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                    onClick={() => scrollToSection("work")}
                    className="text-foreground/80 hover:text-primary transition-colors"
                    style={{ 
                      fontSize: '60px', 
                      fontWeight: 600, 
                      lineHeight: '120%' 
                    }}
                  >
                    Work
                  </motion.button>
                  <motion.button
                    initial={{ y: 30 }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.15, duration: 0.3 }}
                    onClick={() => scrollToSection("projects")}
                    className="text-foreground/80 hover:text-primary transition-colors"
                    style={{ 
                      fontSize: '60px', 
                      fontWeight: 600, 
                      lineHeight: '120%' 
                    }}
                  >
                    Projects
                  </motion.button>
                  <motion.button
                    initial={{ y: 30 }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                    onClick={() => scrollToSection("contact")}
                    className="text-foreground/80 hover:text-primary transition-colors"
                    style={{ 
                      fontSize: '60px', 
                      fontWeight: 600, 
                      lineHeight: '120%' 
                    }}
                  >
                    Contact
                  </motion.button>
                </>
              )}
              
              {/* Bottom Actions */}
              <motion.div 
                initial={{ y: 30 }}
                animate={{ y: 0 }}
                transition={{ delay: isHomePage ? 0.3 : 0.1, duration: 0.3 }}
                className="absolute bottom-12 left-0 right-0 flex items-center justify-evenly px-12"
              >
                <Link
                  to="/shop"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-sm font-normal text-foreground/70 hover:text-primary transition-colors"
                >
                  Shop
                </Link>
                <Link
                  to="/timelapse"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-sm font-normal text-foreground/70 hover:text-primary transition-colors"
                >
                  Timelapse
                </Link>
                <Link
                  to="/echo"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-sm font-normal text-foreground/70 hover:text-primary transition-colors"
                >
                  Echo
                </Link>
                {(isShopPage || isItemDetailsPage) && <Cart />}
                <ThemeToggle />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

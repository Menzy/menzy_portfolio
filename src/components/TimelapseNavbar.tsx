import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Menu, X } from "lucide-react";
import { useCallback, useState } from "react";
import { ThemeLogo } from "./ThemeLogo";

// Apple logo SVG component
function AppleLogo({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 384 512" 
      fill="currentColor" 
      className={className} 
      width="16" 
      height="16"
    >
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
    </svg>
  );
}

export function TimelapseNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isMainPage = location.pathname === "/timelapse";

  const scrollToSection = useCallback((sectionId: string) => {
    if (isMainPage) {
      // If we're on the main page, scroll to the section
      const element = document.getElementById(sectionId);
      if (element) {
        // Add a small delay to ensure consistent scrolling behavior
        setTimeout(() => {
          element.scrollIntoView({ 
            behavior: "smooth",
            block: "start"
          });
          setMobileMenuOpen(false);
        }, 50);
      }
    }
  }, [isMainPage]);

  const handleNavigation = useCallback((sectionId: string) => {
    if (isMainPage) {
      // If we're on the main page, just scroll
      scrollToSection(sectionId);
    } else {
      // If we're not on the main page, we'll navigate back to main page with hash
      // React Router will handle this navigation
      setMobileMenuOpen(false);
    }
  }, [isMainPage, scrollToSection]);

  return (
    <div className="w-full py-3 border-b border-b-muted/40 bg-background/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Link to="/timelapse" className="flex items-center">
              <ThemeLogo width={36} height={36} className="mr-2" roundedSize="rounded-md" />
              <span className="text-xl font-bold">TimeLapse</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            {isMainPage ? (
              <button 
                onClick={() => handleNavigation('features')} 
                className="text-foreground/80 hover:text-primary transition-colors cursor-pointer appearance-none bg-transparent border-none p-0 font-inherit"
              >
                Features
              </button>
            ) : (
              <Link 
                to="/timelapse#features" 
                className="text-foreground/80 hover:text-primary transition-colors"
              >
                Features
              </Link>
            )}
            
            {isMainPage ? (
              <button 
                onClick={() => handleNavigation('getting-started')} 
                className="text-foreground/80 hover:text-primary transition-colors cursor-pointer appearance-none bg-transparent border-none p-0 font-inherit"
              >
                Getting Started
              </button>
            ) : (
              <Link 
                to="/timelapse#getting-started" 
                className="text-foreground/80 hover:text-primary transition-colors"
              >
                Getting Started
              </Link>
            )}
            
            <Link 
              to="/timelapse/support" 
              className="text-foreground/80 hover:text-primary transition-colors"
            >
              Support
            </Link>
            
            <Link 
              to="/privacy-policy" 
              className="text-foreground/80 hover:text-primary transition-colors"
            >
              Privacy
            </Link>
            <ThemeToggle />
          </div>
          
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="ml-1.5"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-5 pb-3 border-t mt-4 animate-in slide-in-from-top duration-300">
            <nav className="flex flex-col space-y-4">
              {isMainPage ? (
                <button 
                  onClick={() => handleNavigation('features')} 
                  className="text-foreground/80 hover:text-primary transition-colors cursor-pointer appearance-none bg-transparent border-none p-0 text-lg font-medium text-left"
                >
                  Features
                </button>
              ) : (
                <Link 
                  to="/timelapse#features" 
                  className="text-foreground/80 hover:text-primary transition-colors text-lg font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Features
                </Link>
              )}
              
              {isMainPage ? (
                <button 
                  onClick={() => handleNavigation('getting-started')} 
                  className="text-foreground/80 hover:text-primary transition-colors cursor-pointer appearance-none bg-transparent border-none p-0 text-lg font-medium text-left"
                >
                  Getting Started
                </button>
              ) : (
                <Link 
                  to="/timelapse#getting-started" 
                  className="text-foreground/80 hover:text-primary transition-colors text-lg font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Getting Started
                </Link>
              )}
              
              <Link 
                to="/timelapse/support" 
                className="text-foreground/80 hover:text-primary transition-colors text-lg font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Support
              </Link>
              
              <Link 
                to="/privacy-policy" 
                className="text-foreground/80 hover:text-primary transition-colors text-lg font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Privacy
              </Link>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
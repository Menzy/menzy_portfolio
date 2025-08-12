import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EchoThemeToggle } from "@/components/EchoThemeToggle";

export function EchoNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const heroSection = document.querySelector("#hero");

      if (!heroSection) return;

      const heroHeight = heroSection.getBoundingClientRect().height;

      // Show navbar at the very top
      if (currentScrollY < 100) {
        setIsVisible(true);
      }
      // Hide navbar during hero section
      else if (currentScrollY < heroHeight) {
        setIsVisible(false);
      }
      // Show navbar after hero section is completely scrolled past
      else if (currentScrollY > heroHeight) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const scrollToSection = (sectionId: string) => {
    if (location.pathname === "/echo") {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        setIsMenuOpen(false);
      }
    } else {
      // If not on echo page, navigate to echo page with hash
      window.location.href = `/echo#${sectionId}`;
    }
  };

  const scrollToTop = () => {
    if (location.pathname === "/echo") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div
      className={`fixed w-full z-50 p-2 transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <nav
        className={`max-w-6xl mx-auto relative overflow-hidden ${
          isMenuOpen ? "rounded-xl" : "rounded-xl md:rounded-full"
        }`}
        style={{
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid var(--glass-border)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 var(--glass-border)'
        }}
      >
        <div className="px-2 py-2 flex justify-between items-center">
          <button
              onClick={scrollToTop}
              className="text-xl font-bold hover:text-green-600 transition-colors px-3 flex items-center gap-2 cursor-pointer"
            >
              EchoNote
            </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('features')}
              className="relative group cursor-pointer"
            >
              <span className="text-foreground/80 hover:text-green-600 transition-colors">
                Features
              </span>
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-green-600 scale-x-0 group-hover:scale-x-100 transition-transform"></span>
            </button>
            <button
              onClick={() => scrollToSection('use-cases')}
              className="relative group cursor-pointer"
            >
              <span className="text-foreground/80 hover:text-green-600 transition-colors">
                Use Cases
              </span>
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-green-600 scale-x-0 group-hover:scale-x-100 transition-transform"></span>
            </button>
            <button
              onClick={() => scrollToSection('download')}
              className="relative group cursor-pointer"
            >
              <span className="text-foreground/80 hover:text-green-600 transition-colors">
                Download
              </span>
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-green-600 scale-x-0 group-hover:scale-x-100 transition-transform"></span>
            </button>
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-2">
            <EchoThemeToggle />
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-sm">
            <div className="px-4 py-4 space-y-4">
              <button
                onClick={() => scrollToSection('features')}
                className="block w-full text-left text-foreground/80 hover:text-green-600 transition-colors py-2"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('use-cases')}
                className="block w-full text-left text-foreground/80 hover:text-green-600 transition-colors py-2"
              >
                Use Cases
              </button>
              <button
                onClick={() => scrollToSection('download')}
                className="block w-full text-left text-foreground/80 hover:text-green-600 transition-colors py-2"
              >
                Download
              </button>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
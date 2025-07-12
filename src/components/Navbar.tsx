import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Cart } from "@/components/Cart";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isShopPage = location.pathname === "/shop";
  const isItemDetailsPage = location.pathname.startsWith("/shop/");

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const heroSection = document.querySelector("#hero"); // Add id="hero" to your hero section

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
    if (isHomePage) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        setIsMenuOpen(false);
      }
    }
  };

  return (
    <div
      className={`fixed w-full z-50 p-2 transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <nav
        className={`max-w-6xl mx-auto bg-background/80 backdrop-blur-md shadow-lg border overflow-hidden ${
          isMenuOpen ? "rounded-xl" : "rounded-xl md:rounded-full"
        }`}
      >
        <div className="px-2 py-2 flex justify-between items-center">
          <Link
            to="/"
            className="text-xl font-bold hover:text-primary transition-colors px-3 flex items-center gap-2"
          >
            Wan Menzy
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/shop" className="relative group">
              <span className="text-foreground/80 hover:text-primary transition-colors">
                Shop
              </span>
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform"></span>
            </Link>
            <Link to="/timelapse" className="relative group">
              <span className="text-foreground/80 hover:text-primary transition-colors">
                Timelapse
              </span>
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform"></span>
            </Link>
            {(isShopPage || isItemDetailsPage) && <Cart />}
            <ThemeToggle />
            {isHomePage ? (
              <Button
                onClick={() => scrollToSection("contact")}
                variant="default"
                className="rounded-full h-9 px-6 text-sm font-medium ml-4"
              >
                Let's Work
              </Button>
            ) : null}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-background/80 backdrop-blur-md">
            <div className="px-6 py-4 flex flex-col space-y-4">
              {isHomePage ? (
                <Button
                  onClick={() => scrollToSection("contact")}
                  variant="default"
                  className="rounded-full h-12 w-full px-8 text-base font-medium"
                >
                  Let's Work
                </Button>
              ) : null}
              <Link
                to="/shop"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center text-lg font-medium text-foreground/80 hover:text-primary transition-colors"
              >
                Shop
              </Link>
              <Link
                to="/timelapse"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center text-lg font-medium text-foreground/80 hover:text-primary transition-colors"
              >
                Timelapse
              </Link>
              <div className="flex items-center space-x-4">
                {(isShopPage || isItemDetailsPage) && <Cart />}
                <ThemeToggle />
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}

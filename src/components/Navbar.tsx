import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Cart } from "@/components/Cart";

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
    <div className="fixed w-full z-50 p-4">
      <nav
        className={`max-w-6xl mx-auto bg-background/80 backdrop-blur-md shadow-lg border overflow-hidden ${
          isMenuOpen ? "rounded-2xl" : "rounded-2xl md:rounded-full"
        }`}
      >
        <div className="px-3 py-3 flex justify-between items-center">
          <Link
            to="/"
            className="text-2xl font-bold hover:text-primary transition-colors px-4 flex items-center gap-2"
          >
            {/* <img src={logo} alt="Logo" className="w-8 h-8" /> */}
            Wan Menzy
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/blog" className="relative group">
              <span className="text-foreground/80 hover:text-primary transition-colors">
                Blog
              </span>
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform"></span>
            </Link>
            <Link to="/shop" className="relative group">
              <span className="text-foreground/80 hover:text-primary transition-colors">
                Shop
              </span>
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform"></span>
            </Link>
            {(isShopPage || isItemDetailsPage) && <Cart />}
            <ThemeToggle />
            {isHomePage ? (
              <Button
                onClick={() => scrollToSection("contact")}
                variant="default"
                className="rounded-full h-12 px-8 text-base font-medium ml-4"
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
                to="/blog"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center text-lg font-medium text-foreground/80 hover:text-primary transition-colors"
              >
                Blog
              </Link>
              <Link
                to="/shop"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center text-lg font-medium text-foreground/80 hover:text-primary transition-colors"
              >
                Shop
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

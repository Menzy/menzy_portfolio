import { Instagram, Mail, Timer as Vimeo, ArrowUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import logo from "/assets/logos/1.png";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="min-h-screen border-t bg-muted/30 flex flex-col items-center justify-center gap-8">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img src={logo} alt="Logo" className="w-12 h-12" />
      </div>

      {/* Bottom Container */}
      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
        {/* Copyright */}
        <div className="text-center md:order-1">
          <p className="text-sm text-muted-foreground">© Copyright 2025</p>
        </div>

        {/* Social Links */}
        <div className="flex space-x-4 md:order-2">
          <Button 
            variant="outline" 
            size="icon"
            className="rounded-full hover:scale-110 transition-transform"
          >
            <Instagram className="h-5 w-5" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            className="rounded-full hover:scale-110 transition-transform"
          >
            <Vimeo className="h-5 w-5" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            className="rounded-full hover:scale-110 transition-transform"
          >
            <Mail className="h-5 w-5" />
          </Button>
        </div>

        {/* Scroll to top button */}
        <Button
          variant="outline"
          size="icon"
          onClick={scrollToTop}
          className="rounded-full hover:scale-110 transition-transform md:order-3"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      </div>

      {/* Built by credit - separate from other elements */}
      <div className="text-center mt-4">
        <p className="text-sm text-muted-foreground">Built by Wan Menzy</p>
      </div>
    </footer>
  );
}
import { FaInstagram, FaYoutube, FaTwitter, FaArrowUp } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import logo from "/assets/logos/1.png";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="min-h-screen border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black flex flex-col items-center justify-center gap-8">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img src={logo} alt="Logo" className="w-12 h-12" />
      </div>

      {/* Bottom Container */}
      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
        {/* Copyright */}
        <div className="text-center md:order-1">
          <p className="text-sm text-gray-600 dark:text-gray-400">© Copyright 2025</p>
        </div>

        {/* Social Links */}
        <div className="flex space-x-4 md:order-2">
          <a
            href="https://instagram.com/1menzy"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              size="icon"
              className="rounded-full hover:scale-110 transition-transform"
            >
              <FaInstagram className="h-5 w-5" />
            </Button>
          </a>
          <a
            href="https://twitter.com/1menzy"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              size="icon"
              className="rounded-full hover:scale-110 transition-transform"
            >
              <FaTwitter className="h-5 w-5" />
            </Button>
          </a>
          <a
            href="https://youtube.com/c/wanmenzy"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              size="icon"
              className="rounded-full hover:scale-110 transition-transform"
            >
              <FaYoutube className="h-5 w-5" />
            </Button>
          </a>
        </div>

        {/* Scroll to top button */}
        <Button
          variant="outline"
          size="icon"
          onClick={scrollToTop}
          className="rounded-full hover:scale-110 transition-transform md:order-3"
        >
          <FaArrowUp className="h-5 w-5" />
        </Button>
      </div>

      {/* Built by credit - separate from other elements */}
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">Built by Wan Menzy</p>
      </div>
    </footer>
  );
}

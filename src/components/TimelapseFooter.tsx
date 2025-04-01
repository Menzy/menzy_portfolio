import { Link, useLocation } from "react-router-dom";
import { Github, Twitter, Mail, Shield } from "lucide-react";
import { useCallback } from "react";
import { ThemeLogo } from "./ThemeLogo";

export function TimelapseFooter() {
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
        }, 50);
      }
    }
  }, [isMainPage]);

  return (
    <footer className="bg-muted py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/timelapse" className="flex items-center gap-2">
              <ThemeLogo width={32} height={32} roundedSize="rounded-md" />
              <span className="text-xl font-bold">TimeLapse</span>
            </Link>
            <p className="text-muted-foreground">
              Visual time tracking and goal achievement app that helps you visualize progress and stay motivated.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">App</h3>
            <ul className="space-y-2">
              <li>
                {isMainPage ? (
                  <button 
                    onClick={() => scrollToSection('features')}
                    className="text-muted-foreground hover:text-foreground transition-colors text-left w-full cursor-pointer appearance-none bg-transparent border-none p-0 font-inherit"
                  >
                    Features
                  </button>
                ) : (
                  <Link 
                    to="/timelapse#features"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Features
                  </Link>
                )}
              </li>
              <li>
                {isMainPage ? (
                  <button 
                    onClick={() => scrollToSection('benefits')}
                    className="text-muted-foreground hover:text-foreground transition-colors text-left w-full cursor-pointer appearance-none bg-transparent border-none p-0 font-inherit"
                  >
                    Benefits
                  </button>
                ) : (
                  <Link 
                    to="/timelapse#benefits"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Benefits
                  </Link>
                )}
              </li>
              <li>
                {isMainPage ? (
                  <button 
                    onClick={() => scrollToSection('getting-started')}
                    className="text-muted-foreground hover:text-foreground transition-colors text-left w-full cursor-pointer appearance-none bg-transparent border-none p-0 font-inherit"
                  >
                    Getting Started
                  </button>
                ) : (
                  <Link 
                    to="/timelapse#getting-started"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Getting Started
                  </Link>
                )}
              </li>
              <li>
                {isMainPage ? (
                  <button 
                    onClick={() => scrollToSection('download')}
                    className="text-muted-foreground hover:text-foreground transition-colors text-left w-full cursor-pointer appearance-none bg-transparent border-none p-0 font-inherit"
                  >
                    Download
                  </button>
                ) : (
                  <Link 
                    to="/timelapse#download"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Download
                  </Link>
                )}
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy-policy" className="text-muted-foreground hover:text-foreground transition-colors flex items-center">
                  <Shield className="h-4 w-4 mr-2" /> Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a 
                href="https://twitter.com/wanamenzy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="https://github.com/wanamenzy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="mailto:contact@wanamenzy.me" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t">
          <div className="flex items-center justify-center mb-4">
            <ThemeLogo width={24} height={24} className="mr-2" roundedSize="rounded" />
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} TimeLapse App. All rights reserved.
            </p>
          </div>
          <p className="text-center text-muted-foreground text-sm">
            Designed and developed by <a href="/" className="text-primary hover:underline">Wan Menzy</a>
          </p>
        </div>
      </div>
    </footer>
  );
} 
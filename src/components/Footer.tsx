import { Instagram, Mail, Timer as Vimeo } from 'lucide-react';
import { Button } from "@/components/ui/button";

export function Footer() {
  const navigation = [
    { name: 'Work', href: '#work' },
    { name: 'Blog', href: '#blog' },
    { name: 'Shop', href: '#shop' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Wan Menzy</h3>
            <p className="text-muted-foreground">
              Capturing life's most precious moments through the lens of creativity.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 className="font-semibold">Navigation</h4>
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <a 
                    href={item.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold">Contact</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="mailto:hello@jameslens.com"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  wanmenzy@gmail.com
                </a>
              </li>
              <li className="text-muted-foreground">Adenta - Accra, GH</li>
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h4 className="font-semibold">Let&apos;s get Social</h4>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="icon"
                className="hover:scale-110 transition-transform rounded-full"
              >
                <Instagram className="h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                className="hover:scale-110 transition-transform rounded-full"
              >
                <Vimeo className="h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                className="hover:scale-110 transition-transform rounded-full"
              >
                <Mail className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © 2024 James Lens. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
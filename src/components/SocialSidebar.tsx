import { Instagram, Twitter, Youtube } from 'lucide-react';
import { Button } from "@/components/ui/button";

export function SocialSidebar() {
  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-40 flex flex-col space-y-4">
      <Button 
        variant="outline" 
        size="icon" 
        className="bg-background/80 backdrop-blur-sm hover:bg-background/90 hover:scale-110 transition-all duration-300"
      >
        <Instagram className="h-5 w-5" />
      </Button>
      <Button 
        variant="outline" 
        size="icon"
        className="bg-background/80 backdrop-blur-sm hover:bg-background/90 hover:scale-110 transition-all duration-300"
      >
        <Twitter className="h-5 w-5" />
      </Button>
      <Button 
        variant="outline" 
        size="icon"
        className="bg-background/80 backdrop-blur-sm hover:bg-background/90 hover:scale-110 transition-all duration-300"
      >
        <Youtube className="h-5 w-5" />
      </Button>
    </div>
  );
}
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Clock, Target, Calendar, Paintbrush, MessageCircle } from 'lucide-react';
import { TimelapseNavbar } from '@/components/TimelapseNavbar';
import { TimelapseFooter } from '@/components/TimelapseFooter';
import { ThemeLogo } from '@/components/ThemeLogo';
import { AppStoreButton } from '@/components/AppStoreButton';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function TimelapseAppPage() {
  const location = useLocation();

  // Handle hash links when navigating to this page
  useEffect(() => {
    if (location.hash) {
      // Remove the # character
      const sectionId = location.hash.substring(1);
      
      // Small delay to ensure the DOM is fully loaded
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ 
            behavior: "smooth",
            block: "start"
          });
        }
      }, 100);
    } else {
      // If no hash, scroll to top
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-background">
      <TimelapseNavbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden" id="hero">
        {/* Animated Blob */}
        <div className="absolute w-[800px] h-[800px] opacity-30 animate-blob filter blur-3xl">
          <div className="absolute top-0 left-0 w-full h-full rounded-full bg-gradient-to-r from-primary via-primary/60 to-primary/40 animate-pulse" 
               style={{ animationDuration: '8s' }}></div>
          <div className="absolute top-[10%] left-[10%] w-[80%] h-[80%] rounded-full bg-gradient-to-l from-primary/80 via-primary/60 to-primary/40 animate-pulse" 
               style={{ animationDuration: '10s', animationDelay: '1s' }}></div>
        </div>
        
        <div className="container mx-auto px-4 z-10 text-center relative pt-24 md:pt-32">
          <ThemeLogo width={80} height={80} className="mb-6 mx-auto animate-fade-in" roundedSize="rounded-xl" />
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>TimeLapse</h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            Visual Time Tracking & Goal Achievement
          </p>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            An elegant and intuitive time tracking application that helps you visualize the passage of time and track your goals in a meaningful way.
          </p>
          <div className="flex flex-col items-center gap-3 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <AppStoreButton className="mb-2" />
            <span className="text-sm text-muted-foreground">
              Need help? <a href="/timelapse/support" className="text-primary hover:underline">Visit our support page</a>
            </span>
          </div>
          
          {/* App Screenshots */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 animate-fade-in" style={{ animationDelay: '1s' }}>
            <img 
              src="/assets/appdemo/optimized/Frame1.jpg" 
              alt="TimeLapse App Screenshot 1" 
              className="rounded-2xl shadow-xl w-full h-auto"
              loading="lazy"
              width={380}
              height={720}
            />
            <img 
              src="/assets/appdemo/optimized/Frame2.jpg" 
              alt="TimeLapse App Screenshot 2" 
              className="rounded-2xl shadow-xl w-full h-auto"
              loading="lazy"
              width={380}
              height={720}
            />
            <img 
              src="/assets/appdemo/optimized/Frame3.jpg" 
              alt="TimeLapse App Screenshot 3" 
              className="rounded-2xl shadow-xl w-full h-auto"
              loading="lazy"
              width={380}
              height={720}
            />
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 scroll-mt-16" id="features">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-card/50 border p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <Calendar className="h-6 w-6 text-primary mr-3" />
                <h3 className="text-xl font-semibold">Year Tracker</h3>
              </div>
              <ul className="text-muted-foreground space-y-2">
                <li>• Visual representation of the entire year using dots</li>
                <li>• Track progress with an elegant dot-based interface</li>
                <li>• Highlights for important dates and events</li>
                <li>• Interactive date selection and navigation</li>
              </ul>
            </div>
            
            <div className="bg-card/50 border p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <Target className="h-6 w-6 text-primary mr-3" />
                <h3 className="text-xl font-semibold">Event Tracking</h3>
              </div>
              <ul className="text-muted-foreground space-y-2">
                <li>• Track multiple events simultaneously</li>
                <li>• Flexible countdown system showing days left</li>
                <li>• Multiple display styles for visualization</li>
                <li>• Customizable event cards with themes</li>
              </ul>
            </div>
            
            <div className="bg-card/50 border p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <Paintbrush className="h-6 w-6 text-primary mr-3" />
                <h3 className="text-xl font-semibold">Display Styles</h3>
              </div>
              <ul className="text-muted-foreground space-y-2">
                <li>• Grid Layout for organized viewing</li>
                <li>• Dot Pixels for beautiful visualization</li>
                <li>• Triangle Grid alternative style</li>
                <li>• Customizable colors and themes</li>
              </ul>
            </div>
            
            <div className="bg-card/50 border p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <Clock className="h-6 w-6 text-primary mr-3" />
                <h3 className="text-xl font-semibold">Smart Features</h3>
              </div>
              <ul className="text-muted-foreground space-y-2">
                <li>• Automatic progress calculation</li>
                <li>• Event highlights and navigation</li>
                <li>• Notification support for important dates</li>
                <li>• Share your progress and events</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* Customization Section */}
      <section className="py-16 scroll-mt-16" id="customization">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <img 
              src="/assets/appdemo/optimized/Frame4.png" 
              alt="TimeLapse App Advanced Controls" 
              className="rounded-2xl w-full h-auto max-w-md mx-auto order-2 md:order-1"
              loading="lazy"
              width={480}
              height={330}
            />
            <div className="order-1 md:order-2 bg-card/50 border rounded-lg p-6">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Customization Options</h2>
              <ul className="text-lg text-muted-foreground space-y-4 mb-6">
                <li className="flex items-start">
                  <div className="rounded-full bg-primary/10 p-1 mr-3 mt-1">
                    <div className="rounded-full bg-primary w-2 h-2"></div>
                  </div>
                  <span>Multiple background themes (Light, Dark, Dream)</span>
                </li>
                <li className="flex items-start">
                  <div className="rounded-full bg-primary/10 p-1 mr-3 mt-1">
                    <div className="rounded-full bg-primary w-2 h-2"></div>
                  </div>
                  <span>Customizable display colors for each event</span>
                </li>
                <li className="flex items-start">
                  <div className="rounded-full bg-primary/10 p-1 mr-3 mt-1">
                    <div className="rounded-full bg-primary w-2 h-2"></div>
                  </div>
                  <span>Toggle percentage display for progress tracking</span>
                </li>
                <li className="flex items-start">
                  <div className="rounded-full bg-primary/10 p-1 mr-3 mt-1">
                    <div className="rounded-full bg-primary w-2 h-2"></div>
                  </div>
                  <span>Flexible layout options for optimal viewing</span>
                </li>
              </ul>
              <Button variant="outline" className="mb-4">
                <ArrowRight className="mr-2 h-4 w-4" /> Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Getting Started Section */}
      <section className="py-16 scroll-mt-16" id="getting-started">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Getting Started</h2>
          <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-10">
            TimeLapse transforms time tracking from a mundane task into an engaging visual experience. By providing multiple ways to view and track your progress, it helps you stay motivated and achieve your goals.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card/50 border rounded-lg p-6 relative">
              <div className="absolute -top-5 left-5 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">1</div>
              <h3 className="text-xl font-semibold mb-3 mt-4">Year Tracking</h3>
              <p className="text-muted-foreground">
                Start by exploring the year tracker, which shows your progress through the current year using an intuitive dot-based interface.
              </p>
            </div>
            
            <div className="bg-card/50 border rounded-lg p-6 relative">
              <div className="absolute -top-5 left-5 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">2</div>
              <h3 className="text-xl font-semibold mb-3 mt-4">Adding Events</h3>
              <p className="text-muted-foreground">
                Create new events by specifying their target dates and customizing their appearance with different themes and colors.
              </p>
            </div>
            
            <div className="bg-card/50 border rounded-lg p-6 relative">
              <div className="absolute -top-5 left-5 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">3</div>
              <h3 className="text-xl font-semibold mb-3 mt-4">Customization</h3>
              <p className="text-muted-foreground">
                Personalize your experience by choosing display styles, colors, and themes that work best for you.
              </p>
            </div>
            
            <div className="bg-card/50 border rounded-lg p-6 relative">
              <div className="absolute -top-5 left-5 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">4</div>
              <h3 className="text-xl font-semibold mb-3 mt-4">Regular Check-ins</h3>
              <p className="text-muted-foreground">
                Make it a habit to check your progress regularly, using the visual feedback to stay motivated and on track.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 scroll-mt-16" id="download">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to visualize your time?</h2>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Download TimeLapse now and start tracking your goals with beautiful visual representations.
          </p>
          <div className="flex justify-center">
            <AppStoreButton className="mb-4" />
          </div>
          
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
            <a href="/timelapse/support" className="flex items-center text-muted-foreground hover:text-foreground">
              <MessageCircle className="mr-2 h-4 w-4" /> Support
            </a>
            <a href="/privacy-policy" className="flex items-center text-muted-foreground hover:text-foreground">
              <Shield className="mr-2 h-4 w-4" /> Privacy Policy
            </a>
          </div>
        </div>
      </section>
      
      <TimelapseFooter />
    </div>
  );
}
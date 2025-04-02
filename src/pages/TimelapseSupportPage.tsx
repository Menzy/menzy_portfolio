import { Mail, Shield } from 'lucide-react';
import { TimelapseNavbar } from '@/components/TimelapseNavbar';
import { TimelapseFooter } from '@/components/TimelapseFooter';
import { ThemeLogo } from '@/components/ThemeLogo';
import { useEffect } from 'react';

export function TimelapseSupportPage() {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <TimelapseNavbar />
      
      {/* Header */}
      <section className="container mx-auto px-4 py-16 pt-24 md:pt-32">
        <div className="text-center max-w-3xl mx-auto">
          <ThemeLogo width={60} height={60} className="mb-6 mx-auto" roundedSize="rounded-xl" />
          <h1 className="text-3xl md:text-5xl font-bold mb-6">TimeLapse Support</h1>
          <p className="text-xl text-muted-foreground mb-8">
            We're here to help you get the most out of your TimeLapse experience.
          </p>
        </div>
      </section>
      
      {/* Contact Options */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
            <div className="bg-card/50 border rounded-lg p-6 text-center max-w-xl mx-auto">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-primary/10 p-4">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Email Support</h3>
              <p className="text-muted-foreground mb-4">
                Send us a detailed message and we'll get back to you within 24 hours.
              </p>
              <a href="mailto:wanmenzy@gmail.com" className="text-primary hover:underline">
                wanmenzy@gmail.com
              </a>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-card/50 border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">How do I add a new event to track?</h3>
              <p className="text-muted-foreground">
                To add a new event, tap the "+" button on the main screen, then enter the event name and date. You can 
                customize the appearance by selecting a color and display style for your event.
              </p>
            </div>
            
            <div className="bg-card/50 border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Can I customize the appearance of my events?</h3>
              <p className="text-muted-foreground">
                Yes! TimeLapse offers multiple customization options. You can change the color, background theme, display 
                style, and even toggle percentage displays for each event you're tracking.
              </p>
            </div>
            
            <div className="bg-card/50 border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Is there a limit to how many events I can track?</h3>
              <p className="text-muted-foreground">
                The free version allows tracking up to 1 custom event in addition to the year tracker. For up to 5 event tracking and 
                additional premium features, consider upgrading to TimeLapse Pro.
              </p>
            </div>
            
            <div className="bg-card/50 border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">How do I get notifications for important dates?</h3>
              <p className="text-muted-foreground">
                In the event settings, you can enable notifications and set reminders for specific milestones or dates 
                related to your event. Make sure to allow notifications in your device settings.
              </p>
            </div>
            
            <div className="bg-card/50 border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Can I share my progress with others?</h3>
              <p className="text-muted-foreground">
                Yes! Tap the share icon on any event card to generate a beautiful image of your progress that you can 
                share on social media or with friends and family.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Privacy Policy Link */}
      <section className="py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center">
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
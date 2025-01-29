import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { LogoTicker } from '@/components/LogoTicker';
import { Work } from '@/components/Work';
import { BehindScenes } from '@/components/BehindScenes';
import { About } from '@/components/About';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';

export function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <LogoTicker />
      <Work />
      <BehindScenes />
      <About />
      <Contact />
      <Footer />
    </div>
  );
}
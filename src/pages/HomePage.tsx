import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { LogoTicker } from '@/components/LogoTicker';
import { Work } from '@/components/Work';
import { Projects } from '@/components/Projects';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import { HomeLoader } from '@/components/HomeLoader';
import { PageAppear } from '@/components/PageAppear';

export function HomePage() {
  const [showLoader, setShowLoader] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  // Check if we should show loader (on page load/reload, not on navigation)
  useEffect(() => {
    const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    const isReload = navigationEntries.length > 0 && navigationEntries[0].type === 'reload';
    const isDirectLoad = !sessionStorage.getItem('hasVisited');
    
    if (isReload || isDirectLoad) {
      setShowLoader(true);
      sessionStorage.setItem('hasVisited', 'true');
    } else {
      setShouldAnimate(true);
    }
  }, []);

  const handleLoaderComplete = () => {
    // Start gentle appear animation when loader wipe begins
    setShouldAnimate(true);
    // Remove loader after wipe completes
    setTimeout(() => {
      setShowLoader(false);
    }, 600);
  };

  return (
    <>
      {/* Homepage content is always rendered and visible */}
      <PageAppear shouldAnimate={shouldAnimate} delay={shouldAnimate ? 0.2 : 0}>
        <div className="min-h-screen bg-background">
          <Navbar />
          <Hero />
          <LogoTicker />
          <Work />
          <Projects />
          <Contact />
          <Footer />
        </div>
      </PageAppear>
      
      {/* Loader overlays on top */}
      {showLoader && <HomeLoader onComplete={handleLoaderComplete} />}
    </>
  );
}
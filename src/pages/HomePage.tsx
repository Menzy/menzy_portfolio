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
    
    // Always scroll to top on page reload or direct load
    if (isReload || isDirectLoad) {
      // Immediate scroll to top without smooth behavior for instant effect
      window.scrollTo(0, 0);
      setShowLoader(true);
      sessionStorage.setItem('hasVisited', 'true');
    } else {
      setShouldAnimate(true);
    }
  }, []);

  // Additional effect to ensure scroll to top on any page reload
  useEffect(() => {
    // Force scroll to top on component mount (covers all reload scenarios)
    const handleBeforeUnload = () => {
      // This ensures the next page load starts from the top
      window.scrollTo(0, 0);
    };

    // Also handle the case where user reloads while not at top
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Ensure immediate scroll to top on mount
    if (window.scrollY > 0) {
      window.scrollTo(0, 0);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
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
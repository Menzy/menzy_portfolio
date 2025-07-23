import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useEffect, useState } from 'react';

interface LoaderProps {
  onLoadingComplete: () => void;
}

export const Loader = ({ onLoadingComplete }: LoaderProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Set minimum loading time to ensure animation plays
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Add a small delay for fade out animation
      setTimeout(onLoadingComplete, 300);
    }, 2000); // Show loader for at least 2 seconds

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  if (!isVisible) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex items-center justify-center transition-opacity duration-300 opacity-0 pointer-events-none">
        <DotLottieReact
          src="/assets/loader_plane.json"
          loop
          autoplay
          className="w-96 h-96"
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center transition-opacity duration-300">
      <DotLottieReact
  src="/assets/loader_plane.json"
        loop
        autoplay
  className="w-96 h-96"
      />
    </div>
  );
};
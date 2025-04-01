import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface ThemeLogoProps {
  className?: string;
  width?: number;
  height?: number;
  roundedSize?: string;
}

export function ThemeLogo({ 
  className, 
  width = 32, 
  height = 32, 
  roundedSize = "rounded-lg" 
}: ThemeLogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // This effect ensures hydration completes before accessing the theme
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;
  
  const logoSrc = resolvedTheme === 'dark' ? '/assets/light.png' : '/assets/dark.png';
  
  return (
    <img 
      src={logoSrc} 
      alt="TimeLapse Logo" 
      width={width} 
      height={height} 
      className={`${roundedSize} ${className || ""}`} 
    />
  );
} 
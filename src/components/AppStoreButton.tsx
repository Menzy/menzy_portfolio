import { useTheme } from "next-themes";

interface AppStoreButtonProps {
  className?: string;
}

export function AppStoreButton({ className }: AppStoreButtonProps) {
  const { theme } = useTheme();
  
  return (
    <a 
      href="https://apps.apple.com/gh/app/timelapse/id6743305268" 
      target="_blank" 
      rel="noopener noreferrer"
      className={className}
    >
      <img 
        src={`/assets/appStore/${theme === 'dark' ? 'white' : 'black'}.svg`}
        alt="Download on the App Store"
        className="h-10 w-auto"
      />
    </a>
  );
}
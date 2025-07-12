import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import { cn } from "@/lib/utils";

const loadingAnimation = {
  "v": "5.7.8",
  "fr": 60,
  "ip": 0,
  "op": 180,
  "w": 400,
  "h": 400,
  "nm": "Loading Animation",
  "ddd": 0,
  "assets": [],
  "layers": [
    {
      "ddd": 0,
      "ind": 1,
      "ty": 4,
      "nm": "Outer Circle",
      "sr": 1,
      "ks": {
        "o": { "a": 0, "k": 100 },
        "r": {
          "a": 1,
          "k": [
            {
              "i": { "x": [0.833], "y": [0.833] },
              "o": { "x": [0.167], "y": [0.167] },
              "t": 0,
              "s": [0]
            },
            { "t": 180, "s": [360] }
          ]
        },
        "p": { "a": 0, "k": [200, 200, 0] },
        "a": { "a": 0, "k": [0, 0, 0] },
        "s": { "a": 0, "k": [100, 100, 100] }
      },
      "ao": 0,
      "shapes": [
        {
          "ty": "gr",
          "it": [
            {
              "d": 1,
              "ty": "el",
              "s": { "a": 0, "k": [160, 160] },
              "p": { "a": 0, "k": [0, 0] }
            },
            {
              "ty": "st",
              "c": { "a": 0, "k": [0.2, 0.2, 0.2, 1] },
              "o": { "a": 0, "k": 100 },
              "w": { "a": 0, "k": 16 },
              "lc": 2,
              "lj": 2
            },
            {
              "ty": "tr",
              "p": { "a": 0, "k": [0, 0] },
              "a": { "a": 0, "k": [0, 0] },
              "s": { "a": 0, "k": [100, 100] },
              "r": { "a": 0, "k": 0 },
              "o": { "a": 0, "k": 100 }
            }
          ]
        }
      ]
    },
    {
      "ddd": 0,
      "ind": 2,
      "ty": 4,
      "nm": "Inner Circle",
      "sr": 1,
      "ks": {
        "o": { "a": 0, "k": 30 },
        "r": {
          "a": 1,
          "k": [
            {
              "i": { "x": [0.833], "y": [0.833] },
              "o": { "x": [0.167], "y": [0.167] },
              "t": 0,
              "s": [360]
            },
            { "t": 180, "s": [0] }
          ]
        },
        "p": { "a": 0, "k": [200, 200, 0] },
        "a": { "a": 0, "k": [0, 0, 0] },
        "s": { "a": 0, "k": [100, 100, 100] }
      },
      "ao": 0,
      "shapes": [
        {
          "ty": "gr",
          "it": [
            {
              "d": 1,
              "ty": "el",
              "s": { "a": 0, "k": [120, 120] },
              "p": { "a": 0, "k": [0, 0] }
            },
            {
              "ty": "st",
              "c": { "a": 0, "k": [0.2, 0.2, 0.2, 1] },
              "o": { "a": 0, "k": 100 },
              "w": { "a": 0, "k": 8 },
              "lc": 2,
              "lj": 2
            },
            {
              "ty": "tr",
              "p": { "a": 0, "k": [0, 0] },
              "a": { "a": 0, "k": [0, 0] },
              "s": { "a": 0, "k": [100, 100] },
              "r": { "a": 0, "k": 0 },
              "o": { "a": 0, "k": 100 }
            }
          ]
        }
      ]
    }
  ]
};

export function Loader() {
  const [progress, setProgress] = useState(0);
  const [showLoader, setShowLoader] = useState(true);
  const [textPhase, setTextPhase] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        const next = prev + Math.random() * 20;
        return next > 100 ? 100 : next;
      });
    }, 200);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Text animation sequence
    const textTimer = setTimeout(() => {
      setTextPhase(1);
    }, 1000);

    const textTimer2 = setTimeout(() => {
      setTextPhase(2);
    }, 2500);

    if (progress === 100) {
      const timeout = setTimeout(() => {
        setShowLoader(false);
      }, 1000);
      return () => {
        clearTimeout(timeout);
        clearTimeout(textTimer);
        clearTimeout(textTimer2);
      };
    }

    return () => {
      clearTimeout(textTimer);
      clearTimeout(textTimer2);
    };
  }, [progress]);

  if (!showLoader) return null;

  return (
    <div className={cn(
      "fixed inset-0 z-[100] flex items-center justify-center bg-background transition-opacity duration-500 h-screen w-screen",
      progress === 100 ? "opacity-0" : "opacity-100"
    )}>
      <div className="flex flex-col items-center justify-center gap-12">
        <div className="w-48 h-48 relative">
          <Lottie
            animationData={loadingAnimation}
            loop={true}
            className="w-full h-full dark:invert"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-bold">{Math.round(progress)}%</span>
          </div>
        </div>
        
        <div className="text-center space-y-4">
          <h2 
            className={cn(
              "text-4xl font-bold transition-all duration-500",
              textPhase === 0 ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
            )}
          >
            Hi there
          </h2>
          <p 
            className={cn(
              "text-2xl text-muted-foreground transition-all duration-500",
              textPhase < 2 ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
            )}
          >
            Welcome to my world
          </p>
        </div>
      </div>
    </div>
  );
}
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";

interface HomeLoaderProps {
  onComplete: () => void;
}

export const HomeLoader = ({ onComplete }: HomeLoaderProps) => {
  const [showText, setShowText] = useState(false);
  const [hideLoader, setHideLoader] = useState(false);

  const text = "Wan Menzy";
  const letters = text.split("");

  useEffect(() => {
    // Start text animation immediately
    setShowText(true);

    // Start wipe up after text completes (much faster)
    const wipeTimer = setTimeout(() => {
      setHideLoader(true);
    }, 1200);

    // Complete loader sequence
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 1800);

    return () => {
      clearTimeout(wipeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
        delayChildren: 0.1,
      },
    },
  };

  const letterVariants = {
    hidden: {
      opacity: 0,
      y: "100vh", // Start from bottom of screen
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <AnimatePresence>
      {!hideLoader ? (
        <motion.div
          className="fixed inset-0 bg-black z-[100] flex items-center justify-center"
          exit={{
            y: "-100%",
            transition: {
              duration: 0.6,
              ease: "easeInOut" as const,
            },
          }}
        >
          {showText && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-3xl md:text-4xl font-normal text-white tracking-tight"
            >
              {letters.map((letter, index) => (
                <motion.span
                  key={index}
                  variants={letterVariants}
                  className="inline-block"
                  style={{ whiteSpace: letter === " " ? "pre" : "normal" }}
                >
                  {letter === " " ? "\u00A0" : letter}
                </motion.span>
              ))}
            </motion.div>
          )}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};
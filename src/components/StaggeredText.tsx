import { motion } from "motion/react";

interface StaggeredTextProps {
  text: string;
  className?: string;
  delay?: number;
  staggerDelay?: number;
}

export const StaggeredText = ({ 
  text, 
  className = "", 
  delay = 0, 
  staggerDelay = 0.05 
}: StaggeredTextProps) => {
  const letters = text.split("");

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay,
        staggerChildren: staggerDelay,
      },
    },
  };

  const child = {
    hidden: {
      opacity: 0,
      y: 50,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.05, 0.7, 0.1, 1],
      },
    },
  };

  return (
    <motion.div
      className={`inline-block ${className}`}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          variants={child}
          className="inline-block"
          style={{ whiteSpace: letter === " " ? "pre" : "normal" }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.div>
  );
};
import { motion } from "motion/react";
import { ReactNode } from "react";

interface PageAppearProps {
  children: ReactNode;
  delay?: number;
  shouldAnimate?: boolean;
}

export const PageAppear = ({ children, delay = 0, shouldAnimate = true }: PageAppearProps) => {
  return (
    <motion.div
      initial={shouldAnimate ? { y: 8, opacity: 1 } : { y: 0, opacity: 1 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: shouldAnimate ? 1.0 : 0,
        delay: shouldAnimate ? delay : 0,
        ease: [0.05, 0.7, 0.1, 1],
      }}
    >
      {children}
    </motion.div>
  );
};
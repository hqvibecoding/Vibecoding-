import { motion } from "motion/react";
import { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right" | "none";
  delay?: number;
  duration?: number;
  className?: string;
  width?: "fit-content" | "100%";
}

export default function Reveal({ 
  children, 
  direction = "up", 
  delay = 0, 
  duration = 1.2,
  className = "",
  width = "fit-content"
}: RevealProps) {
  const getInitialProps = () => {
    switch (direction) {
      case "up": return { opacity: 0, y: 50, scale: 0.98 };
      case "down": return { opacity: 0, y: -50, scale: 0.98 };
      case "left": return { opacity: 0, x: 50, scale: 0.98 };
      case "right": return { opacity: 0, x: -50, scale: 0.98 };
      case "none": return { opacity: 0, scale: 0.95 };
      default: return { opacity: 0, y: 50, scale: 0.98 };
    }
  };

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width }}>
      <motion.div
        initial={getInitialProps()}
        whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ 
          duration, 
          delay, 
          ease: [0.22, 1, 0.36, 1] 
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

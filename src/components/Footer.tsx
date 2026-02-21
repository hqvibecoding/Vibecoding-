import { motion } from "motion/react";
import { Mail, Phone } from "lucide-react";
import { useRef, useState } from "react";

interface FooterProps {
  onAdminClick: () => void;
}

export default function Footer({ onAdminClick }: FooterProps) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [isHolding, setIsHolding] = useState(false);

  const startHolding = () => {
    setIsHolding(true);
    timerRef.current = setTimeout(() => {
      onAdminClick();
      setIsHolding(false);
    }, 5000); // 5 seconds hold
  };

  const stopHolding = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsHolding(false);
  };

  return (
    <footer className="py-32 md:py-48 px-6 md:px-12 border-t border-white/5 bg-[#050505] relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-white/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col items-center space-y-16 md:space-y-24 relative z-10">
        {/* Contact Section */}
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-24">
          <a 
            href="mailto:hellovibecoding@gmail.com" 
            className="group flex flex-col items-center gap-3 transition-all duration-500"
          >
            <div className="p-4 rounded-full border border-white/5 group-hover:border-white/20 group-hover:bg-white/5 transition-all duration-500">
              <Mail className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-[10px] md:text-[11px] uppercase tracking-[0.4em] opacity-40 group-hover:opacity-100 transition-opacity">
              hellovibecoding@gmail.com
            </span>
          </a>

          <a 
            href="tel:7411041972" 
            className="group flex flex-col items-center gap-3 transition-all duration-500"
          >
            <div className="p-4 rounded-full border border-white/5 group-hover:border-white/20 group-hover:bg-white/5 transition-all duration-500">
              <Phone className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-[10px] md:text-[11px] uppercase tracking-[0.4em] opacity-40 group-hover:opacity-100 transition-opacity">
              +91 7411041972
            </span>
          </a>
        </div>

        {/* Subtle Admin Trigger with 5s Long Press */}
        <div className="text-center">
          <motion.button
            animate={{ 
              opacity: isHolding ? 0.3 : 0.05,
              scale: isHolding ? 1.1 : 1
            }}
            transition={{ duration: 5, ease: "linear" }}
            onPointerDown={startHolding}
            onPointerUp={stopHolding}
            onPointerLeave={stopHolding}
            className="premium-serif text-4xl md:text-7xl font-light tracking-[0.3em] cursor-default select-none outline-none active:scale-95 transition-transform duration-150"
          >
            VAULT
          </motion.button>
          {isHolding && (
            <p className="text-[8px] uppercase tracking-[0.5em] opacity-20 mt-4 animate-pulse">
              Verifying Authority...
            </p>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="w-full pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[9px] md:text-[10px] uppercase tracking-[0.5em] opacity-20">
            © 2026 Vibe Coding. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

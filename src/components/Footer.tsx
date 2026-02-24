import { motion } from "motion/react";
import { Mail, Phone } from "lucide-react";
import { useRef, useState } from "react";

interface FooterProps {
  onAdminClick: () => void;
  theme?: "dark" | "light";
}

export default function Footer({ onAdminClick, theme = "dark" }: FooterProps) {
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
    <footer className={`py-32 md:py-48 px-6 md:px-12 border-t transition-colors duration-700 relative overflow-hidden ${
      theme === "dark" ? "border-white/5 bg-[#050505]" : "border-black/5 bg-white"
    }`}>
      {/* Subtle Background Glow - Tuned for both themes */}
      <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] blur-[150px] rounded-full pointer-events-none transition-opacity duration-1000 ${
        theme === "dark" ? "bg-white/[0.03]" : "bg-black/[0.03]"
      }`} />

      <div className="max-w-7xl mx-auto flex flex-col items-center space-y-16 md:space-y-24 relative z-10">
        {/* Contact Section */}
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-24">
          <a 
            href="mailto:hellovibecoding@gmail.com" 
            className="group flex flex-col items-center gap-3 transition-all duration-500"
          >
            <div className={`p-5 rounded-full border transition-all duration-500 ${
              theme === "dark" 
                ? "border-white/5 bg-white/[0.02] group-hover:border-white/20 group-hover:bg-white/5" 
                : "border-black/5 bg-black/[0.02] group-hover:border-black/20 group-hover:bg-black/5"
            }`}>
              <Mail className={`w-5 h-5 transition-opacity duration-500 ${
                theme === "dark" ? "text-white opacity-40 group-hover:opacity-100" : "text-black opacity-40 group-hover:opacity-100"
              }`} />
            </div>
            <span className={`text-[10px] md:text-[11px] uppercase tracking-[0.4em] transition-opacity duration-500 ${
              theme === "dark" ? "text-white opacity-40 group-hover:opacity-100" : "text-black opacity-40 group-hover:opacity-100"
            }`}>
              hellovibecoding@gmail.com
            </span>
          </a>

          <a 
            href="tel:7411041972" 
            className="group flex flex-col items-center gap-3 transition-all duration-500"
          >
            <div className={`p-5 rounded-full border transition-all duration-500 ${
              theme === "dark" 
                ? "border-white/5 bg-white/[0.02] group-hover:border-white/20 group-hover:bg-white/5" 
                : "border-black/5 bg-black/[0.02] group-hover:border-black/20 group-hover:bg-black/5"
            }`}>
              <Phone className={`w-5 h-5 transition-opacity duration-500 ${
                theme === "dark" ? "text-white opacity-40 group-hover:opacity-100" : "text-black opacity-40 group-hover:opacity-100"
              }`} />
            </div>
            <span className={`text-[10px] md:text-[11px] uppercase tracking-[0.4em] transition-opacity duration-500 ${
              theme === "dark" ? "text-white opacity-40 group-hover:opacity-100" : "text-black opacity-40 group-hover:opacity-100"
            }`}>
              +91 7411041972
            </span>
          </a>
        </div>

        {/* Subtle Admin Trigger with 5s Long Press */}
        <div className="text-center">
          <motion.button
            animate={{ 
              opacity: isHolding ? 0.4 : 0.08,
              scale: isHolding ? 1.05 : 1
            }}
            transition={{ duration: 5, ease: "linear" }}
            onPointerDown={startHolding}
            onPointerUp={stopHolding}
            onPointerLeave={stopHolding}
            className={`premium-serif text-4xl md:text-8xl font-light tracking-[0.4em] cursor-default select-none outline-none active:scale-95 transition-all duration-300 ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
          >
            VAULT
          </motion.button>
          {isHolding && (
            <p className={`text-[8px] uppercase tracking-[0.6em] mt-6 animate-pulse ${
              theme === "dark" ? "text-white opacity-20" : "text-black opacity-20"
            }`}>
              Verifying Authority...
            </p>
          )}
        </div>

        {/* Bottom Bar */}
        <div className={`w-full pt-12 border-t flex flex-col md:flex-row justify-between items-center gap-6 transition-colors duration-700 ${
          theme === "dark" ? "border-white/5" : "border-black/5"
        }`}>
          <p className={`text-[9px] md:text-[10px] uppercase tracking-[0.5em] opacity-20 ${
            theme === "dark" ? "text-white" : "text-black"
          }`}>
            © 2026 Vibe Coding. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

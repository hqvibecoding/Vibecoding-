import { motion } from "motion/react";
import { Mail, Phone } from "lucide-react";
import { useRef, useState } from "react";

interface FooterProps {
  onAdminClick: () => void;
  onLegalClick: (type: "privacy" | "terms" | "cookies") => void;
  theme?: "dark" | "light";
}

export default function Footer({ onAdminClick, onLegalClick, theme = "dark" }: FooterProps) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [isHolding, setIsHolding] = useState(false);

  const startHolding = () => {
    setIsHolding(true);
    timerRef.current = setTimeout(() => {
      onAdminClick();
      setIsHolding(false);
    }, 5000);
  };

  const stopHolding = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsHolding(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={`pt-32 pb-12 px-6 md:px-24 border-t transition-colors duration-700 relative overflow-hidden ${
      theme === "dark" ? "border-white/5 bg-[#050505]" : "border-black/5 bg-white"
    }`}>
      {/* Subtle Background Glow */}
      <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] blur-[150px] rounded-full pointer-events-none transition-opacity duration-1000 ${
        theme === "dark" ? "bg-white/[0.02]" : "bg-black/[0.02]"
      }`} />

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 md:gap-12 mb-24">
          {/* Branding Section */}
          <div className="space-y-6 lg:col-span-1">
            <div className="space-y-2">
              <h2 className={`premium-serif text-2xl uppercase tracking-[0.2em] ${
                theme === "dark" ? "text-white" : "text-black"
              }`}>
                HQ Vibe Coding
              </h2>
              <p className="text-[10px] uppercase tracking-[0.3em] opacity-40 leading-relaxed">
                Premium 3D WebGL Agency.<br />
                Elevating Digital Experiences.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-8">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.4em] opacity-30">Navigation</h4>
            <ul className="space-y-4">
              {['Home', 'About', 'Services', 'Portfolio'].map((item) => (
                <li key={item}>
                  <a 
                    href={`#${item.toLowerCase()}`}
                    className="text-[10px] uppercase tracking-[0.3em] opacity-60 hover:opacity-100 transition-opacity block"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-8">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.4em] opacity-30">Legal</h4>
            <ul className="space-y-4">
              <li>
                <button 
                  onClick={() => onLegalClick("privacy")}
                  className="text-[10px] uppercase tracking-[0.3em] opacity-60 hover:opacity-100 transition-opacity"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onLegalClick("terms")}
                  className="text-[10px] uppercase tracking-[0.3em] opacity-60 hover:opacity-100 transition-opacity"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onLegalClick("cookies")}
                  className="text-[10px] uppercase tracking-[0.3em] opacity-60 hover:opacity-100 transition-opacity"
                >
                  Cookie Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.4em] opacity-30">Contact</h4>
            <div className="space-y-6">
              <a href="mailto:hellovibecoding@gmail.com" className="group flex items-center gap-4 max-w-full overflow-hidden">
                <div className={`p-3 rounded-xl border transition-all flex-shrink-0 ${
                  theme === "dark" ? "border-white/5 bg-white/5 group-hover:bg-white/10" : "border-black/5 bg-black/5 group-hover:bg-black/10"
                }`}>
                  <Mail className="w-4 h-4 opacity-50" />
                </div>
                <span className="text-[10px] uppercase tracking-[0.15em] opacity-60 group-hover:opacity-100 transition-opacity break-all">
                  hellovibecoding@gmail.com
                </span>
              </a>
              <a href="tel:7411041972" className="group flex items-center gap-4">
                <div className={`p-3 rounded-xl border transition-all flex-shrink-0 ${
                  theme === "dark" ? "border-white/5 bg-white/5 group-hover:bg-white/10" : "border-black/5 bg-black/5 group-hover:bg-black/10"
                }`}>
                  <Phone className="w-4 h-4 opacity-50" />
                </div>
                <span className="text-[10px] uppercase tracking-[0.2em] opacity-60 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  +91 7411041972
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`pt-12 border-t flex flex-col md:flex-row justify-between items-center gap-8 ${
          theme === "dark" ? "border-white/5" : "border-black/5"
        }`}>
          <div className="flex items-center gap-8">
            <p className="text-[9px] uppercase tracking-[0.4em] opacity-20">
              Copyright © 2026 HQ Vibe Coding | All Rights Reserved.
            </p>
          </div>

          {/* Hidden Admin Trigger */}
          <motion.button
            animate={{ opacity: isHolding ? 0.4 : 0.05 }}
            onPointerDown={startHolding}
            onPointerUp={stopHolding}
            onPointerLeave={stopHolding}
            className="text-[8px] uppercase tracking-[0.8em] cursor-default select-none outline-none"
          >
            VAULT
          </motion.button>
        </div>
      </div>
    </footer>
  );
}

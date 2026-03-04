import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { useEffect } from "react";

type LegalType = "privacy" | "terms" | "cookies";

interface LegalOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  type: LegalType | null;
  theme?: "dark" | "light";
}

export default function LegalOverlay({ isOpen, onClose, type, theme = "dark" }: LegalOverlayProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const getContent = () => {
    switch (type) {
      case "privacy":
        return (
          <div className="space-y-8">
            <h2 className="premium-serif text-4xl md:text-6xl font-light">Privacy Policy<span className="italic opacity-50">.</span></h2>
            <div className="space-y-6 opacity-70 text-sm md:text-base leading-relaxed font-light">
              <section className="space-y-4">
                <h3 className="text-lg font-bold uppercase tracking-widest opacity-100">Introduction</h3>
                <p>At HQ Vibe Coding, we value your privacy. This policy explains how we handle your data.</p>
              </section>
              
              <section className="space-y-4">
                <h3 className="text-lg font-bold uppercase tracking-widest opacity-100">Data Collection</h3>
                <p>We only collect information you voluntarily provide via our contact forms (Name, Email, Phone).</p>
              </section>

              <section className="space-y-4">
                <h3 className="text-lg font-bold uppercase tracking-widest opacity-100">Usage</h3>
                <p>We use this data solely to communicate with you about your project. We never sell your data to third parties.</p>
              </section>

              <section className="space-y-4">
                <h3 className="text-lg font-bold uppercase tracking-widest opacity-100">Security</h3>
                <p>Our website uses HTTPS encryption to keep your interactions safe.</p>
              </section>

              <section className="space-y-4">
                <h3 className="text-lg font-bold uppercase tracking-widest opacity-100">Contact</h3>
                <p>For any privacy concerns, email us at <span className="font-bold">hellovibecoding@gmail.com</span>.</p>
              </section>
            </div>
          </div>
        );
      case "terms":
        return (
          <div className="space-y-8">
            <h2 className="premium-serif text-4xl md:text-6xl font-light">Terms of Service<span className="italic opacity-50">.</span></h2>
            <div className="space-y-6 opacity-70 text-sm md:text-base leading-relaxed font-light">
              <section className="space-y-4">
                <h3 className="text-lg font-bold uppercase tracking-widest opacity-100">Service Agreement</h3>
                <p>By using hqvibecoding.netlify.app, you agree to our professional terms.</p>
              </section>

              <section className="space-y-4">
                <h3 className="text-lg font-bold uppercase tracking-widest opacity-100">Intellectual Property</h3>
                <p>All 3D assets and code created by HQ Vibe Coding remain our property until the final project handover.</p>
              </section>

              <section className="space-y-4">
                <h3 className="text-lg font-bold uppercase tracking-widest opacity-100">Limitation of Liability</h3>
                <p>We are not responsible for third-party hosting downtimes or external browser changes.</p>
              </section>

              <p className="pt-8 border-t border-current opacity-30 text-[10px] uppercase tracking-widest">Last Updated: March 2026</p>
            </div>
          </div>
        );
      case "cookies":
        return (
          <div className="space-y-8">
            <h2 className="premium-serif text-4xl md:text-6xl font-light">Cookie Policy<span className="italic opacity-50">.</span></h2>
            <div className="space-y-6 opacity-70 text-sm md:text-base leading-relaxed font-light">
              <section className="space-y-4">
                <h3 className="text-lg font-bold uppercase tracking-widest opacity-100">Usage</h3>
                <p>We use essential cookies to ensure our 3D WebGL models run smoothly on your device.</p>
              </section>

              <section className="space-y-4">
                <h3 className="text-lg font-bold uppercase tracking-widest opacity-100">Performance</h3>
                <p>These cookies do not track personal information; they only optimize performance and browser caching.</p>
              </section>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 z-[200] flex items-center justify-center p-6 md:p-12 transition-colors duration-700 ${
            theme === "dark" ? "bg-black/95 text-white" : "bg-white/95 text-black"
          }`}
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className={`relative w-full max-w-4xl max-h-full overflow-y-auto p-8 md:p-16 rounded-3xl border hide-scrollbar ${
              theme === "dark" ? "bg-zinc-900 border-white/10" : "bg-zinc-50 border-black/10"
            }`}
          >
            <button
              onClick={onClose}
              className={`absolute top-8 right-8 p-3 rounded-full border transition-all hover:scale-110 active:scale-95 ${
                theme === "dark" ? "border-white/10 bg-white/5 hover:bg-white/10" : "border-black/10 bg-black/5 hover:bg-black/10"
              }`}
            >
              <X className="w-5 h-5 opacity-50" />
            </button>

            {getContent()}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

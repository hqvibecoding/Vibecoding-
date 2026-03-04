import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Mail, Phone, MessageSquare } from "lucide-react";

export default function Contact({ theme = "dark" }: { theme?: "dark" | "light" }) {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <section id="contact" className="py-20 md:py-40 px-6 md:px-24">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-20 md:mb-32">
          <span className="text-[10px] uppercase tracking-[1em] opacity-40 mb-6 block">Contact Us</span>
          <h2 className="premium-serif text-4xl md:text-7xl font-light">
            Let’s Build the Future of Your Brand in 3D<span className="italic opacity-50">.</span>
          </h2>
          <p className="mt-8 text-[10px] md:text-[12px] uppercase tracking-[0.4em] opacity-40">
            Have a project in mind? Reach out and we’ll respond within 2 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 md:gap-40">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form
                key="form"
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-12"
                onSubmit={handleSubmit}
              >
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-[0.3em] opacity-40">Full Name</label>
                  <input 
                    required
                    type="text" 
                    placeholder="John Doe"
                    className={`w-full bg-transparent border-b py-4 outline-none transition-colors duration-500 ${
                      theme === "dark" ? "border-white/10 focus:border-white" : "border-black/10 focus:border-black"
                    }`}
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-[0.3em] opacity-40">Business Email</label>
                  <input 
                    required
                    type="email" 
                    placeholder="john@company.com"
                    className={`w-full bg-transparent border-b py-4 outline-none transition-colors duration-500 ${
                      theme === "dark" ? "border-white/10 focus:border-white" : "border-black/10 focus:border-black"
                    }`}
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-[0.3em] opacity-40">Phone Number</label>
                  <input 
                    required
                    type="tel" 
                    placeholder="+91 7411041972"
                    className={`w-full bg-transparent border-b py-4 outline-none transition-colors duration-500 ${
                      theme === "dark" ? "border-white/10 focus:border-white" : "border-black/10 focus:border-black"
                    }`}
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-[0.3em] opacity-40">Project Details (Optional)</label>
                  <textarea 
                    rows={4}
                    placeholder="Tell us about your vision..."
                    className={`w-full bg-transparent border-b py-4 outline-none transition-colors duration-500 resize-none ${
                      theme === "dark" ? "border-white/10 focus:border-white" : "border-black/10 focus:border-black"
                    }`}
                  />
                </div>
                <button className={`w-full py-4 sm:py-6 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.4em] transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] ${
                  theme === "dark" ? "bg-white text-black hover:bg-zinc-200" : "bg-black text-white hover:bg-zinc-800"
                }`}>
                  Send Inquiry
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`flex flex-col items-center justify-center p-12 text-center rounded-3xl border ${
                  theme === "dark" ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"
                }`}
              >
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mb-8">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <h3 className="premium-serif text-3xl mb-4">Message Sent!</h3>
                <p className="text-sm opacity-60 uppercase tracking-widest leading-relaxed">
                  We have received your inquiry.<br />Our team will reach out within 2 hours.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div 
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-16"
          >
            <div className="space-y-8">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.4em] opacity-30">Direct Contact</h4>
              <div className="space-y-10">
                <a href="mailto:hellovibecoding@gmail.com" className="group flex items-center gap-6">
                  <div className={`p-4 rounded-2xl border transition-all duration-500 ${
                    theme === "dark" ? "border-white/5 bg-white/5 group-hover:bg-white/10" : "border-black/5 bg-black/5 group-hover:bg-black/10"
                  }`}>
                    <Mail className="w-5 h-5 opacity-50" />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.3em] opacity-40 mb-1">Email Us</p>
                    <p className="text-sm md:text-lg font-light tracking-widest">hellovibecoding@gmail.com</p>
                  </div>
                </a>
                <a href="tel:7411041972" className="group flex items-center gap-6">
                  <div className={`p-4 rounded-2xl border transition-all duration-500 ${
                    theme === "dark" ? "border-white/5 bg-white/5 group-hover:bg-white/10" : "border-black/5 bg-black/5 group-hover:bg-black/10"
                  }`}>
                    <Phone className="w-5 h-5 opacity-50" />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.3em] opacity-40 mb-1">Call Us</p>
                    <p className="text-sm md:text-lg font-light tracking-widest">+91 7411041972</p>
                  </div>
                </a>
                <a href="https://wa.me/917411041972" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-6">
                  <div className={`p-4 rounded-2xl border transition-all duration-500 ${
                    theme === "dark" ? "border-white/5 bg-white/5 group-hover:bg-white/10" : "border-black/5 bg-black/5 group-hover:bg-black/10"
                  }`}>
                    <MessageSquare className="w-5 h-5 opacity-50" />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.3em] opacity-40 mb-1">WhatsApp</p>
                    <p className="text-sm md:text-lg font-light tracking-widest">+91 7411041972</p>
                  </div>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

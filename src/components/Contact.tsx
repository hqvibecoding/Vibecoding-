import { motion, AnimatePresence } from "motion/react";
import { useState, useRef } from "react";
import { Mail, Phone, MessageSquare, CheckCircle2, X } from "lucide-react";
import { ref, push, serverTimestamp } from "firebase/database";
import { db } from "../firebase";
import emailjs from "@emailjs/browser";

export default function Contact({ theme = "dark" }: { theme?: "dark" | "light" }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    user_phone: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage("Sending...");

    try {
      // 1. Save to Firebase (Backup)
      const inquiriesRef = ref(db, "inquiries");
      await push(inquiriesRef, {
        ...formData,
        timestamp: serverTimestamp(),
        status: "new"
      });

      // 2. Send via EmailJS
      if (formRef.current) {
        await emailjs.sendForm(
          "service_2e9wzpp",
          "template_25mij2p",
          formRef.current,
          "Wu5-FXNgBXQwXz2Vl"
        );
      }

      setIsSubmitted(true);
      setStatusMessage("Message sent successfully!");
      setFormData({ user_name: "", user_email: "", user_phone: "", message: "" });
    } catch (error) {
      console.error("Error submitting form:", error);
      setStatusMessage("Failed to send message. Please try again.");
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <section id="contact" className="py-20 md:py-40 px-6 md:px-24 relative overflow-hidden">
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
          <motion.form
            ref={formRef}
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
                name="user_name"
                value={formData.user_name}
                onChange={handleChange}
                type="text" 
                placeholder="John Doe"
                className={`w-full bg-transparent border-b py-4 outline-none transition-colors duration-500 ${
                  theme === "dark" 
                    ? "border-white/10 focus:border-white text-white placeholder:text-white/40" 
                    : "border-black/10 focus:border-black text-black placeholder:text-black/40"
                }`}
              />
              <p className="text-[8px] uppercase tracking-[0.2em] opacity-30 italic">Example: James Bond</p>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-[0.3em] opacity-40">Business Email</label>
              <input 
                required
                name="user_email"
                value={formData.user_email}
                onChange={handleChange}
                type="email" 
                placeholder="john@company.com"
                className={`w-full bg-transparent border-b py-4 outline-none transition-colors duration-500 ${
                  theme === "dark" 
                    ? "border-white/10 focus:border-white text-white placeholder:text-white/40" 
                    : "border-black/10 focus:border-black text-black placeholder:text-black/40"
                }`}
              />
              <p className="text-[8px] uppercase tracking-[0.2em] opacity-30 italic">Example: hello@vibecoding.com</p>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-[0.3em] opacity-40">Phone Number</label>
              <input 
                required
                name="user_phone"
                value={formData.user_phone}
                onChange={handleChange}
                type="tel" 
                placeholder="+91 7411041972"
                className={`w-full bg-transparent border-b py-4 outline-none transition-colors duration-500 ${
                  theme === "dark" 
                    ? "border-white/10 focus:border-white text-white placeholder:text-white/40" 
                    : "border-black/10 focus:border-black text-black placeholder:text-black/40"
                }`}
              />
              <p className="text-[8px] uppercase tracking-[0.2em] opacity-30 italic">Example: +91 98765 43210</p>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-[0.3em] opacity-40">Project Details (Optional)</label>
              <textarea 
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                placeholder="Tell us about your vision..."
                className={`w-full bg-transparent border-b py-4 outline-none transition-colors duration-500 resize-none ${
                  theme === "dark" 
                    ? "border-white/10 focus:border-white text-white placeholder:text-white/40" 
                    : "border-black/10 focus:border-black text-black placeholder:text-black/40"
                }`}
              />
              <p className="text-[8px] uppercase tracking-[0.2em] opacity-30 italic">Example: I want to build a 3D showroom for my luxury car brand.</p>
            </div>
            <div className="space-y-4">
              <button 
                disabled={isLoading}
                className={`w-full py-4 sm:py-6 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.4em] transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${
                  theme === "dark" ? "bg-white text-black hover:bg-zinc-200" : "bg-black text-white hover:bg-zinc-800"
                }`}
              >
                {isLoading ? "Sending..." : "Send Inquiry"}
              </button>
              {statusMessage && (
                <p className={`text-[10px] uppercase tracking-[0.2em] text-center ${
                  statusMessage.includes("successfully") ? "text-emerald-500" : "text-red-500 opacity-60"
                }`}>
                  {statusMessage}
                </p>
              )}
            </div>
          </motion.form>

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
      {/* Success Popup Modal */}
      <AnimatePresence>
        {isSubmitted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center px-6 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className={`relative max-w-md w-full p-10 md:p-16 rounded-[40px] border text-center shadow-2xl ${
                theme === "dark" 
                  ? "bg-[#0A0A0A] border-white/10" 
                  : "bg-white border-black/10"
              }`}
            >
              <button 
                onClick={() => setIsSubmitted(false)}
                className="absolute top-8 right-8 opacity-40 hover:opacity-100 transition-opacity"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex justify-center mb-10">
                <div className="relative">
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
                    className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shadow-[0_20px_50px_rgba(16,185,129,0.4)]"
                  >
                    <CheckCircle2 className="w-12 h-12 text-white" />
                  </motion.div>
                  <motion.div
                    animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-full border-2 border-emerald-500/50"
                  />
                  {/* Decorative particles */}
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ 
                        opacity: [0, 1, 0], 
                        scale: [0, 1, 0],
                        x: Math.cos(i * 60 * Math.PI / 180) * 60,
                        y: Math.sin(i * 60 * Math.PI / 180) * 60
                      }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                      className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-emerald-400"
                    />
                  ))}
                </div>
              </div>

              <h3 className="premium-serif text-4xl md:text-5xl mb-6">Thank You!</h3>
              <p className="text-[10px] md:text-[11px] uppercase tracking-[0.4em] leading-relaxed opacity-60 mb-10">
                Your vision has been received.<br />
                Our lead architect will contact you<br />
                within the next 2 hours.
              </p>

              <button
                onClick={() => setIsSubmitted(false)}
                className={`w-full py-5 rounded-full text-[10px] font-bold uppercase tracking-[0.4em] transition-all duration-500 hover:scale-[1.02] ${
                  theme === "dark" ? "bg-white text-black" : "bg-black text-white"
                }`}
              >
                Back to Site
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

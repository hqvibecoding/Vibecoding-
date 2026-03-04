import { motion } from "motion/react";

export default function Hero({ theme = "dark" }: { theme?: "dark" | "light" }) {
  return (
    <section id="home" className="relative h-[100dvh] flex flex-col items-center justify-center px-8 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className={`absolute inset-0 bg-radial-gradient opacity-30 ${
          theme === "dark" ? "from-white/5 to-transparent" : "from-black/5 to-transparent"
        }`} />
      </div>

      <div className="relative z-10 text-center space-y-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 100 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-[10px] uppercase tracking-[1em] opacity-40 mb-6 md:mb-8 block">Premium WebGL Experiences</span>
          <h1 className="premium-serif text-5xl sm:text-7xl md:text-[8rem] lg:text-[10rem] font-light leading-none tracking-tighter">
            Beyond Pixels<span className="italic opacity-50">.</span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[320px] sm:max-w-xl mx-auto text-[10px] md:text-[12px] uppercase tracking-[0.3em] md:tracking-[0.4em] leading-relaxed opacity-60 font-light"
        >
          We build interactive worlds that turn boring 2D products into immersive journeys. 
          Experience the future of the web today.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="pt-12 flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <a 
            href="#contact"
            className={`inline-block px-6 sm:px-10 py-3 sm:py-5 rounded-full text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.3em] transition-all duration-500 hover:scale-105 active:scale-95 shadow-2xl shadow-white/10 ${
              theme === "dark" 
                ? "bg-white text-black hover:bg-zinc-200" 
                : "bg-black text-white hover:bg-zinc-800"
            }`}
          >
            Get Your Free 3D Demo
          </a>
          <a 
            href="#contact"
            className={`inline-block px-6 sm:px-10 py-3 sm:py-5 rounded-full text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.3em] transition-all duration-500 hover:scale-105 active:scale-95 border ${
              theme === "dark" 
                ? "border-white/20 text-white hover:bg-white/5" 
                : "border-black/20 text-black hover:bg-black/5"
            }`}
          >
            Get a Custom 3D Quote
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
      >
        <span className="font-['Manrope'] text-[10px] uppercase tracking-[0.6em] opacity-30">Scroll to Explore</span>
        <div className="relative w-[1px] h-16 overflow-hidden">
          <motion.div 
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className={`absolute inset-0 bg-gradient-to-b from-transparent to-transparent ${
              theme === "dark" ? "via-white/30" : "via-black/30"
            }`}
          />
        </div>
      </motion.div>
    </section>
  );
}

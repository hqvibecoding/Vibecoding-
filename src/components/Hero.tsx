import { motion } from "motion/react";

export default function Hero() {
  return (
    <section className="relative h-screen flex flex-col items-center justify-center px-8 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-radial-gradient from-white/5 to-transparent opacity-30" />
      </div>

      <div className="relative z-10 text-center space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-[10px] uppercase tracking-[1em] opacity-40 mb-6 md:mb-8 block">Est. MMXXIV</span>
          <h1 className="premium-serif text-5xl sm:text-7xl md:text-[12rem] font-light leading-none tracking-tighter">
            Archive<span className="italic opacity-50">.</span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[280px] sm:max-w-md mx-auto text-[10px] md:text-[11px] uppercase tracking-[0.3em] md:tracking-[0.4em] leading-relaxed opacity-40 font-light"
        >
          A curated collection of digital artifacts and interactive 3D experiences.
        </motion.p>
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
            className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-transparent"
          />
        </div>
      </motion.div>
    </section>
  );
}

import { motion } from "motion/react";
import { Zap, Shield, Target } from "lucide-react";

const values = [
  {
    icon: Zap,
    title: "Ultra-Fast Loading",
    text: "Our 3D models load in under 2 seconds. No more waiting, just instant interaction."
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    text: "Built with the latest WebGL standards, ensuring a safe and stable experience on any device."
  },
  {
    icon: Target,
    title: "Conversion Focused",
    text: "We don't just build 3D; we build sales engines. Every pixel is optimized for conversion."
  }
];

export default function UniqueValue({ theme = "dark" }: { theme?: "dark" | "light" }) {
  return (
    <section className="py-20 md:py-40 px-6 md:px-24 overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-20 md:mb-32">
          <motion.span 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-[10px] uppercase tracking-[1em] opacity-40 mb-6 block"
          >
            Our Difference
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="premium-serif text-4xl md:text-7xl font-light"
          >
            Why Choose Us<span className="italic opacity-50">?</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-32">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ 
                opacity: 0, 
                x: i === 0 ? -100 : i === 2 ? 100 : 0,
                y: i === 1 ? 100 : 0 
              }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.5, delay: i * 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6 md:space-y-8"
            >
              <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center border ${
                theme === "dark" ? "border-white/10 bg-white/5" : "border-black/10 bg-black/5"
              }`}>
                <v.icon className={`w-6 h-6 md:w-8 md:h-8 ${theme === "dark" ? "text-white" : "text-black"}`} />
              </div>
              <div className="space-y-3 md:space-y-4">
                <h3 className="text-lg md:text-2xl font-bold uppercase tracking-widest">{v.title}</h3>
                <p className={`text-xs md:text-base font-light leading-relaxed opacity-60 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}>
                  {v.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

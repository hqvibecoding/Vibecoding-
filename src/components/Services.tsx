import { motion } from "motion/react";
import { Box, Globe, BarChart3 } from "lucide-react";

const services = [
  {
    icon: Box,
    title: "Interactive 3D Product Viewers",
    text: "Let your customers rotate, zoom, and 'feel' your products in high-definition 3D directly in their browser."
  },
  {
    icon: Globe,
    title: "Immersive Virtual Tours",
    text: "Walk through real estate or showrooms from anywhere in the world with zero lag."
  },
  {
    icon: BarChart3,
    title: "3D Data Dashboards",
    text: "Turn complex enterprise data into visual, interactive 3D stories that drive decisions."
  }
];

export default function Services({ theme = "dark" }: { theme?: "dark" | "light" }) {
  return (
    <section id="services" className="py-20 md:py-40 px-6 md:px-24 overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-20 md:mb-32">
          <motion.span 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-[10px] uppercase tracking-[1em] opacity-40 mb-6 block"
          >
            What We Do
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="premium-serif text-4xl md:text-7xl font-light"
          >
            Our Services<span className="italic opacity-50">.</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 lg:gap-16">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1.2, delay: i * 0.2, ease: [0.16, 1, 0.3, 1] }}
              className={`p-6 md:p-8 lg:p-10 rounded-3xl border transition-all duration-500 hover:scale-[1.02] flex flex-col h-full ${
                theme === "dark" ? "bg-white/[0.02] border-white/10 hover:bg-white/[0.05]" : "bg-black/[0.02] border-black/10 hover:bg-black/[0.05]"
              }`}
            >
              <div className={`w-12 h-12 md:w-14 lg:w-16 rounded-2xl flex items-center justify-center mb-6 md:mb-8 flex-shrink-0 ${
                theme === "dark" ? "bg-white/10" : "bg-black/10"
              }`}>
                <s.icon className="w-6 h-6 md:w-7 lg:w-8 opacity-60" />
              </div>
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold uppercase tracking-widest mb-4 md:mb-6">{s.title}</h3>
              <p className={`text-xs md:text-sm lg:text-base font-light leading-relaxed opacity-50 flex-grow ${
                theme === "dark" ? "text-white" : "text-black"
              }`}>
                {s.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

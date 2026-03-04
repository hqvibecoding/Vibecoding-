import { motion } from "motion/react";

const testimonials = [
  {
    name: "Sarah Jenkins",
    role: "CEO, LuxFashion",
    text: "The 3D experience boosted our conversion rate by 45%. Customers love interacting with our products before buying.",
    avatar: "https://picsum.photos/seed/sarah/100/100"
  },
  {
    name: "Marcus Thorne",
    role: "Founder, TechCore",
    text: "Vibe Coding transformed our technical specs into a visual masterpiece. It's the best investment we've made this year.",
    avatar: "https://picsum.photos/seed/marcus/100/100"
  },
  {
    name: "Elena Rodriguez",
    role: "Marketing Director, Aura",
    text: "Immersive, fast, and stunning. Our brand perception has reached a whole new level thanks to these WebGL builds.",
    avatar: "https://picsum.photos/seed/elena/100/100"
  }
];

export default function Testimonials({ theme = "dark" }: { theme?: "dark" | "light" }) {
  return (
    <section className="py-20 md:py-40 px-6 md:px-24 overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-20 md:mb-32">
          <motion.span 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-[10px] uppercase tracking-[1em] opacity-40 mb-6 block"
          >
            Testimonials
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="premium-serif text-4xl md:text-7xl font-light"
          >
            What Clients Say<span className="italic opacity-50">.</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-20">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ 
                opacity: 0, 
                y: 50,
                x: i === 0 ? -50 : i === 2 ? 50 : 0 
              }}
              whileInView={{ opacity: 1, y: 0, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, delay: i * 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8"
            >
              <p className={`text-lg md:text-xl font-light leading-relaxed italic ${
                theme === "dark" ? "text-white/80" : "text-black/80"
              }`}>
                "{t.text}"
              </p>
              <div className="flex items-center gap-4">
                <img 
                  src={t.avatar} 
                  alt={t.name} 
                  className="w-12 h-12 rounded-full grayscale"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-widest">{t.name}</h4>
                  <p className="text-[9px] uppercase tracking-widest opacity-40">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

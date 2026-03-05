import Reveal from "./Reveal";
import { Zap, Shield, Target } from "lucide-react";

const values = [
  {
    icon: Zap,
    title: "Ultra-Fast Loading",
    text: "Our 3D models load in under 1 second. No more waiting, just instant interaction."
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
          <Reveal direction="down">
            <span className="text-[10px] uppercase tracking-[1em] opacity-40 mb-6 block">
              Our Difference
            </span>
          </Reveal>
          <Reveal direction="right" delay={0.2}>
            <h2 className="premium-serif text-4xl md:text-7xl font-light">
              Why Choose Us<span className="italic opacity-50">?</span>
            </h2>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-32">
          {values.map((v, i) => (
            <Reveal key={v.title} direction="up" delay={i * 0.2 + 0.4} width="100%">
              <div className="space-y-6 md:space-y-8">
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
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

import Reveal from "./Reveal";

const standards = [
  {
    label: "Zero-Lag 3D Loading",
    value: "<1s",
    description: "Proprietary optimization engine for instant interactivity."
  },
  {
    label: "Mobile Responsive",
    value: "100%",
    description: "Flawless performance on iPhone, Android, and tablets."
  },
  {
    label: "User Engagement",
    value: "4x",
    description: "Higher retention rates compared to traditional 2D websites."
  }
];

export default function Authority({ theme = "dark" }: { theme?: "dark" | "light" }) {
  return (
    <section className="py-20 md:py-40 px-6 md:px-24 relative overflow-hidden">
      {/* Exclusive Beta Notice */}
      <div className="max-w-[1400px] mx-auto mb-32">
        <Reveal direction="none" width="100%">
          <div className={`p-8 md:p-12 rounded-[40px] border text-center relative overflow-hidden ${
            theme === "dark" ? "border-white/10 bg-white/[0.02]" : "border-black/10 bg-black/[0.02]"
          }`}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
            <span className="text-[10px] uppercase tracking-[1em] text-emerald-500 mb-6 block">Exclusive Beta</span>
            <h3 className="premium-serif text-2xl md:text-4xl font-light mb-6">
              Invite-Only Phase
            </h3>
            <p className="max-w-2xl mx-auto text-[11px] md:text-[13px] uppercase tracking-[0.4em] leading-relaxed opacity-60">
              HQ Vibe Coding is currently accepting only <span className={`${theme === "dark" ? "text-white" : "text-black"} font-bold`}>5 high-impact projects</span> this month to ensure 3D perfection for every partner.
            </p>
          </div>
        </Reveal>
      </div>

      {/* Performance Standards */}
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-20">
          <Reveal direction="right">
            <span className="text-[10px] uppercase tracking-[1em] opacity-40 mb-6 block">Authority Proof</span>
          </Reveal>
          <Reveal direction="up" delay={0.2}>
            <h2 className="premium-serif text-4xl md:text-7xl font-light">
              Performance Standards<span className="italic opacity-50">.</span>
            </h2>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
          {standards.map((item, index) => (
            <Reveal key={item.label} direction="up" delay={index * 0.1 + 0.4} width="100%">
              <div
                className={`p-10 rounded-[32px] border transition-all duration-500 hover:scale-[1.02] ${
                  theme === "dark" ? "border-white/5 bg-white/[0.01]" : "border-black/5 bg-black/[0.01]"
                }`}
              >
                <div className="text-4xl md:text-6xl font-light mb-4 premium-serif">{item.value}</div>
                <div className="text-[11px] font-bold uppercase tracking-[0.3em] mb-4 opacity-80">{item.label}</div>
                <p className="text-[10px] uppercase tracking-[0.2em] opacity-40 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

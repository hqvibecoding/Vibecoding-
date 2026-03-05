import Reveal from "./Reveal";

const steps = [
  {
    number: "01",
    title: "Digital Strategy & Optimization",
    description: "Understanding brand DNA to create a tailored 3D roadmap that aligns with your business goals.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  },
  {
    number: "02",
    title: "Immersive 3D Sculpting",
    description: "Building high-fidelity WebGL models with meticulous attention to detail and artistic precision.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    )
  },
  {
    number: "03",
    title: "Seamless Integration",
    description: "Deploying interactive experiences that load in under 1 second and work flawlessly across all devices.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  }
];

export default function Process({ theme = "dark" }: { theme?: "dark" | "light" }) {
  return (
    <section className="py-20 md:py-40 px-6 md:px-24 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-20 md:mb-32">
          <Reveal direction="right">
            <span className="text-[10px] uppercase tracking-[1em] opacity-40 mb-6 block">Our Methodology</span>
          </Reveal>
          <Reveal direction="up" delay={0.2}>
            <h2 className="premium-serif text-4xl md:text-7xl font-light">
              The 3D Process<span className="italic opacity-50">.</span>
            </h2>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 md:gap-24">
          {steps.map((step, index) => (
            <Reveal key={step.number} direction="up" delay={index * 0.2 + 0.4} width="100%">
              <div className="relative group">
                <div className="mb-12 flex items-center justify-between">
                  <span className={`text-6xl md:text-8xl font-light opacity-10 premium-serif group-hover:opacity-20 transition-opacity duration-700 ${
                    theme === "dark" ? "text-white" : "text-black"
                  }`}>
                    {step.number}
                  </span>
                  <div className={`p-4 rounded-2xl border transition-all duration-700 ${
                    theme === "dark" ? "border-white/10 bg-white/5" : "border-black/10 bg-black/5"
                  }`}>
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-xl md:text-2xl font-light mb-6 tracking-tight">{step.title}</h3>
                <p className="text-[11px] md:text-[13px] uppercase tracking-[0.3em] leading-relaxed opacity-40">
                  {step.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

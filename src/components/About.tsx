import Reveal from "./Reveal";

export default function About({ theme = "dark" }: { theme?: "dark" | "light" }) {
  return (
    <section id="about" className="py-20 md:py-40 px-6 md:px-24 overflow-hidden">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32 items-center">
        <div>
          <Reveal direction="right">
            <span className="text-[10px] uppercase tracking-[1em] opacity-40 mb-6 block">The Story of HQ Vibe Coding</span>
          </Reveal>
          <Reveal direction="up" delay={0.2}>
            <h2 className="premium-serif text-4xl md:text-7xl font-light leading-tight">
              Beyond Pixels.<br />
              We Build Interactive Worlds<span className="italic opacity-50">.</span>
            </h2>
          </Reveal>
        </div>

        <div className="space-y-8">
          <Reveal direction="left" delay={0.4}>
            <p className={`text-lg md:text-xl font-light leading-relaxed opacity-70 ${
              theme === "dark" ? "text-white" : "text-black"
            }`}>
              HQ Vibe Coding was born out of a simple frustration: The web felt flat. 
              We believe that in 2026, a website shouldn't just be read—it should be experienced.
            </p>
          </Reveal>
          <Reveal direction="left" delay={0.6}>
            <p className={`text-lg md:text-xl font-light leading-relaxed opacity-70 ${
              theme === "dark" ? "text-white" : "text-black"
            }`}>
              We specialize in high-performance 3D WebGL solutions that turn boring 2D products into immersive interactive journeys. 
              From India to the world, we are here to ensure your brand doesn't just exist online; it vibrates with life.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

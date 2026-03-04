import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "Will 3D models slow down my website?",
    answer: "Absolutely not. We utilize optimized WebGL and advanced Lazy Loading techniques to ensure your website loads in under 2 seconds. We never compromise on performance."
  },
  {
    question: "Will the 3D experience run smoothly on mobile devices?",
    answer: "Yes, our websites are 100% responsive. We rigorously test every project on both iOS and Android to ensure a seamless touch-interactive experience for every user."
  },
  {
    question: "What is the typical budget for a 3D website?",
    answer: "Every brand has unique requirements. Our pricing is built on transparency—we focus on delivering features that drive Business ROI. After a demo, we provide a custom quote with no hidden charges."
  },
  {
    question: "Why should I choose 3D over a traditional 2D website?",
    answer: "Because traditional 2D is becoming obsolete. 3D experiences increase user engagement by up to 4x. If you want visitors to stay longer and convert, immersive 3D is the definitive solution."
  },
  {
    question: "Are your websites optimized for AI Search and SEO?",
    answer: "Yes, our codebase is clean and minimal, optimized for both traditional search engines and AI-driven discovery tools. We build future-ready technology to ensure your brand stands out at the top."
  }
];

function FAQItem({ question, answer, theme = "dark" }: { question: string, answer: string, theme?: "dark" | "light" }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`border-b transition-colors duration-700 ${
      theme === "dark" ? "border-white/10" : "border-black/10"
    }`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 md:py-12 flex justify-between items-center text-left group"
      >
        <span className={`text-lg md:text-3xl font-light premium-serif transition-opacity duration-500 ${
          isOpen ? "opacity-100" : "opacity-50 group-hover:opacity-100"
        }`}>
          {question}
        </span>
        <div className={`p-2 rounded-full border transition-all duration-500 ${
          theme === "dark" ? "border-white/10 group-hover:bg-white/5" : "border-black/10 group-hover:bg-black/5"
        }`}>
          {isOpen ? <Minus className="w-3 h-3 md:w-4 md:h-4 opacity-40" /> : <Plus className="w-3 h-3 md:w-4 md:h-4 opacity-40" />}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className={`pb-8 md:pb-12 text-sm md:text-xl font-light leading-relaxed opacity-90 ${
              theme === "dark" ? "text-white" : "text-black"
            }`}>
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ({ theme = "dark" }: { theme?: "dark" | "light" }) {
  return (
    <section id="faq" className="py-20 md:py-40 px-6 md:px-24 overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-20 md:mb-32">
          <motion.span 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-[10px] uppercase tracking-[1em] opacity-40 mb-6 block"
          >
            The Trust-Builder
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="premium-serif text-4xl md:text-7xl font-light"
          >
            Common Questions<span className="italic opacity-50">.</span>
          </motion.h2>
        </div>

        <div className="max-w-4xl">
          {faqs.map((faq) => (
            <FAQItem key={faq.question} {...faq} theme={theme} />
          ))}
        </div>
      </div>
    </section>
  );
}

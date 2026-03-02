import { motion, AnimatePresence } from "motion/react";
import { ArchiveItem } from "../types";
import { useGLTF } from "@react-three/drei";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Loader2 } from "lucide-react";

interface ArchiveGridProps {
  items: ArchiveItem[];
  onItemClick: (item: ArchiveItem) => void;
  theme?: "dark" | "light";
}

// Draco decoder path (using a CDN)
const DRACO_URL = "https://www.gstatic.com/draco/versioned/decoders/1.5.5/";

function GridItem({ item, index, onClick, theme = "dark" }: { item: ArchiveItem, index: number, onClick: (item: ArchiveItem) => void, theme?: "dark" | "light" }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '200px 0px',
  });

  useEffect(() => {
    if (inView && item.modelUrl) {
      useGLTF.preload(item.modelUrl, DRACO_URL);
    }
  }, [inView, item.modelUrl]);

  // Helper to get optimized Cloudinary URL
  const getOptimizedUrl = (url: string) => {
    if (!url.includes("cloudinary.com")) return url;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const width = isMobile ? 600 : 1200;
    return url.replace("/upload/", `/upload/f_auto,q_auto:best,w_${width},c_limit/`);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 1.5, 
        ease: [0.215, 0.61, 0.355, 1],
        delay: (index % 2) * 0.2 
      }}
      onClick={() => onClick(item)}
      onMouseEnter={() => {
        if (item.modelUrl) {
          useGLTF.preload(item.modelUrl, DRACO_URL);
        }
      }}
      className="group cursor-pointer"
    >
      <div className={`relative aspect-[3/4] overflow-hidden border transition-colors duration-700 ${
        theme === "dark" ? "bg-[#0a0a0a] border-white/5" : "bg-[#f0f0f0] border-black/5"
      }`}>
        <AnimatePresence>
          {!isLoaded && (
            <motion.div 
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`absolute inset-0 flex items-center justify-center z-10 ${
                theme === "dark" ? "bg-[#0a0a0a]" : "bg-[#f0f0f0]"
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <Loader2 className={`w-4 h-4 animate-spin opacity-10 ${theme === "dark" ? "text-white" : "text-black"}`} />
                <span className={`text-[8px] uppercase tracking-[0.3em] opacity-10 ${theme === "dark" ? "text-white" : "text-black"}`}>Loading HD</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <img
          src={getOptimizedUrl(item.thumbnailUrl)}
          alt={item.title}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-[2000ms] ease-[0.16,1,0.3,1] group-hover:scale-105 ${
            isLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-lg'
          }`}
          referrerPolicy="no-referrer"
        />
        <div className={`absolute inset-0 transition-colors duration-1000 ${
          theme === "dark" ? "bg-black/40 group-hover:bg-black/0" : "bg-white/20 group-hover:bg-white/0"
        }`} />
      </div>
      <div className="mt-6 md:mt-12 space-y-3 md:space-y-4">
        <div className="flex justify-between items-baseline">
          <h3 className="premium-serif text-2xl md:text-4xl font-light tracking-tight">{item.title}</h3>
          <span className="text-[8px] md:text-[9px] uppercase tracking-[0.4em] opacity-20">№ {item.id.slice(-4)}</span>
        </div>
        <div className={`h-px w-full scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 origin-left ${
          theme === "dark" ? "bg-white/5" : "bg-black/5"
        }`} />
        <div className="flex justify-between items-center">
          <p className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] opacity-30">Interactive Archive</p>
          <span className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-opacity duration-500">Explore Asset</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function ArchiveGrid({ items, onItemClick, theme = "dark" }: ArchiveGridProps) {
  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-40 lg:gap-64">
        {items.map((item, index) => (
          <GridItem key={item.id} item={item} index={index} onClick={onItemClick} theme={theme} />
        ))}
      </div>
    </div>
  );
}


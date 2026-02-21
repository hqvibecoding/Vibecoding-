import { motion } from "motion/react";
import { ArchiveItem } from "../types";
import { useGLTF } from "@react-three/drei";

interface ArchiveGridProps {
  items: ArchiveItem[];
  onItemClick: (item: ArchiveItem) => void;
}

// Draco decoder path (using a CDN)
const DRACO_URL = "https://www.gstatic.com/draco/versioned/decoders/1.5.5/";

export default function ArchiveGrid({ items, onItemClick }: ArchiveGridProps) {
  const handleMouseEnter = (url: string) => {
    // Preload model on hover for faster opening with Draco support
    if (url) useGLTF.preload(url, DRACO_URL);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-40 lg:gap-64">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ 
              duration: 1.5, 
              ease: [0.215, 0.61, 0.355, 1], // Cinematic cubic-bezier
              delay: (index % 2) * 0.2 // Stagger effect
            }}
            onClick={() => onItemClick(item)}
            onMouseEnter={() => handleMouseEnter(item.modelUrl)}
            className="group cursor-pointer"
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-[#0a0a0a] border border-white/5">
              <img
                src={item.thumbnailUrl}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-[2000ms] ease-[0.16,1,0.3,1] group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/0 transition-colors duration-1000" />
            </div>
            <div className="mt-6 md:mt-12 space-y-3 md:space-y-4">
              <div className="flex justify-between items-baseline">
                <h3 className="premium-serif text-2xl md:text-4xl font-light tracking-tight">{item.title}</h3>
                <span className="text-[8px] md:text-[9px] uppercase tracking-[0.4em] opacity-20">№ {item.id.slice(-4)}</span>
              </div>
              <div className="h-px w-full bg-white/5 scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 origin-left" />
              <div className="flex justify-between items-center">
                <p className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] opacity-30">Interactive Archive</p>
                <span className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-opacity duration-500">Explore Asset</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}


import { useState, useEffect } from "react";
import { onValue, ref } from "firebase/database";
import { db } from "./firebase";
import { ArchiveItem } from "./types";
import Hero from "./components/Hero";
import ArchiveGrid from "./components/ArchiveGrid";
import ModelViewer from "./components/ModelViewer";
import AdminLogin from "./components/AdminLogin";
import AdminPanel from "./components/AdminPanel";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { motion, AnimatePresence } from "motion/react";
import Lenis from "lenis";

export default function App() {
  const [items, setItems] = useState<ArchiveItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ArchiveItem | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  useEffect(() => {
    // Just check if they were logged in, but don't auto-open the panel
    const isAuth = localStorage.getItem("vault_auth") === "true";
    
    const itemsRef = ref(db, "archive");
    const unsubscribe = onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const itemList = Object.values(data) as ArchiveItem[];
        // Randomize order on every refresh for a dynamic feel
        const shuffled = itemList.sort(() => Math.random() - 0.5);
        setItems(shuffled);
      } else {
        setItems([]);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Secret Backdoor: Ctrl + Shift + A opens login
      if (e.ctrlKey && e.shiftKey && e.key === "A") {
        setIsLoginOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <main className="min-h-screen bg-[#050505] text-[#F5F5F5] selection:bg-white selection:text-black">
      <div className="noise-overlay" />
      {!selectedItem && <Header />}
      
      <Hero />
      
      {isLoading ? (
        <div className="flex items-center justify-center py-64">
          <div className="w-12 h-12 border border-white/10 border-t-white rounded-full animate-spin" />
        </div>
      ) : (
        <div className="py-20 md:py-40">
          <ArchiveGrid items={items} onItemClick={setSelectedItem} />
        </div>
      )}

      <AnimatePresence mode="wait">
        {selectedItem && (
          <ModelViewer 
            key={selectedItem.id}
            item={{
              ...selectedItem,
              // Add cache buster to ensure instant opening of fresh uploads
              modelUrl: `${selectedItem.modelUrl}${selectedItem.modelUrl.includes('?') ? '&' : '?'}t=${Date.now()}`
            }} 
            onClose={() => setSelectedItem(null)} 
          />
        )}
      </AnimatePresence>

      <AdminLogin 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
        onLoginSuccess={() => setIsAdminOpen(true)} 
      />

      <AdminPanel 
        isOpen={isAdminOpen} 
        onClose={() => setIsAdminOpen(false)} 
        items={items}
      />

      {!selectedItem && <Footer onAdminClick={() => setIsLoginOpen(true)} />}
    </main>
  );
}

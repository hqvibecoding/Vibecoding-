import { useState, useEffect, lazy, Suspense } from "react";
import { onValue, ref } from "firebase/database";
import { db } from "./firebase";
import { ArchiveItem } from "./types";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import SceneBackground from "./components/SceneBackground";
import ErrorBoundary from "./components/ErrorBoundary";
import { motion, AnimatePresence, useScroll } from "motion/react";
import Lenis from "lenis";

// Lazy Loaded Components for Performance
const About = lazy(() => import("./components/About"));
const Services = lazy(() => import("./components/Services"));
const ArchiveGrid = lazy(() => import("./components/ArchiveGrid"));
const UniqueValue = lazy(() => import("./components/UniqueValue"));
const Process = lazy(() => import("./components/Process"));
const Authority = lazy(() => import("./components/Authority"));
const FAQ = lazy(() => import("./components/FAQ"));
const Contact = lazy(() => import("./components/Contact"));
const ModelViewer = lazy(() => import("./components/ModelViewer"));
const AdminLogin = lazy(() => import("./components/AdminLogin"));
const AdminPanel = lazy(() => import("./components/AdminPanel"));
const LegalOverlay = lazy(() => import("./components/LegalOverlay"));

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}

function AppContent() {
  const [items, setItems] = useState<ArchiveItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ArchiveItem | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [legalType, setLegalType] = useState<"privacy" | "terms" | "cookies" | null>(null);

  const { scrollYProgress: scrollProgress } = useScroll();

  const toggleTheme = () => {
    setTheme(prev => prev === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    // Scroll to top on refresh to prevent layout shifts
    window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      autoResize: true,
    });

    // Force a refresh after a short delay to ensure correct height calculation on mobile
    setTimeout(() => {
      lenis.resize();
      window.dispatchEvent(new Event('resize'));
    }, 500);

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
    <main className={`relative min-h-[100dvh] transition-colors duration-700 selection:bg-white selection:text-black ${
      theme === "dark" ? "bg-[#050505] text-[#F5F5F5]" : "bg-[#F5F5F5] text-[#050505]"
    }`}>
      <motion.div 
        className={`fixed top-0 left-0 right-0 h-1 z-[200] origin-left ${
          theme === "dark" ? "bg-white" : "bg-black"
        }`}
        style={{ scaleX: scrollProgress }}
      />
      <SceneBackground theme={theme} />
      <div className="noise-overlay" />
      
      <div className="relative z-10">
        {!selectedItem && <Header theme={theme} onThemeToggle={toggleTheme} />}
        
        <Hero theme={theme} />
        
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center py-64 gap-8">
            <div className={`w-12 h-12 border border-current border-t-transparent rounded-full animate-spin opacity-20`} />
            <p className="text-[10px] uppercase tracking-[0.4em] opacity-40 animate-pulse">
              Calibrating 3D Environment...
            </p>
          </div>
        }>
          <About theme={theme} />
          <Services theme={theme} />
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-64 gap-8">
              <div className={`w-12 h-12 border border-current border-t-transparent rounded-full animate-spin opacity-20`} />
              <p className="text-[10px] uppercase tracking-[0.4em] opacity-40 animate-pulse">
                Calibrating 3D Environment... Experience is loading in under 1 second.
              </p>
            </div>
          ) : (
            <div id="portfolio" className="py-20 md:py-40">
              <ArchiveGrid items={items} onItemClick={setSelectedItem} theme={theme} />
            </div>
          )}

          <UniqueValue theme={theme} />
          <Process theme={theme} />
          <Authority theme={theme} />
          <FAQ theme={theme} />
          <Contact theme={theme} />
        </Suspense>
      </div>

      <Suspense fallback={null}>
        <AnimatePresence mode="wait">
          {selectedItem && (
            <ModelViewer 
              key={selectedItem.id}
              theme={theme}
              item={selectedItem} 
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

        <LegalOverlay 
          isOpen={!!legalType} 
          onClose={() => setLegalType(null)} 
          type={legalType} 
          theme={theme} 
        />
      </Suspense>

      {!selectedItem && <div className="relative z-10"><Footer onAdminClick={() => setIsLoginOpen(true)} onLegalClick={setLegalType} theme={theme} /></div>}

      {/* Floating WhatsApp CTA */}
      <motion.a
        href="https://wa.me/917411041972"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, type: "spring", stiffness: 260, damping: 20 }}
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-[100] p-3 sm:p-4 rounded-full shadow-[0_10px_30px_rgba(37,211,102,0.4)] transition-transform hover:scale-110 active:scale-95 bg-[#25D366] text-white"
      >
        <svg className="w-6 h-6 sm:w-7 sm:h-7 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.438 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884 0 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
      </motion.a>

      {/* Back to Top */}
      <motion.button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        initial={{ opacity: 0 }}
        animate={{ opacity: scrollProgress.get() > 0.2 ? 1 : 0 }}
        className={`fixed bottom-6 left-6 sm:bottom-8 sm:left-8 z-[100] p-3 sm:p-4 rounded-full border backdrop-blur-md transition-all hover:scale-110 active:scale-95 ${
          theme === "dark" ? "border-white/10 bg-white/5 text-white" : "border-black/10 bg-black/5 text-black"
        }`}
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </motion.button>
    </main>
  );
}

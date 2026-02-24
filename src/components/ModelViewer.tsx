import { Suspense, useMemo, useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF, ContactShadows, Environment, Center, AdaptiveDpr, AdaptiveEvents, useProgress } from "@react-three/drei";
import { motion } from "motion/react";
import { X, Loader2, AlertCircle } from "lucide-react";
import { ArchiveItem } from "../types";
import ErrorBoundary from "./ErrorBoundary";

// Draco decoder path (using a CDN)
const DRACO_URL = "https://www.gstatic.com/draco/versioned/decoders/1.5.5/";

function Model({ url }: { url: string }) {
  // useGLTF with Draco support
  const { scene } = useGLTF(url, DRACO_URL);
  const [visible, setVisible] = useState(false);
  
  // Clean up and optimize the scene
  useMemo(() => {
    scene.traverse((obj: any) => {
      if (obj.isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
        if (obj.material) {
          obj.material.precision = 'mediump';
        }
      }
    });
  }, [scene]);

  useEffect(() => {
    // Small delay for smooth reveal after suspense resolves
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <primitive 
      object={scene} 
      scale={visible ? 1 : 0} 
      visible={visible}
      onUpdate={(self: any) => {
        if (visible && self.scale.x < 1) {
          self.scale.lerp({ x: 1, y: 1, z: 1 }, 0.1);
        }
      }}
    />
  );
}

function Loader() {
  const { progress } = useProgress();
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-2xl z-[55]">
      <div className="flex flex-col items-center gap-8">
        <div className="relative w-20 h-20">
          <Loader2 className="w-20 h-20 text-white animate-spin opacity-10" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[10px] font-mono tracking-widest opacity-60">{Math.round(progress)}%</span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-col items-center gap-1">
            <p className="text-[10px] uppercase tracking-[0.6em] opacity-40 animate-pulse">Synchronizing Archive</p>
            <p className="text-[8px] uppercase tracking-[0.4em] opacity-20">Decrypting 3D Artifact</p>
          </div>
          <div className="w-48 h-[1px] bg-white/5 overflow-hidden rounded-full">
            <motion.div 
              className="h-full bg-white/40 shadow-[0_0_10px_rgba(255,255,255,0.3)]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 50, damping: 20 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ErrorFallback({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black z-[55] p-10 text-center">
      <div className="flex flex-col items-center gap-6 max-w-xs">
        <AlertCircle className="w-12 h-12 text-red-500/50" />
        <div>
          <h2 className="premium-serif text-2xl font-light mb-2">Archive Error</h2>
          <p className="text-[10px] uppercase tracking-[0.2em] opacity-40 leading-relaxed">
            This asset could not be loaded. It might be too large for your device or the file is corrupted.
          </p>
        </div>
        <button 
          onClick={onClose}
          className="px-8 py-3 border border-white/10 rounded-full text-[10px] uppercase tracking-widest hover:bg-white/5 transition-colors"
        >
          Return to Vault
        </button>
      </div>
    </div>
  );
}

interface ModelViewerProps {
  item: ArchiveItem;
  onClose: () => void;
}

export default function ModelViewer({ item, onClose }: ModelViewerProps) {
  const [isIdle, setIsIdle] = useState(false);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  const resetIdleTimer = () => {
    setIsIdle(false);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => setIsIdle(true), 15000); // 15s idle for aggressive heat management
  };

  useEffect(() => {
    resetIdleTimer();
    const events = ["mousemove", "touchstart", "mousedown", "keydown"];
    events.forEach(event => window.addEventListener(event, resetIdleTimer));
    
    return () => {
      events.forEach(event => window.removeEventListener(event, resetIdleTimer));
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black flex flex-col"
    >
      <div className="absolute top-6 right-6 md:top-8 md:right-8 z-[60]">
        <button
          onClick={onClose}
          className="p-3 md:p-4 rounded-full border border-white/10 bg-black/50 backdrop-blur-md md:bg-transparent hover:bg-white/10 transition-colors group"
        >
          <X className="w-5 h-5 md:w-6 md:h-6 text-white opacity-50 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>

      <div className="absolute top-6 left-6 md:top-8 md:left-8 z-[60] pointer-events-none max-w-[70%]">
        <h2 className="premium-serif text-xl md:text-3xl font-light tracking-tight leading-tight">{item.title}</h2>
        <p className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] opacity-40 mt-1 md:mt-2">Interactive 3D Asset</p>
      </div>

      <div className="flex-1 w-full h-full relative">
        <ErrorBoundary fallback={<ErrorFallback onClose={onClose} />}>
          <Canvas 
            shadows 
            dpr={[1, 2]} // High resolution for Retina displays, but capped at 2
            camera={{ position: [0, 0, 4], fov: 45 }}
            performance={{ min: 0.5 }} // Allow dropping quality to maintain 60fps
            gl={{ 
              antialias: true,
              powerPreference: "high-performance",
              stencil: false,
              depth: true,
              alpha: true,
              precision: 'lowp', // Lower precision for materials to boost FPS on mobile
              failIfMajorPerformanceCaveat: false
            }}
          >
            <Suspense fallback={null}>
              <Environment preset="city" resolution={128} />
              <Stage intensity={0.6} adjustCamera={true} environment="city">
                <Center>
                  <Model url={item.modelUrl} />
                </Center>
              </Stage>
              <ContactShadows 
                opacity={0.4} 
                blur={2} 
                far={10} 
                resolution={256} // Lower resolution for better performance
                frames={1} // Only render once for static models to save GPU
              />
              <OrbitControls 
                autoRotate={!isIdle} 
                autoRotateSpeed={0.5} 
                enablePan={false} 
                enableDamping={true}
                dampingFactor={0.05}
                minPolarAngle={0} 
                maxPolarAngle={Math.PI / 1.75} 
                makeDefault
              />
              <AdaptiveDpr pixelated />
              <AdaptiveEvents />
            </Suspense>
          </Canvas>
          
          {isIdle && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-[58] pointer-events-none">
              <p className="text-[10px] uppercase tracking-[0.5em] opacity-40">Power Saving Mode Active</p>
            </div>
          )}
          
          {/* Overlay Loader that stays until Suspense resolves */}
          <Suspense fallback={<Loader />}>
            <ModelPreloader url={item.modelUrl} />
          </Suspense>
        </ErrorBoundary>
      </div>

      <div className="absolute bottom-10 md:bottom-12 left-1/2 -translate-x-1/2 text-center pointer-events-none">
        <p className="text-[10px] uppercase tracking-[0.5em] opacity-20">Rotate to Explore</p>
      </div>
    </motion.div>
  );
}

// Helper component to trigger Suspense outside the Canvas for the Loader
function ModelPreloader({ url }: { url: string }) {
  useGLTF(url, DRACO_URL);
  return null;
}


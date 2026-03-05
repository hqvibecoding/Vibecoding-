import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere } from "@react-three/drei";
import { useRef, useEffect, useState } from "react";
import * as THREE from "three";

export default function SceneBackground({ theme = "dark" }: { theme?: "dark" | "light" }) {
  const [isMobile, setIsMobile] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
    };
    checkMobile();
    
    // Use ResizeObserver for more robust sizing
    const observer = new ResizeObserver(() => {
      checkMobile();
      window.dispatchEvent(new Event('resize'));
    });
    observer.observe(document.body);
    
    // Force layout recalculation to prevent horizontal shift on mobile
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none opacity-85 overflow-hidden max-w-[100vw]">
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 75 }}
        dpr={[1, Math.min(1.5, window.devicePixelRatio)]}
        gl={{ 
          antialias: false, 
          powerPreference: "high-performance",
          alpha: true,
          stencil: false,
          depth: true,
          precision: 'lowp'
        }}
      >
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <pointLight position={[-10, -10, -10]} intensity={1} color={theme === "dark" ? "#ffffff" : "#000000"} />
        <BackgroundShape meshRef={meshRef} mouse={mouse} theme={theme} isMobile={isMobile} />
      </Canvas>
    </div>
  );
}

function BackgroundShape({ meshRef, mouse, theme, isMobile }: { meshRef: any, mouse: any, theme: string, isMobile: boolean }) {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, mouse.current.y * 0.5, 0.1);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, mouse.current.x * 0.5, 0.1);
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, mouse.current.x * 0.5, 0.1);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, mouse.current.y * 0.5, 0.1);
    }
    if (lightRef.current) {
      lightRef.current.position.x = THREE.MathUtils.lerp(lightRef.current.position.x, mouse.current.x * 5, 0.1);
      lightRef.current.position.y = THREE.MathUtils.lerp(lightRef.current.position.y, mouse.current.y * 5, 0.1);
    }
  });

  return (
    <>
      <pointLight ref={lightRef} intensity={2} color={theme === "dark" ? "#ffffff" : "#000000"} />
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={meshRef} args={[1, isMobile ? 16 : 48, isMobile ? 16 : 48]} scale={isMobile ? 3 : 3.5}>
        <MeshDistortMaterial
          color={theme === "dark" ? "#ffffff" : "#000000"}
          speed={3}
          distort={0.4}
          radius={1}
          opacity={theme === "dark" ? 0.12 : 0.08}
          transparent
          wireframe
        />
      </Sphere>
      {/* Secondary Glow Sphere */}
      <Sphere args={[1, isMobile ? 16 : 32, isMobile ? 16 : 32]} scale={isMobile ? 4.5 : 5.5}>
        <meshBasicMaterial
          color={theme === "dark" ? "#ffffff" : "#000000"}
          transparent
          opacity={theme === "dark" ? 0.03 : 0.02}
          wireframe
        />
      </Sphere>
    </Float>
    </>
  );
}

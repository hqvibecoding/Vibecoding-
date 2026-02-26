import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase";
import { Moon, Sun } from "lucide-react";

interface HeaderProps {
  theme?: "dark" | "light";
  onThemeToggle?: () => void;
}

export default function Header({ theme = "dark", onThemeToggle }: HeaderProps) {
  const [profilePic, setProfilePic] = useState<string>("https://picsum.photos/seed/vibe/100/100");

  useEffect(() => {
    const profileRef = ref(db, "settings/profilePic");
    return onValue(profileRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.url) setProfilePic(data.url);
      else setProfilePic("https://picsum.photos/seed/vibe/100/100");
    });
  }, []);

  const getOptimizedUrl = (url: string) => {
    if (!url.includes("cloudinary.com")) return url;
    return url.replace("/upload/", "/upload/f_auto,q_auto:best,w_200,c_limit/");
  };

  return (
    <header className="fixed top-0 left-0 w-full z-[100] px-6 md:px-12 py-6 md:py-8 flex justify-between items-center pointer-events-none">
      <div className="pointer-events-auto">
        <span className={`font-['Italiana'] text-lg md:text-2xl tracking-[0.3em] md:tracking-[0.4em] uppercase mix-blend-difference ${
          theme === "dark" ? "text-white" : "text-black"
        }`}>
          Vibe Coding
        </span>
      </div>
      
      <div className="flex items-center gap-4 md:gap-6 pointer-events-auto">
        <button
          onClick={onThemeToggle}
          className={`p-2 rounded-full border transition-all duration-500 ${
            theme === "dark" 
              ? "border-white/10 bg-white/5 hover:bg-white/10 text-white" 
              : "border-black/10 bg-black/5 hover:bg-black/10 text-black"
          }`}
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <a 
          href="https://www.linkedin.com/in/james-jeetendra-a1856a3a5?utm_source=share_via&utm_content=profile&utm_medium=member_android" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="hover:scale-110 transition-transform duration-500"
        >
          <svg className="w-6 h-6 fill-[#0077B5]" viewBox="0 0 24 24">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
          </svg>
        </a>

        <a 
          href="https://x.com/hqvibecoding" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="hover:scale-110 transition-transform duration-500"
        >
          <svg className={`w-5 h-5 ${theme === "dark" ? "fill-white" : "fill-black"}`} viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>
        <div className={`w-9 h-9 rounded-full border overflow-hidden shadow-lg shadow-black/50 ${
          theme === "dark" ? "border-white/20" : "border-black/20"
        }`}>
          <img 
            src={getOptimizedUrl(profilePic)} 
            alt="Profile" 
            className="w-full h-full object-cover" 
          />
        </div>
      </div>
    </header>
  );
}

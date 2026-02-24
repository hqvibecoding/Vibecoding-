import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Eye, EyeOff, X, Loader2 } from "lucide-react";

interface AdminLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export default function AdminLogin({ isOpen, onClose, onLoginSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (email.trim() === "jamesjames00741@gmail.com" && password === "James Bond 27") {
        localStorage.setItem("vault_auth", "true");
        onLoginSuccess();
        onClose();
      } else {
        setError("Invalid credentials");
      }
    } catch (err: any) {
      setError("Login Failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-zinc-950 border border-white/10 p-8 md:p-10 rounded-2xl shadow-2xl"
          >
            <button onClick={onClose} className="absolute top-6 right-6 opacity-40 hover:opacity-100 transition-opacity">
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-8 md:mb-10">
              <h2 className="premium-serif text-2xl md:text-3xl font-light mb-2">VAULT</h2>
              <p className="text-[10px] md:text-xs uppercase tracking-widest opacity-40">Admin Access</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-1">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/5 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-white/20 transition-colors"
                  required
                />
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/5 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-white/20 transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-100 transition-opacity"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {error && <p className="text-red-500 text-[10px] uppercase tracking-widest text-center">{error}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-white text-black py-3 rounded-lg text-sm font-semibold uppercase tracking-widest hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enter Vault"}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

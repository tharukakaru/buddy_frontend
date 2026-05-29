import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { User, GraduationCap } from "lucide-react";
import jftLogo from "@/assets/jft-logo.png";

interface SiteNavProps {
  variant?: "light" | "dark";
  mode?: "default" | "pill";
}

export function SiteNav({ variant = "dark", mode = "default" }: SiteNavProps) {
  const nav = useNavigate();
  const [auth, setAuth] = useState<{ loggedIn: boolean; role: string | null }>({ loggedIn: false, role: null });

  useEffect(() => {
    const read = () => {
      const loggedIn = sessionStorage.getItem("buddy_fake_auth") === "1";
      const role = sessionStorage.getItem("buddy_role");
      setAuth({ loggedIn, role });
    };
    read();
    window.addEventListener("storage", read);
    return () => window.removeEventListener("storage", read);
  }, []);

  const goCourses = () => {
    nav({ to: auth.loggedIn ? "/courses" : "/login" });
  };

  const goProfile = () => {
    nav({ to: auth.role === "teacher" ? "/teacher" : "/profile" });
  };

  if (mode === "pill") {
    const isDarkBg = variant === "light";
    return (
      <header className="fixed top-0 left-0 right-0 z-50">
        {/* CHANGED: pt-5 md:pt-7 → pt-2 md:pt-3 to push navbar higher */}
        <div className="mx-auto max-w-[860px] px-4 pt-2 md:pt-3">
          <nav
            className="nav-glow relative mx-auto flex h-11 md:h-13 items-center justify-between rounded-full px-5 md:px-8 shadow-[0_8px_32px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.15)] border"
            style={{
              background: isDarkBg
                ? "linear-gradient(135deg, rgba(0,0,0,0.55), rgba(0,0,0,0.45))"
                : "linear-gradient(135deg, rgba(0,0,0,0.55), rgba(0,0,0,0.45))",
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
              borderColor: isDarkBg ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.12)",
            }}
          >
            <div className="flex items-center gap-5 md:gap-8">
              <Link to="/about" className="font-display text-[8px] md:text-[10px] tracking-[0.2em] uppercase font-medium text-white/80 hover:text-white transition-colors">
                About Us
              </Link>
              <Link to="/jtf" className="font-display text-[8px] md:text-[10px] tracking-[0.2em] uppercase font-medium text-white/80 hover:text-white transition-colors">
                JFT
              </Link>
            </div>
            <Link
              to="/"
              className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 font-display text-[8px] md:text-[10px] tracking-[0.25em] uppercase font-semibold text-white whitespace-nowrap"
            >
              <img src={jftLogo} alt="" className="h-5 md:h-6 w-auto drop-shadow-sm" />
              <span>Tissa Jinasena Group</span>
            </Link>
            <div className="flex items-center gap-3 md:gap-4">
              <button onClick={goCourses} className="font-display text-[8px] md:text-[10px] tracking-[0.2em] uppercase font-medium text-white/80 hover:text-white transition-colors">
                Courses
              </button>
              {auth.loggedIn && (
                <button onClick={goProfile} aria-label="Account" className="w-7 h-7 rounded-full bg-white/15 text-white flex items-center justify-center hover:bg-white/25 transition-colors">
                  {auth.role === "teacher" ? <GraduationCap className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>
          </nav>
        </div>
      </header>
    );
  }

  const textColor = variant === "light" ? "text-white" : "text-foreground";
  const linkCls = `text-[11px] tracking-display uppercase ${textColor} hover:text-accent transition-colors`;
  const iconBtn =
    variant === "light"
      ? "w-9 h-9 rounded-full bg-white text-foreground flex items-center justify-center hover:bg-accent transition-colors"
      : "w-9 h-9 rounded-full bg-foreground text-background flex items-center justify-center hover:bg-accent hover:text-foreground transition-colors";

  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12 py-6 flex items-center justify-between">
        <nav className="flex items-center gap-8">
          <Link to="/about" className={linkCls}>About Us</Link>
          <Link to="/foundation" className={linkCls}>JFT</Link>
        </nav>
        <Link
          to="/"
          className={`font-serif text-[13px] md:text-[15px] tracking-[0.35em] uppercase whitespace-nowrap ${textColor}`}
        >
          Tissa Jinasena Group
        </Link>
        <nav className="flex items-center gap-6 justify-end">
          <button onClick={goCourses} className={linkCls}>Courses</button>
          {auth.loggedIn && (
            <button onClick={goProfile} aria-label="Account" className={iconBtn}>
              {auth.role === "teacher" ? <GraduationCap className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

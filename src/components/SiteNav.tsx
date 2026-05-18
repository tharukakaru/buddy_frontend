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
    return (
      <header className="absolute top-0 left-0 right-0 z-50">
        <div className="mx-auto max-w-[980px] px-4 pt-5 md:pt-7">
          <nav
            className="nav-glow relative mx-auto flex h-9 md:h-11 items-center justify-between rounded-full px-4 md:px-6 text-white shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.15)] border border-white/15"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))",
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
            }}
          >
            <div className="flex items-center gap-5 md:gap-8">
              <Link to="/about" className="font-display text-[6px] md:text-[7px] tracking-[0.2em] uppercase font-medium text-white/80 hover:text-white transition-colors">
                About Us
              </Link>
             <Link to="/foundation" className="font-display text-[6px] md:text-[7px] tracking-[0.2em] uppercase font-medium text-white/80 hover:text-white transition-colors">
                JFT
              </Link>
            </div>
           <Link
              to="/"
              className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 font-display text-[8px] md:text-[10px] tracking-[0.25em] uppercase font-semibold text-[#ffffff] whitespace-nowrap"
            >
              <img src={jftLogo} alt="" className="h-6 md:h-7 w-auto drop-shadow-sm" />
              <span>Tissa Jinasena Group</span>
            </Link>
            <div className="flex items-center gap-3 md:gap-4">
              <button onClick={goCourses} className="font-display text-[6px] md:text-[7px] tracking-[0.2em] uppercase font-medium text-white/80 hover:text-white transition-colors">
                Courses
              </button>
              {auth.loggedIn && (
                <button onClick={goProfile} aria-label="Account" className="w-8 h-8 rounded-full bg-white/15 text-white flex items-center justify-center hover:bg-white/25 transition-colors">
                  {auth.role === "teacher" ? <GraduationCap className="w-4 h-4" /> : <User className="w-4 h-4" />}
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

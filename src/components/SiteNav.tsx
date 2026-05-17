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
            className="relative mx-auto flex h-12 md:h-14 items-center justify-between rounded-full border border-[#e8c25a]/20 px-4 md:px-6 text-[#3a2a08] shadow-[0_10px_40px_-12px_rgba(212,160,40,0.35)] backdrop-blur-2xl"
            style={{ background: "linear-gradient(135deg, rgba(255,225,130,0.25), rgba(232,178,60,0.25))" }}
          >
            <div className="flex items-center gap-5 md:gap-8">
              <Link to="/about" className="text-[10px] md:text-[11px] tracking-[0.22em] uppercase opacity-90 hover:text-[#7a4f00] transition-colors">
                About Us
              </Link>
              <Link to="/foundation" className="text-[10px] md:text-[11px] tracking-[0.22em] uppercase opacity-90 hover:text-[#7a4f00] transition-colors">
                JFT
              </Link>
            </div>
            <Link
              to="/"
              className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 font-serif text-[11px] md:text-[13px] tracking-[0.26em] uppercase text-[#2a1d05] whitespace-nowrap"
            >
              <img src={jftLogo} alt="" className="h-6 md:h-7 w-auto drop-shadow-sm" />
              <span>Tissa Jinasena Group</span>
            </Link>
            <div className="flex items-center gap-3 md:gap-4">
              <button onClick={goCourses} className="text-[10px] md:text-[11px] tracking-[0.22em] uppercase opacity-90 hover:text-[#7a4f00] transition-colors">
                Courses
              </button>
              {auth.loggedIn && (
                <button onClick={goProfile} aria-label="Account" className="w-8 h-8 rounded-full bg-[#2a1d05] text-[#f4d873] flex items-center justify-center hover:bg-[#7a4f00] transition-colors">
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

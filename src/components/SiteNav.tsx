import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { User, GraduationCap } from "lucide-react";

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
          <nav className="mx-auto flex h-12 md:h-14 items-center justify-center gap-4 md:gap-8 rounded-full border border-white/10 bg-black/55 px-4 md:px-7 text-white shadow-2xl shadow-black/60 backdrop-blur-2xl supports-[backdrop-filter]:bg-black/40">
            <Link to="/about" className="text-[10px] md:text-[11px] tracking-[0.22em] uppercase opacity-90 hover:text-accent transition-colors">
              About Us
            </Link>
            <Link to="/foundation" className="text-[10px] md:text-[11px] tracking-[0.22em] uppercase opacity-90 hover:text-accent transition-colors">
              JFT
            </Link>
            <Link
              to="/"
              className="mx-1 md:mx-4 font-serif text-[11px] md:text-[13px] tracking-[0.26em] uppercase text-accent whitespace-nowrap"
            >
              Tissa Jinasena Group
            </Link>
            <button onClick={goCourses} className="text-[10px] md:text-[11px] tracking-[0.22em] uppercase opacity-90 hover:text-accent transition-colors">
              Courses
            </button>
            {auth.loggedIn && (
              <button onClick={goProfile} aria-label="Account" className="ml-0 md:ml-1 w-8 h-8 rounded-full bg-white text-foreground flex items-center justify-center hover:bg-accent transition-colors">
                {auth.role === "teacher" ? <GraduationCap className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </button>
            )}
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

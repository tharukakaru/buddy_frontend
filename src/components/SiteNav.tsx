import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { User, GraduationCap } from "lucide-react";

const linkCls =
  "text-[11px] tracking-display uppercase hover:text-accent transition-colors";

export function SiteNav() {
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

  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12 py-6 flex items-center justify-between">
        <nav className="flex items-center gap-8">
          <Link to="/about" className={linkCls}>About Us</Link>
          <Link to="/foundation" className={linkCls}>JFT</Link>
        </nav>
        <Link
          to="/"
          className="font-serif text-[13px] md:text-[15px] tracking-[0.35em] uppercase whitespace-nowrap"
        >
          Tissa Jinasena Group
        </Link>
        <nav className="flex items-center gap-6 justify-end">
          <button onClick={goCourses} className={linkCls}>Courses</button>
          {auth.loggedIn && (
            <button
              onClick={goProfile}
              aria-label="Account"
              className="w-9 h-9 rounded-full bg-foreground text-background flex items-center justify-center hover:bg-accent hover:text-foreground transition-colors"
            >
              {auth.role === "teacher" ? <GraduationCap className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

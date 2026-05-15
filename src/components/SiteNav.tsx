import { Link, useNavigate } from "@tanstack/react-router";

const linkCls =
  "text-[11px] tracking-display uppercase hover:text-accent transition-colors";

export function SiteNav() {
  const nav = useNavigate();
  const goCourses = () => {
    const loggedIn = typeof window !== "undefined" && sessionStorage.getItem("buddy_fake_auth") === "1";
    nav({ to: loggedIn ? "/courses" : "/login" });
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
        <nav className="flex items-center gap-8 justify-end">
          <button onClick={goCourses} className={linkCls}>Courses</button>
        </nav>
      </div>
    </header>
  );
}

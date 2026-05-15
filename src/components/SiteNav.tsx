import { Link } from "@tanstack/react-router";

const linkCls =
  "text-[11px] tracking-display uppercase hover:text-accent transition-colors";

export function SiteNav() {
  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12 py-6 flex items-center justify-between">
        <nav className="flex items-center gap-8">
          <Link to="/about" className={linkCls}>About Us</Link>
          <Link to="/foundation" className={linkCls}>JFT</Link>
        </nav>
        <Link
          to="/"
          className="font-serif text-base md:text-lg tracking-[0.4em] uppercase whitespace-nowrap"
        >
          Tissa Jinasena Group
        </Link>
        <nav className="flex items-center gap-8 justify-end">
          <Link to="/courses" className={linkCls}>Courses</Link>
        </nav>
      </div>
    </header>
  );
}

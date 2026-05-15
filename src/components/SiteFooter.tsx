import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border mt-32">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12 py-12 flex flex-col md:flex-row items-center justify-between gap-6 text-[11px] tracking-display uppercase text-muted-foreground">
        <div className="font-serif text-base tracking-[0.3em] text-foreground normal-case">
          JINASENA · BUDDY
        </div>
        <div className="flex gap-8">
          <Link to="/about" className="hover:text-accent">About</Link>
          <Link to="/foundation" className="hover:text-accent">Foundation</Link>
          <Link to="/courses" className="hover:text-accent">Courses</Link>
          <Link to="/contact" className="hover:text-accent">Contact</Link>
        </div>
        <div>© {new Date().getFullYear()} Jinasena Padanama</div>
      </div>
    </footer>
  );
}

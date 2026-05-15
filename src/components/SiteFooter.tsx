import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border mt-32 bg-foreground text-background">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="font-serif text-2xl tracking-[0.3em] mb-4">
              JINASENA
            </div>
            <p className="text-sm text-background/60 leading-relaxed max-w-xs">
              Powered by Buddy AI — a knowledge companion built on Dr. Tissa
              Jinasena's vision.
            </p>
          </div>

          {/* Group */}
          <div>
            <div className="text-[11px] tracking-display uppercase text-background/50 mb-5">
              Group
            </div>
            <ul className="space-y-3 text-sm">
              <li>Tissa Jinasena Group</li>
            </ul>
          </div>

          {/* Explore */}
          <div>
            <div className="text-[11px] tracking-display uppercase text-background/50 mb-5">
              Explore
            </div>
            <ul className="space-y-3 text-sm">
              <li><Link to="/about" className="hover:text-accent">About</Link></li>
              <li><Link to="/foundation" className="hover:text-accent">Foundation</Link></li>
              <li><Link to="/jtf" className="hover:text-accent">Training Foundation</Link></li>
              <li><Link to="/courses" className="hover:text-accent">Courses</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <div className="text-[11px] tracking-display uppercase text-background/50 mb-5">
              Connect
            </div>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-accent">YouTube</a></li>
              <li><a href="#" className="hover:text-accent">Instagram</a></li>
              <li><a href="#" className="hover:text-accent">Twitter</a></li>
              <li><Link to="/contact" className="hover:text-accent">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-background/50">
          <div>© {new Date().getFullYear()} Jinasena Padanama. All rights reserved.</div>
          <div>Powered by Absolx Core AI.</div>
        </div>
      </div>
    </footer>
  );
}

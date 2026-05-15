import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Toaster } from "@/components/ui/sonner";
import heroOcean from "@/assets/hero-ocean.jpg";
import absolxLogo from "@/assets/absolx-logo.png";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    meta: [{ title: "Sign in — BUDDY" }, { name: "description", content: "Sign in to access Buddy courses." }],
  }),
});

function LoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back");
    const { data } = await supabase.auth.getUser();
    if (!data.user) return;
    const { data: prof } = await supabase
      .from("profiles").select("onboarding_completed,status").eq("id", data.user.id).maybeSingle();
    if (prof?.status === "pending") {
      toast.message("Your account is pending review.");
      nav({ to: "/courses" });
    } else if (!prof?.onboarding_completed) {
      nav({ to: "/onboarding" });
    } else {
      nav({ to: "/courses" });
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-background grid md:grid-cols-[1.05fr_1fr]">
      <Toaster />

      {/* LEFT — cinematic image */}
      <div className="relative hidden md:flex flex-col justify-between p-10 lg:p-14 text-white overflow-hidden">
        <img src={heroOcean} alt="" className="absolute inset-0 h-full w-full object-cover scale-105" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/55 to-black/85" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_30%,rgba(217,168,90,0.22),transparent_55%)]" />

        <Link to="/" className="relative font-serif tracking-[0.4em] uppercase text-[11px]">
          Tissa Jinasena Group
        </Link>

        <div className="relative max-w-md">
          <div className="text-[10px] tracking-[0.4em] uppercase text-white/50 mb-5">— A knowledge companion</div>
          <h1 className="font-serif text-5xl lg:text-6xl leading-[0.95]">
            Welcome back to <em className="text-accent">Buddy</em>.
          </h1>
          <div className="mt-8 h-px w-12 bg-accent" />
          <p className="mt-6 font-sinhala text-white/75 text-[13px] leading-relaxed">
            බුද්ධිය යනු සංකීර්ණ දෑ සරල කිරීමේ හැකියාවයි.
          </p>
          <p className="mt-2 text-white/55 text-[12px] leading-relaxed">
            Wisdom is the ability to make the complex simple.
          </p>
        </div>

        <div className="relative flex items-center gap-3 text-white/55">
          <span className="text-[10px] tracking-[0.3em] uppercase">Powered by</span>
          <img src={absolxLogo} alt="AbsolX" className="h-6 w-auto opacity-90" />
        </div>
      </div>

      {/* RIGHT — form */}
      <div className="relative flex items-center justify-center p-6 md:p-10 overflow-y-auto">
        <Link to="/" className="md:hidden absolute top-5 left-5 font-serif tracking-[0.3em] uppercase text-[11px]">
          Tissa Jinasena Group
        </Link>

        <form onSubmit={submit} className="w-full max-w-sm space-y-7">
          <div>
            <div className="text-[10px] tracking-[0.35em] uppercase text-accent mb-3">— Sign in</div>
            <h2 className="font-serif text-3xl md:text-4xl leading-tight">Continue your journey</h2>
            <p className="text-[13px] text-muted-foreground mt-3">
              Access your courses, progress, and Buddy AI mentor.
            </p>
          </div>

          <div className="space-y-5">
            <Field label="Email">
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-transparent border-b border-border py-2.5 text-sm focus:outline-none focus:border-accent transition-colors placeholder:text-muted-foreground/40" />
            </Field>
            <Field label="Password">
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent border-b border-border py-2.5 text-sm focus:outline-none focus:border-accent transition-colors placeholder:text-muted-foreground/40" />
            </Field>
          </div>

          <button disabled={busy}
            className="group relative w-full bg-foreground text-background py-3.5 text-[11px] tracking-[0.35em] uppercase overflow-hidden transition-all hover:shadow-[0_15px_40px_-15px] hover:shadow-accent/60 disabled:opacity-50">
            <span className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <span className="relative">{busy ? "Signing in…" : "Sign in →"}</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[9px] tracking-[0.35em] uppercase text-muted-foreground">New here</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <Link to="/signup"
            className="block w-full text-center border border-foreground py-3.5 text-[11px] tracking-[0.35em] uppercase hover:bg-foreground hover:text-background transition-colors">
            Create an account
          </Link>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[9px] tracking-[0.35em] uppercase text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

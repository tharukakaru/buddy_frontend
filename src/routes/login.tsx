import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
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
      .from("profiles").select("onboarding_completed").eq("id", data.user.id).maybeSingle();
    nav({ to: prof?.onboarding_completed ? "/courses" : "/onboarding" });
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-background grid md:grid-cols-2">
      <Toaster />

      {/* LEFT — editorial image panel */}
      <div className="relative hidden md:block overflow-hidden">
        <img src={heroOcean} alt="" className="absolute inset-0 h-full w-full object-cover scale-110" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/85" />

        <div className="relative z-10 h-full flex flex-col justify-between p-12 lg:p-16 text-white">
          <Link to="/" className="font-serif tracking-[0.4em] uppercase text-[11px] hover:text-accent transition-colors">
            Tissa Jinasena Group
          </Link>

          <div>
            <div className="text-[10px] tracking-[0.4em] uppercase text-accent mb-6">— A knowledge companion</div>
            <h1 className="font-serif text-5xl lg:text-7xl leading-[0.92] max-w-md">
              Wisdom <em className="text-accent not-italic font-light">begins</em><br />
              with one step.
            </h1>
            <div className="mt-10 h-px w-16 bg-accent" />
            <p className="mt-6 font-sinhala text-white/80 text-[14px] leading-[1.9] max-w-sm">
              බුද්ධිය යනු සංකීර්ණ දෑ සරල කිරීමේ හැකියාවයි.
            </p>
          </div>

          <div className="flex items-center gap-3 text-white/60">
            <span className="text-[10px] tracking-[0.3em] uppercase">Powered by</span>
            <img src={absolxLogo} alt="AbsolX" className="h-7 w-auto opacity-90" />
          </div>
        </div>
      </div>

      {/* RIGHT — minimal form, perfectly centered */}
      <div className="relative flex flex-col justify-center px-6 md:px-16 lg:px-24 py-10">
        <Link to="/" className="md:hidden absolute top-6 left-6 font-serif tracking-[0.3em] uppercase text-[11px]">
          Tissa Jinasena Group
        </Link>

        <div className="absolute top-8 right-8 text-[11px] tracking-[0.25em] uppercase text-muted-foreground">
          New here?{" "}
          <Link to="/signup" className="text-foreground hover:text-accent border-b border-foreground/40 hover:border-accent ml-2">
            Create account
          </Link>
        </div>

        <form onSubmit={submit} className="w-full max-w-sm mx-auto space-y-9">
          <div>
            <div className="text-[10px] tracking-[0.4em] uppercase text-accent mb-4">— Sign in</div>
            <h2 className="font-serif text-4xl leading-[1.05]">Welcome back.</h2>
            <p className="text-[13px] text-muted-foreground mt-3">
              Continue learning with Buddy.
            </p>
          </div>

          <div className="space-y-7">
            <Field label="Email">
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-transparent border-0 border-b border-border py-3 text-[15px] focus:outline-none focus:border-accent transition-colors placeholder:text-muted-foreground/35" />
            </Field>
            <Field label="Password">
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent border-0 border-b border-border py-3 text-[15px] focus:outline-none focus:border-accent transition-colors placeholder:text-muted-foreground/35" />
            </Field>
          </div>

          <button disabled={busy}
            className="group relative w-full bg-foreground text-background py-4 text-[11px] tracking-[0.4em] uppercase overflow-hidden transition-shadow hover:shadow-[0_20px_50px_-15px] hover:shadow-accent/50 disabled:opacity-50 flex items-center justify-center gap-3">
            <span className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <span className="relative">{busy ? "Signing in" : "Sign in"}</span>
            <ArrowRight className="relative w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>

          <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground/70 text-center">
            Forgot password? Contact your mentor.
          </p>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[9px] tracking-[0.4em] uppercase text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

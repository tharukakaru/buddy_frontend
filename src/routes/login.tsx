import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowRight, Mail, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Toaster } from "@/components/ui/sonner";
import absolxLogo from "@/assets/absolx-logo.png";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({ meta: [{ title: "Sign in — BUDDY" }] }),
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
    <div className="h-screen w-screen overflow-hidden relative bg-[#0d0c0a] text-white flex items-center justify-center">
      <Toaster />

      {/* Ambient backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(217,168,90,0.18),transparent_50%),radial-gradient(circle_at_80%_85%,rgba(120,140,180,0.15),transparent_55%)]" />
      <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Top brand bar */}
      <div className="absolute top-0 inset-x-0 px-6 md:px-12 py-6 flex items-center justify-between text-[11px] tracking-[0.35em] uppercase z-20">
        <Link to="/" className="font-serif text-white/85 hover:text-accent transition-colors">
          ← Tissa Jinasena Group
        </Link>
        <Link to="/signup" className="text-white/60 hover:text-accent">
          Create account
        </Link>
      </div>

      {/* Card */}
      <div className="relative z-10 w-[min(420px,92vw)] mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-[10px] tracking-[0.5em] uppercase text-accent mb-5">
            <span className="h-px w-8 bg-accent" /> Sign in <span className="h-px w-8 bg-accent" />
          </div>
          <h1 className="font-serif text-4xl md:text-5xl leading-[0.95]">
            Welcome <em className="text-accent not-italic">back</em>.
          </h1>
          <p className="mt-3 text-[12px] text-white/55">
            Continue your journey with Buddy.
          </p>
        </div>

        <form onSubmit={submit}
          className="relative bg-white/[0.04] backdrop-blur-xl border border-white/10 p-7 md:p-9 space-y-5 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)]">
          {/* Subtle corner accents */}
          <span className="absolute top-0 left-0 h-3 w-3 border-t border-l border-accent/60" />
          <span className="absolute top-0 right-0 h-3 w-3 border-t border-r border-accent/60" />
          <span className="absolute bottom-0 left-0 h-3 w-3 border-b border-l border-accent/60" />
          <span className="absolute bottom-0 right-0 h-3 w-3 border-b border-r border-accent/60" />

          <Field icon={<Mail className="w-3.5 h-3.5" />} label="Email">
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-transparent border-0 py-2 text-[15px] text-white focus:outline-none placeholder:text-white/25" />
          </Field>
          <Field icon={<Lock className="w-3.5 h-3.5" />} label="Password">
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-transparent border-0 py-2 text-[15px] text-white focus:outline-none placeholder:text-white/25" />
          </Field>

          <button disabled={busy}
            className="group relative w-full bg-accent text-foreground py-3.5 text-[11px] tracking-[0.4em] uppercase overflow-hidden transition-all hover:shadow-[0_15px_40px_-10px_rgba(217,168,90,0.6)] disabled:opacity-50 flex items-center justify-center gap-3 mt-2">
            <span className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <span className="relative">{busy ? "Signing in" : "Sign in"}</span>
            <ArrowRight className="relative w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>

          <p className="text-[10px] tracking-[0.3em] uppercase text-white/40 text-center pt-1">
            Forgot password? Contact your mentor.
          </p>
        </form>

        <div className="mt-8 flex items-center justify-center gap-2.5 text-white/40">
          <span className="text-[9px] tracking-[0.4em] uppercase">Powered by</span>
          <img src={absolxLogo} alt="AbsolX" className="h-5 w-auto opacity-80" />
        </div>
      </div>
    </div>
  );
}

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <label className="block group">
      <div className="flex items-center gap-2 text-[9px] tracking-[0.4em] uppercase text-white/45 mb-1">
        <span className="text-accent">{icon}</span>{label}
      </div>
      <div className="border-b border-white/15 group-focus-within:border-accent transition-colors">
        {children}
      </div>
    </label>
  );
}

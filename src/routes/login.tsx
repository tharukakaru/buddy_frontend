import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    meta: [{ title: "Login — BUDDY" }, { name: "description", content: "Sign in to access Buddy courses." }],
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
    <div className="min-h-screen grid md:grid-cols-2">
      <Toaster />
      <div className="hidden md:flex flex-col justify-between bg-foreground text-background p-12">
        <Link to="/" className="font-serif tracking-[0.4em] uppercase text-sm">Tissa Jinasena Group</Link>
        <div>
          <h1 className="font-serif text-5xl leading-tight">Welcome back to <em>Buddy</em>.</h1>
          <p className="mt-4 text-background/60 text-sm max-w-sm">
            Sign in to continue your journey. Wisdom is the ability to make the complex simple.
          </p>
        </div>
        <p className="text-[11px] tracking-display uppercase text-background/40">Powered by AbsolX Core AI</p>
      </div>
      <div className="flex items-center justify-center p-8 md:p-16">
        <form onSubmit={submit} className="w-full max-w-sm space-y-6">
          <div>
            <div className="text-[11px] tracking-display uppercase text-muted-foreground mb-2">— Sign in</div>
            <h2 className="font-serif text-3xl">Welcome back</h2>
          </div>
          <div className="space-y-4">
            <Field label="Email">
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-b border-border py-2 focus:outline-none focus:border-accent" />
            </Field>
            <Field label="Password">
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-b border-border py-2 focus:outline-none focus:border-accent" />
            </Field>
          </div>
          <button disabled={busy}
            className="w-full bg-foreground text-background py-3 text-xs tracking-[0.3em] uppercase hover:bg-foreground/90 disabled:opacity-50">
            {busy ? "Signing in…" : "Sign in"}
          </button>
          <p className="text-sm text-muted-foreground text-center">
            New to Buddy? <Link to="/signup" className="text-foreground border-b border-foreground hover:text-accent hover:border-accent">Create an account</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[10px] tracking-display uppercase text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

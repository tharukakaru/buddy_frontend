import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import heroImg from "@/assets/foundation-mountain.png";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
  head: () => ({ meta: [{ title: "Create account — BUDDY" }] }),
});

function SignupPage() {
  const nav = useNavigate();
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [form, setForm] = useState<Record<string, string>>({});
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    // Auth bypass — wire real auth later
    nav({ to: "/onboarding" });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#efeae2] via-[#f5f0e8] to-[#e8e0d2] flex items-center justify-center p-4 md:p-8">
      <Toaster />
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-[0_30px_80px_-30px_rgba(0,0,0,0.25)] overflow-hidden grid md:grid-cols-2 min-h-[600px]">
        {/* Left */}
        <div className="relative hidden md:block">
          <img src={heroImg} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/30 to-black/70" />
          <div className="relative h-full flex flex-col justify-center px-10 text-white">
            <h2 className="font-serif text-4xl mb-3">Welcome</h2>
            <p className="text-sm text-white/75 leading-relaxed max-w-xs">
              Begin your journey with Buddy — built for the next generation of Sri Lanka.{" "}
              <Link to="/login" className="text-accent font-medium underline-offset-4 hover:underline">Sign in</Link>
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="p-8 md:p-10 flex flex-col justify-center">
          <Link to="/" className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground hover:text-foreground mb-6 inline-block">
            ← Tissa Jinasena Group
          </Link>
          <h1 className="text-2xl font-semibold text-foreground mb-1">Register</h1>
          <p className="text-sm text-muted-foreground mb-5">Create your account. It's free and takes a minute.</p>

          <div className="grid grid-cols-2 gap-2 mb-5 p-1 bg-muted rounded-md">
            {(["student", "teacher"] as const).map((r) => (
              <button key={r} type="button" onClick={() => setRole(r)}
                className={`text-xs uppercase tracking-wider py-2 rounded-sm transition-colors ${
                  role === r ? "bg-foreground text-background" : "text-muted-foreground"
                }`}>{r}</button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="First Name" className="w-full border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
                onChange={(e) => set("first", e.target.value)} required />
              <input placeholder="Last Name" className="w-full border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
                onChange={(e) => set("last", e.target.value)} required />
            </div>
            <input type="email" placeholder="Email" className="w-full border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
              onChange={(e) => set("email", e.target.value)} required />
            <input type="password" placeholder="Password" className="w-full border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
              onChange={(e) => set("password", e.target.value)} required />
            {role === "student" ? (
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="Age" type="number" className="border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
                  onChange={(e) => set("age", e.target.value)} />
                <input placeholder="Home Town" className="border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
                  onChange={(e) => set("hometown", e.target.value)} />
              </div>
            ) : (
              <input placeholder="Department" className="w-full border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
                onChange={(e) => set("department", e.target.value)} />
            )}

            <label className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
              <input type="checkbox" required className="accent-accent" />
              I accept the <span className="text-accent">Terms</span> & <span className="text-accent">Privacy Policy</span>
            </label>

            <button type="submit"
              className="w-full bg-accent hover:bg-accent/90 text-foreground font-medium py-3 rounded-md text-sm transition-colors mt-2">
              Register Now
            </button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-5">
            Already have an account?{" "}
            <Link to="/login" className="text-foreground font-medium hover:text-accent">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

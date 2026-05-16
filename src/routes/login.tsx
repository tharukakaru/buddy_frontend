import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import heroImg from "@/assets/foundation-mountain.png";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({ meta: [{ title: "Sign in — BUDDY" }] }),
});

function LoginPage() {
  const nav = useNavigate();
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) return;
    if (typeof window !== "undefined") {
      sessionStorage.setItem("buddy_fake_auth", "1");
      sessionStorage.setItem("buddy_role", role);
      sessionStorage.setItem("buddy_email", email);
    }
    nav({ to: role === "teacher" ? "/teacher" : "/courses" });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#efeae2] via-[#f5f0e8] to-[#e8e0d2] flex items-center justify-center p-4 md:p-8">
      <Toaster />
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-[0_30px_80px_-30px_rgba(0,0,0,0.25)] overflow-hidden grid md:grid-cols-2 min-h-[560px]">
        <div className="relative hidden md:block">
          <img src={heroImg} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/30 to-black/70" />
          <div className="relative h-full flex flex-col justify-center px-10 text-white">
            <h2 className="font-serif text-4xl mb-3">Welcome back</h2>
            <p className="text-sm text-white/75 leading-relaxed max-w-xs">
              Sign in to continue your journey with Buddy — your AI knowledge companion.{" "}
              <Link to="/signup" className="text-accent font-medium underline-offset-4 hover:underline">Create account</Link>
            </p>
          </div>
        </div>

        <div className="p-8 md:p-12 flex flex-col justify-center">
          <Link to="/" className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground hover:text-foreground mb-8 inline-block">
            ← Tissa Jinasena Group
          </Link>
          <h1 className="text-2xl font-semibold text-foreground mb-1">Sign In</h1>
          <p className="text-sm text-muted-foreground mb-6">Enter your credentials to continue.</p>

          {/* Role toggle */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-secondary rounded-md mb-5">
            {(["student", "teacher"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`text-xs uppercase tracking-wider py-2 rounded transition-colors ${
                  role === r ? "bg-white text-foreground shadow-sm font-semibold" : "text-muted-foreground"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-4">
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
            />
            <input
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
            />

            <div>
              <label className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-1.5 block">Sign-in Code</label>
              <input
                inputMode="numeric"
                pattern="\d{6}"
                maxLength={6}
                required
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="6-digit code"
                className="w-full border border-border rounded-md px-4 py-3 text-sm tracking-[0.5em] text-center font-mono focus:outline-none focus:border-accent transition-colors"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-accent" /> Remember me
              </label>
              <span className="hover:text-foreground cursor-pointer">Forgot password?</span>
            </div>

            <button
              type="submit"
              className="w-full bg-accent hover:bg-accent/90 text-foreground font-medium py-3 rounded-md text-sm transition-colors mt-3"
            >
              Sign In as {role === "teacher" ? "Teacher" : "Student"}
            </button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-foreground font-medium hover:text-accent">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

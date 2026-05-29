import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { tryLogin, findUserByEmail, upsertGooglePending } from "@/lib/approval-store";
import heroImg from "@/assets/foundation-mountain.png";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({ meta: [{ title: "Sign in — BUDDY" }] }),
});

function LoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    // CHANGED: wrapped in try/catch so a Supabase misconfiguration never crashes the page
    try {
      supabase.auth.getSession().then(({ data }) => {
        if (cancelled) return;
        const s = data?.session;
        if (!s?.user?.email) return;
        const email = s.user.email;
        const name = (s.user.user_metadata?.full_name as string) || email.split("@")[0];
        const u = upsertGooglePending(email, name);
        if (u.status === "approved") {
          completeLogin(u.email, u.role, u.full_name);
        } else {
          supabase.auth.signOut();
          toast.message(
            u.status === "rejected"
              ? "Your account application was rejected."
              : "Submitted via Google — your account is pending admin review."
          );
        }
      }).catch(() => {
        // Supabase unavailable — silently ignore, email login still works
      });
    } catch {
      // Supabase not configured — ignore
    }
    return () => { cancelled = true; };
  }, []);

  const completeLogin = (email: string, role: "student" | "teacher", fullName: string) => {
    sessionStorage.setItem("buddy_fake_auth", "1");
    sessionStorage.setItem("buddy_role", role);
    sessionStorage.setItem("buddy_email", email);
    sessionStorage.setItem("buddy_full_name", fullName);
    // Upsert student record in Supabase so progress can be saved
    try {
      (supabase as any).from("students").upsert(
        { email, full_name: fullName, username: email.split("@")[0], last_active_at: new Date().toISOString() },
        { onConflict: "email" }
      );
    } catch {}
    toast.success("Welcome back!");
    nav({ to: role === "teacher" ? "/teacher" : "/courses" });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = tryLogin(email, password);
    setLoading(false);
    if (!result.ok) {
      toast.error(result.reason);
      return;
    }
    completeLogin(result.user.email, result.user.role, result.user.full_name);
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: window.location.origin + "/login" },
      });
      if (error) toast.error(error.message);
    } catch (err) {
      toast.error("Google sign-in is not available right now.");
    } finally {
      setLoading(false);
    }
  };

  const u = email ? findUserByEmail(email) : undefined;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#efeae2] via-[#f5f0e8] to-[#e8e0d2] flex items-center justify-center p-4 md:p-8">
      <Toaster />
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-[0_30px_80px_-30px_rgba(0,0,0,0.25)] overflow-hidden grid md:grid-cols-2 min-h-[520px]">

        <div className="relative hidden md:block">
          <img src={heroImg} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/30 to-black/70" />
          <div className="relative h-full flex flex-col justify-center px-10 text-white">
            <h2 className="font-serif text-4xl mb-3">Welcome back</h2>
            <p className="text-sm text-white/75 leading-relaxed max-w-xs">
              Sign in to continue your journey with Buddy — your AI knowledge companion.{" "}
              <Link to="/signup" className="text-accent font-medium underline-offset-4 hover:underline">Apply for access</Link>
            </p>
          </div>
        </div>

        <div className="p-8 md:p-12 flex flex-col justify-center">
          <Link to="/" className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground hover:text-foreground mb-8 inline-block">
            ← Tissa Jinasena Group
          </Link>
          <h1 className="text-2xl font-semibold text-foreground mb-1">Sign In</h1>
          <p className="text-sm text-muted-foreground mb-6">Enter your email and password to sign in.</p>

          <button
            type="button"
            onClick={signInWithGoogle}
            disabled={loading}
            className="w-full border border-border rounded-md px-4 py-3 text-sm flex items-center justify-center gap-3 hover:bg-secondary transition-colors mb-4 disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Sign in with Google
          </button>

          <div className="flex items-center gap-3 mb-4">
            <span className="flex-1 h-px bg-border" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">or</span>
            <span className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
              />
              {u?.status === "pending" && (
                <p className="text-[11px] text-amber-600 mt-1.5">⏳ Your account is still under review by the admin.</p>
              )}
              {u?.status === "rejected" && (
                <p className="text-[11px] text-red-600 mt-1.5">✕ Your account application was rejected.</p>
              )}
            </div>
            <input
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-accent/90 text-foreground font-medium py-3 rounded-md text-sm transition-colors mt-3 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-foreground font-medium hover:text-accent">Apply for access</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

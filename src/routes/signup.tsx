import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { addPending } from "@/lib/approval-store";
import heroImg from "@/assets/foundation-mountain.png";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
  head: () => ({ meta: [{ title: "Create account — BUDDY" }] }),
});

function SignupPage() {
  const nav = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [form, setForm] = useState<Record<string, string>>({});
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => { setMounted(true); }, []);

  const onPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mounted) return;
    if (!form.email || !form.password || !form.first || !form.last) {
      toast.error("Please fill all required fields.");
      return;
    }
    setLoading(true);
    try {
      addPending({
        email: form.email,
        password: form.password,
        full_name: `${form.first || ""} ${form.last || ""}`.trim(),
        role,
        age: form.age,
        hometown: form.hometown,
        department: form.department,
        phone: form.phone,
        position: form.position,
        ai_literacy: form.ai_literacy,
        provider: "email",
      });
      setSubmitted(true);
    } catch (err: any) {
      toast.error(err?.message || "Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  const signUpWithGoogle = async () => {
    setLoading(true);
    try {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("buddy_pending_role", role);
      }
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: window.location.origin + "/login" },
      });
      if (error) toast.error(error.message);
    } catch (err) {
      toast.error("Google sign-up failed.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-[#efeae2] via-[#f5f0e8] to-[#e8e0d2] flex items-center justify-center p-4">
        <Toaster />
        <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_30px_80px_-30px_rgba(0,0,0,0.25)] p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-accent/15 flex items-center justify-center mx-auto mb-5">
            <svg viewBox="0 0 24 24" className="w-7 h-7 text-accent" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="font-serif text-2xl text-foreground mb-2">Submitted for review</h1>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            Your details have been submitted to the Tissa Jinasena Group admin team.
            You'll receive a 6-digit sign-in code once your account is approved.
          </p>
          <div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-5">— What's next?</div>
          <ul className="text-left text-[13px] text-muted-foreground space-y-2 mb-7">
            <li>1. Super-admin reviews your application</li>
            <li>2. On approval, you'll receive a 6-digit code</li>
            <li>3. Use it on the sign-in page to access Buddy</li>
          </ul>
          <Link
            to="/login"
            className="inline-block w-full bg-accent hover:bg-accent/90 text-foreground font-medium py-3 rounded-md text-sm transition-colors"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

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
          <h1 className="text-2xl font-semibold text-foreground mb-1">Apply for Access</h1>
          <p className="text-sm text-muted-foreground mb-5">
            Submit your details — our admin team will review and issue your sign-in code.
          </p>

          <div className="grid grid-cols-2 gap-2 mb-5 p-1 bg-muted rounded-md">
            {(["student", "teacher"] as const).map((r) => (
              <button key={r} type="button" onClick={() => setRole(r)}
                className={`text-xs uppercase tracking-wider py-2 rounded-sm transition-colors ${
                  role === r ? "bg-foreground text-background" : "text-muted-foreground"
                }`}>{r}</button>
            ))}
          </div>

          {/* Google sign up */}
          <button
            type="button"
            onClick={signUpWithGoogle}
            disabled={loading}
            className="w-full border border-border rounded-md px-4 py-2.5 text-sm flex items-center justify-center gap-3 hover:bg-secondary transition-colors mb-4 disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Apply with Google
          </button>

          <div className="flex items-center gap-3 mb-4">
            <span className="flex-1 h-px bg-border" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">or</span>
            <span className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={submit} className="space-y-3">
            <div className="flex items-center gap-4 pb-1">
              <div className="w-16 h-16 rounded-full bg-secondary border border-border overflow-hidden flex items-center justify-center text-xs text-muted-foreground">
                {photo ? <img src={photo} alt="" className="w-full h-full object-cover" /> : "Photo"}
              </div>
              <label className="text-[11px] tracking-[0.2em] uppercase border border-border px-4 py-2 cursor-pointer hover:bg-secondary">
                Upload profile image
                <input type="file" accept="image/*" className="hidden" onChange={onPhoto} />
              </label>
            </div>
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
              <div className="space-y-3">
                <input placeholder="Department" className="w-full border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
                  onChange={(e) => set("department", e.target.value)} />
                <div className="grid grid-cols-2 gap-3">
                  <input placeholder="Age" type="number" className="border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
                    onChange={(e) => set("age", e.target.value)} />
                  <input placeholder="Phone Number" type="tel" className="border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
                    onChange={(e) => set("phone", e.target.value)} />
                </div>
                <input placeholder="Current Position" className="w-full border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
                  onChange={(e) => set("position", e.target.value)} />
                <select
                  defaultValue=""
                  onChange={(e) => set("ai_literacy", e.target.value)}
                  className="w-full border border-border rounded-md px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-accent"
                >
                  <option value="" disabled>AI Literacy Level</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            )}

            <label className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
              <input type="checkbox" required className="accent-accent" />
              I accept the <span className="text-accent">Terms</span> & <span className="text-accent">Privacy Policy</span>
            </label>

            <button type="submit"
              disabled={loading || !mounted}
              className="w-full bg-accent hover:bg-accent/90 text-foreground font-medium py-3 rounded-md text-sm transition-colors mt-2 disabled:opacity-50">
              {loading ? "Submitting..." : "Submit for Review"}
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

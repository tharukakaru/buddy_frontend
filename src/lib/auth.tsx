import { useEffect, useState, type ReactNode } from "react";
import { useNavigate, redirect } from "@tanstack/react-router";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setLoading(false);
    });

    return () => { sub.subscription.unsubscribe(); };
  }, []);

  return { session, user: session?.user ?? null, loading };
}

export function isFakeAuthed(): boolean {
  if (typeof window === "undefined") return false;
  try { return sessionStorage.getItem("buddy_fake_auth") === "1"; } catch { return false; }
}

/** ProtectedRoute — allows EITHER real Supabase session OR buddy_fake_auth flag */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth();
  const nav = useNavigate();
  const fakeAuthed = isFakeAuthed();

  useEffect(() => {
    if (!loading && !session && !fakeAuthed) {
      sessionStorage.removeItem("buddy_fake_auth");
      sessionStorage.removeItem("buddy_role");
      sessionStorage.removeItem("buddy_email");
      nav({ to: "/login" });
    }
  }, [loading, session, fakeAuthed, nav]);

  // If on client and clearly not authed, redirect immediately
  if (typeof window !== "undefined" && !loading && !session && !fakeAuthed) {
    return null;
  }

  if (loading && !fakeAuthed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-xs tracking-[0.3em] uppercase text-muted-foreground">Loading…</div>
      </div>
    );
  }

  if (!session && !fakeAuthed) return null;

  return <>{children}</>;
}

export async function signOut(navigate?: ReturnType<typeof useNavigate>) {
  await supabase.auth.signOut();
  sessionStorage.removeItem("buddy_fake_auth");
  sessionStorage.removeItem("buddy_role");
  sessionStorage.removeItem("buddy_email");
  if (navigate) navigate({ to: "/login" });
  else window.location.href = "/login";
}

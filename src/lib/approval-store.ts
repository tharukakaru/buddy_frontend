// Approval store — uses localStorage to fake the admin approval flow until Supabase tables exist.
// SSR-safe: every read/write checks for window first.

export type PendingUser = {
  id: string;            // random uuid
  email: string;
  password: string;      // plaintext for now (localStorage is local-only, this is dev-only)
  full_name: string;
  role: "student" | "teacher";
  age?: string;
  hometown?: string;
  department?: string;
  phone?: string;
  position?: string;
  ai_literacy?: string;
  provider?: "email" | "google";
  status: "pending" | "approved" | "rejected";
  code?: string;         // 6-digit login code, set on approval
  created_at: string;
};

const KEY = "buddy_approval_store_v1";

function hasWindow() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function read(): PendingUser[] {
  if (!hasWindow()) return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

function write(users: PendingUser[]) {
  if (!hasWindow()) return;
  localStorage.setItem(KEY, JSON.stringify(users));
}

export function listUsers(): PendingUser[] {
  return read();
}

export function findUserByEmail(email: string): PendingUser | undefined {
  return read().find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function addPending(user: Omit<PendingUser, "id" | "status" | "created_at">): PendingUser {
  const all = read();
  if (all.some((u) => u.email.toLowerCase() === user.email.toLowerCase())) {
    throw new Error("An account with this email is already submitted or registered.");
  }
  const id =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : "u_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
  const newUser: PendingUser = {
    ...user,
    id,
    status: "pending",
    created_at: new Date().toISOString(),
  };
  all.push(newUser);
  write(all);
  return newUser;
}

export function approveUser(id: string): PendingUser | undefined {
  const all = read();
  const u = all.find((x) => x.id === id);
  if (!u) return;
  u.status = "approved";
  u.code = String(Math.floor(100000 + Math.random() * 900000)); // 6-digit code
  write(all);
  return u;
}

export function rejectUser(id: string): PendingUser | undefined {
  const all = read();
  const u = all.find((x) => x.id === id);
  if (!u) return;
  u.status = "rejected";
  write(all);
  return u;
}

export function deleteUser(id: string) {
  write(read().filter((u) => u.id !== id));
}

/** Used by login: validates email + password only. */
export function tryLogin(
  email: string,
  password: string,
): { ok: true; user: PendingUser } | { ok: false; reason: string } {
  const u = findUserByEmail(email);
  if (!u) return { ok: false, reason: "No account found for this email." };
  if (u.status === "pending") return { ok: false, reason: "Your account is still under review. Please wait for admin approval." };
  if (u.status === "rejected") return { ok: false, reason: "Your account application was rejected. Contact admin." };
  if (u.password !== password) return { ok: false, reason: "Incorrect password." };
  return { ok: true, user: u };
}

/** Used after google OAuth: ensures user exists in pending store. */
export function upsertGooglePending(email: string, full_name: string): PendingUser {
  const existing = findUserByEmail(email);
  if (existing) return existing;
  return addPending({
    email,
    password: "(google-oauth)",
    full_name,
    role: "student",
    provider: "google",
  });
}

// ─── Super admin helpers ───
export function isSuperAdmin(): boolean {
  if (!hasWindow()) return false;
  return localStorage.getItem("buddy_super_admin") === "1";
}

export function setSuperAdmin(on: boolean) {
  if (!hasWindow()) return;
  if (on) localStorage.setItem("buddy_super_admin", "1");
  else localStorage.removeItem("buddy_super_admin");
}

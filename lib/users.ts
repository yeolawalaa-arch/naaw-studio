// Simple in-memory user store — replace with a real DB (Supabase/Postgres) for production
import bcrypt from "bcryptjs";

export type Plan = "free" | "pro";

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  plan: Plan;
  createdAt: string;
}

// In-memory store (resets on server restart — use a DB for production)
const users: Map<string, User> = new Map();

export async function createUser(name: string, email: string, password: string): Promise<User> {
  if (users.has(email)) throw new Error("Email already registered");
  const passwordHash = await bcrypt.hash(password, 10);
  const user: User = {
    id: Math.random().toString(36).slice(2),
    name,
    email,
    passwordHash,
    plan: "free",
    createdAt: new Date().toISOString(),
  };
  users.set(email, user);
  return user;
}

export async function findUser(email: string, password: string): Promise<User | null> {
  const user = users.get(email);
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  return ok ? user : null;
}

export function getUserByEmail(email: string): User | undefined {
  return users.get(email);
}

export function upgradeToPro(email: string) {
  const user = users.get(email);
  if (user) {
    user.plan = "pro";
    users.set(email, user);
  }
}

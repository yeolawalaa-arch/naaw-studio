import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { findUser, createUser } from "../../../../lib/users";
import bcrypt from "bcryptjs";

// Hardcoded owner account — always works regardless of server restarts
const OWNER = {
  email: process.env.OWNER_EMAIL || "",
  hash: process.env.OWNER_HASH || "",
  name: "Adnan",
  plan: "pro" as const,
};

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Check owner account first
        if (OWNER.email && credentials.email === OWNER.email) {
          const ok = await bcrypt.compare(credentials.password, OWNER.hash);
          if (ok) return { id: "owner", name: OWNER.name, email: OWNER.email, plan: OWNER.plan };
          return null;
        }

        // Regular users from in-memory store
        let user = await findUser(credentials.email, credentials.password);
        if (!user) return null;
        return { id: user.id, name: user.name, email: user.email, plan: user.plan };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.plan = (user as any).plan;
      return token;
    },
    async session({ session, token }) {
      if (session.user) (session.user as any).plan = token.plan ?? "free";
      return session;
    },
  },
  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET || "naaw-secret-key-change-in-production",
});

export { handler as GET, handler as POST };

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { findUser } from "../../../../lib/users";

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
        const user = await findUser(credentials.email, credentials.password);
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

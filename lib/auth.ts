import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {
  buildLoginRateLimitKey,
  clearLoginFailures,
  isLoginBlocked,
  registerLoginFailure
} from "@/lib/login-rate-limit";

type HeaderValue = string | string[] | undefined;
type HeaderBag = Headers | Record<string, HeaderValue> | undefined;

function readHeader(headers: HeaderBag, key: string): string {
  if (!headers) return "";

  if (typeof (headers as Headers).get === "function") {
    return (headers as Headers).get(key) ?? "";
  }

  const raw = (headers as Record<string, HeaderValue>)[key];
  if (Array.isArray(raw)) return raw[0] ?? "";
  return raw ?? "";
}

function extractClientIp(headers: HeaderBag): string {
  const forwardedFor = readHeader(headers, "x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) return first;
  }

  const realIp = readHeader(headers, "x-real-ip");
  if (realIp) return realIp.trim();

  const cfIp = readHeader(headers, "cf-connecting-ip");
  if (cfIp) return cfIp.trim();

  return "unknown-ip";
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login"
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        const username = credentials?.username?.trim() ?? "";
        const password = credentials?.password ?? "";
        const ip = extractClientIp(req?.headers as HeaderBag);
        const rateLimitKey = buildLoginRateLimitKey(ip, username || "anonymous");
        const ipOnlyRateLimitKey = buildLoginRateLimitKey(ip, "*");

        if (isLoginBlocked(rateLimitKey) || isLoginBlocked(ipOnlyRateLimitKey)) {
          return null;
        }

        if (!username || !password) {
          registerLoginFailure(rateLimitKey);
          registerLoginFailure(ipOnlyRateLimitKey);
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { username }
        });

        if (!user) {
          registerLoginFailure(rateLimitKey);
          registerLoginFailure(ipOnlyRateLimitKey);
          return null;
        }

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
          registerLoginFailure(rateLimitKey);
          registerLoginFailure(ipOnlyRateLimitKey);
          return null;
        }

        clearLoginFailures(rateLimitKey);
        clearLoginFailures(ipOnlyRateLimitKey);

        return {
          id: user.id,
          name: user.username,
          role: user.role
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = typeof token.role === "string" ? token.role : "SuperAdmin";
      }
      return session;
    }
  }
};

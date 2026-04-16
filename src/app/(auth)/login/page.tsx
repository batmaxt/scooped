"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IceCreamCone } from "lucide-react";
import { DemoButton } from "@/components/shared/DemoButton";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        setIsLoading(false);
        return;
      }

      router.push("/discover");
    } catch (err) {
      console.error("Login error:", err);
      setError("Connection error. Please check your internet and try again.");
      setIsLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
    }
  }

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center px-4 bg-[#2D1A19] overflow-hidden">
      {/* Decorative blurred orbs */}
      <div className="absolute top-20 -left-20 w-72 h-72 rounded-full bg-[#F46B8F]/20 blur-[100px]" />
      <div className="absolute top-40 -right-20 w-80 h-80 rounded-full bg-[#F2B45A]/15 blur-[100px]" />
      <div className="absolute -bottom-20 left-1/3 w-64 h-64 rounded-full bg-[#2E1F1B]/25 blur-[100px]" />

      <div className="relative z-10 mb-8 text-center animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-gradient-to-br from-[#F46B8F] via-[#F2B45A] to-[#5D4037] mb-4 elevation-brand">
          <IceCreamCone className="size-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-white">Scooped</h1>
        <p className="text-white/60 mt-2 text-sm">
          Discover ice cream, track flavors, share scoops.
        </p>
      </div>

      <Card className="relative z-10 w-full max-w-sm border-0 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150 bg-white/5 backdrop-blur-xl" style={{ borderColor: "rgba(255,255,255,0.1)", borderWidth: "1px" }}>
        <CardHeader className="text-center">
          <CardTitle className="text-xl text-white">Welcome back</CardTitle>
          <CardDescription className="text-white/50">Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-white/70">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="bg-white/10 border-white/10 text-white placeholder:text-white/30"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-white/70">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="bg-white/10 border-white/10 text-white placeholder:text-white/30"
              />
            </div>

            {error && (
              <p className="text-destructive text-sm text-center">{error}</p>
            )}

            <Button type="submit" variant="brand-gradient" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-transparent text-white/40 px-2">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full bg-white/10 border-white/10 text-white hover:bg-white/20"
            onClick={handleGoogleLogin}
            type="button"
          >
            <svg className="mr-2 size-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </Button>

          <DemoButton className="mt-3" />

          <p className="text-white/40 mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-[#F46B8F] font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>

          <Link href="/discover" className="mt-2 block text-center">
            <Button variant="ghost" className="w-full text-white/40 hover:text-white/60 text-sm">
              Skip for now
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

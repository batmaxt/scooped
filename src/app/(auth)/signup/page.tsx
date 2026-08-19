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
import { Eye, EyeOff, MailCheck } from "lucide-react";
import { DemoButton } from "@/components/shared/DemoButton";
import {
  BrandHeader,
  GoogleIcon,
  AUTH_PAGE_BG,
  AUTH_INPUT_CLASSES,
} from "@/components/shared/AuthChrome";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState(false);

  function generateUsername(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ".")
      .replace(/[^a-z0-9.]/g, "");
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const username = generateUsername(displayName);

    if (!username) {
      setError("Please enter a valid display name.");
      setIsLoading(false);
      return;
    }

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
            display_name: displayName,
            full_name: displayName,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setIsLoading(false);
        return;
      }

      if (data.user) {
        // Check if email confirmation is required (no active session)
        if (!data.session) {
          setConfirmEmail(true);
          setIsLoading(false);
          return;
        }

        // Profile is created automatically by the database trigger (handle_new_user)
        router.push("/discover");
      } else {
        setError("Something went wrong. Please try again.");
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError("Connection error. Please check your internet and try again.");
      setIsLoading(false);
    }
  }

  async function handleGoogleSignup() {
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
    <div className={AUTH_PAGE_BG}>
      <BrandHeader />

      {confirmEmail ? (
        <Card className="w-full max-w-sm elevation-2 border-0">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-[#E8F5E2] dark:bg-emerald-900/20">
              <MailCheck className="size-6 text-emerald-700 dark:text-emerald-400" />
            </div>
            <CardTitle className="text-xl">Check your email</CardTitle>
            <CardDescription>
              We sent a confirmation link to <strong>{email}</strong>. Click
              the link in the email to activate your account, then come back
              and sign in.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/login">
              <Button variant="brand" size="lg" className="w-full">
                Go to Sign In
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full max-w-sm elevation-2 border-0 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Create an account</CardTitle>
            <CardDescription>Get started with Scooped</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="displayName">Display name</Label>
                <Input
                  id="displayName"
                  type="text"
                  placeholder="Jane Smith"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  autoComplete="name"
                  className={AUTH_INPUT_CLASSES}
                />
                {displayName && (
                  <p className="text-muted-foreground text-xs">
                    Username: @{generateUsername(displayName) || "..."}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className={AUTH_INPUT_CLASSES}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    autoComplete="new-password"
                    className={`${AUTH_INPUT_CLASSES} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#8C6F66] hover:text-[#2E1F1B] dark:hover:text-[#F5E6DC]"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
                <p className="text-muted-foreground text-xs">
                  At least 6 characters.
                </p>
              </div>

              {error && (
                <p className="text-destructive text-sm text-center">{error}</p>
              )}

              <Button
                type="submit"
                variant="brand"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card text-muted-foreground px-2">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={handleGoogleSignup}
              type="button"
            >
              <GoogleIcon />
              Continue with Google
            </Button>

            <DemoButton className="mt-3" />

            <p className="text-muted-foreground mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-[#C4364A] font-semibold hover:underline"
              >
                Sign in
              </Link>
            </p>

            <Link href="/discover" className="mt-2 block text-center">
              <Button
                variant="ghost"
                className="w-full text-[#8C6F66] hover:text-[#2E1F1B] dark:text-[#A8897E] dark:hover:text-[#F5E6DC] text-sm"
              >
                Skip for now
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

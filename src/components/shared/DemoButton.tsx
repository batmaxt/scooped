"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IceCreamCone, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function DemoButton({ className = "" }: { className?: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDemo() {
    setIsLoading(true);
    setError(null);
    const supabase = createClient();
    const id = crypto.randomUUID().slice(0, 8);
    const email = `demo-${id}@demo.scooped.app`;
    const password = "scooped-demo-2024!";

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: "Ice Cream Fan",
            username: `demo.${id}`,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setIsLoading(false);
        return;
      }

      if (data.session) {
        router.push("/home");
        return;
      }

      // Fallback: try signing in directly
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError("Demo unavailable. Please sign up instead.");
        setIsLoading(false);
        return;
      }

      router.push("/home");
    } catch {
      setError("Connection error. Try again.");
      setIsLoading(false);
    }
  }

  return (
    <div className={className}>
      <Button
        onClick={handleDemo}
        disabled={isLoading}
        size="lg"
        className="w-full gap-2 bg-white dark:bg-card border-2 border-[#7CC9B4] text-[#2E1F1B] dark:text-[#F5E6DC] hover:bg-[#7CC9B4]/10 rounded-[999px] [&_svg]:text-[#4A9B84] select-none touch-manipulation"
      >
        {isLoading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <IceCreamCone className="size-4" />
        )}
        {isLoading ? "Creating demo..." : "Try Demo Account"}
      </Button>
      {error && <p className="text-destructive text-xs text-center mt-2">{error}</p>}
    </div>
  );
}

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/models";

interface AuthContextValue {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  isLoading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  const fetchProfile = useCallback(
    async (userId: string) => {
      // Fetch profile and follower/following counts in parallel
      const [profileResult, followerResult, followingResult] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", userId).single(),
        supabase.from("follows").select("*", { count: "exact", head: true }).eq("following_id", userId),
        supabase.from("follows").select("*", { count: "exact", head: true }).eq("follower_id", userId),
      ]);

      if (profileResult.error && profileResult.error.code !== "PGRST116") {
        console.error("Error fetching profile:", profileResult.error);
        return null;
      }

      if (!profileResult.data) return null;

      return {
        ...profileResult.data,
        follower_count: followerResult.count ?? 0,
        following_count: followingResult.count ?? 0,
      } as Profile;
    },
    [supabase]
  );

  const upsertProfile = useCallback(
    async (authUser: User) => {
      const displayName =
        authUser.user_metadata?.display_name ||
        authUser.user_metadata?.full_name ||
        authUser.user_metadata?.name ||
        authUser.email?.split("@")[0] ||
        "User";

      const avatarUrl =
        authUser.user_metadata?.avatar_url ||
        authUser.user_metadata?.picture ||
        null;

      let username =
        authUser.user_metadata?.preferred_username ||
        authUser.user_metadata?.username ||
        displayName.toLowerCase().replace(/\s+/g, ".").replace(/[^a-z0-9.]/g, "");

      // Ensure username is at least 3 chars
      if (username.length < 3) {
        username = "user_" + authUser.id.replace(/-/g, "").slice(0, 12);
      }

      const { data, error } = await supabase
        .from("profiles")
        .upsert(
          {
            id: authUser.id,
            username,
            display_name: displayName,
            avatar_url: avatarUrl,
          },
          { onConflict: "id", ignoreDuplicates: true }
        )
        .select("*")
        .single();

      if (error) {
        console.error("Error upserting profile:", error);
        // DB trigger may have already created the profile — fetch it
        return fetchProfile(authUser.id);
      }

      return data as Profile;
    },
    [supabase, fetchProfile]
  );

  useEffect(() => {
    const initAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          setUser(session.user);
          let existingProfile = await fetchProfile(session.user.id);
          if (!existingProfile) {
            existingProfile = await upsertProfile(session.user);
          }
          setProfile(existingProfile);
        }
      } catch (error: unknown) {
        // AbortError is expected during React StrictMode double-mount — ignore it
        if (error instanceof Error && error.name === "AbortError") {
          // ignore
        } else {
          console.error("Error initializing auth:", error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        setUser(session.user);
        let existingProfile = await fetchProfile(session.user.id);
        if (!existingProfile) {
          existingProfile = await upsertProfile(session.user);
        }
        setProfile(existingProfile);
        setIsLoading(false);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setProfile(null);
        setIsLoading(false);
      } else if (event === "TOKEN_REFRESHED" && session?.user) {
        setUser(session.user);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, fetchProfile, upsertProfile]);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    const updated = await fetchProfile(user.id);
    if (updated) setProfile(updated);
  }, [user, fetchProfile]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }, [supabase]);

  return (
    <AuthContext.Provider value={{ user, profile, isLoading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

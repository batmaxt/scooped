"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Users, Loader2 } from "lucide-react";
import { UserRow } from "@/components/shared/UserRow";
import { fetchFollowers } from "@/queries/social";

export default function FollowersPage() {
  const params = useParams();
  const username = params.username as string;

  const { data: followers = [], isLoading } = useQuery({
    queryKey: ["followers", username],
    queryFn: async () => {
      // First get the user ID from the username
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", username)
        .single();

      if (!profile) return [];
      return fetchFollowers(profile.id);
    },
    enabled: !!username,
  });

  return (
    <div className="min-h-dvh bg-white pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <Link
            href={`/profile/${username}`}
            className="p-1 -ml-1 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <div>
            <h1 className="font-semibold">Followers</h1>
            <p className="text-xs text-muted-foreground">@{username}</p>
          </div>
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="size-6 animate-spin text-neutral-400" />
        </div>
      ) : followers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center px-6">
          <Users className="size-10 text-neutral-300 mb-3" />
          <p className="text-sm text-muted-foreground">No followers yet</p>
        </div>
      ) : (
        <div className="divide-y divide-neutral-100">
          {followers.map((profile) => (
            <UserRow key={profile.id} profile={profile} />
          ))}
        </div>
      )}
    </div>
  );
}

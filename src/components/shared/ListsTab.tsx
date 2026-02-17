"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { List, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ListCard } from "@/components/shared/ListCard";
import { CreateListSheet } from "@/components/shared/CreateListSheet";
import { fetchUserLists, fetchPublicUserLists } from "@/queries/lists";

interface ListsTabProps {
  userId: string;
  isOwnProfile?: boolean;
}

export function ListsTab({ userId, isOwnProfile = false }: ListsTabProps) {
  const [createOpen, setCreateOpen] = useState(false);

  const { data: lists = [], isLoading } = useQuery({
    queryKey: ["userLists", userId, isOwnProfile],
    queryFn: () =>
      isOwnProfile ? fetchUserLists(userId) : fetchPublicUserLists(userId),
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className="space-y-3 pt-2">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (lists.length === 0) {
    return (
      <div className="flex flex-col items-center py-16 text-center">
        <div className="rounded-full bg-violet-50 p-4 mb-4">
          <List className="size-8 text-violet-400" />
        </div>
        <h3 className="font-semibold mb-1">No lists yet</h3>
        <p className="text-sm text-muted-foreground max-w-[260px] mb-4">
          {isOwnProfile
            ? "Create curated collections of your favorite shops, flavors, and brands."
            : "This user hasn\u2019t created any public lists yet."}
        </p>
        {isOwnProfile && (
          <>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 border-violet-200 text-violet-600 hover:bg-violet-50"
              onClick={() => setCreateOpen(true)}
            >
              <Plus className="size-3.5" />
              Create a List
            </Button>
            <CreateListSheet
              open={createOpen}
              onOpenChange={setCreateOpen}
              userId={userId}
            />
          </>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3 pt-2">
      {isOwnProfile && (
        <Button
          variant="outline"
          size="sm"
          className="w-full gap-1.5 border-violet-200 text-violet-600 hover:bg-violet-50"
          onClick={() => setCreateOpen(true)}
        >
          <Plus className="size-3.5" />
          New List
        </Button>
      )}
      {lists.map((list) => (
        <ListCard key={list.id} list={list} />
      ))}
      {isOwnProfile && (
        <CreateListSheet
          open={createOpen}
          onOpenChange={setCreateOpen}
          userId={userId}
        />
      )}
    </div>
  );
}

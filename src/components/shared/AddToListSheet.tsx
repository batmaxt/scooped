"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Plus, Loader2, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  fetchUserLists,
  fetchListsContainingItem,
  addListItem,
  removeListItem,
} from "@/queries/lists";
import { CreateListSheet } from "@/components/shared/CreateListSheet";
import type { ListItemType } from "@/types/models";

interface AddToListSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemType: ListItemType;
  itemId: string;
}

export function AddToListSheet({
  open,
  onOpenChange,
  itemType,
  itemId,
}: AddToListSheetProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);

  const { data: lists = [], isLoading: loadingLists } = useQuery({
    queryKey: ["userLists", user?.id, true],
    queryFn: () => fetchUserLists(user!.id),
    enabled: !!user && open,
  });

  const { data: containingListIds = [], isLoading: loadingContaining } =
    useQuery({
      queryKey: ["listsContainingItem", user?.id, itemType, itemId],
      queryFn: () => fetchListsContainingItem(user!.id, itemType, itemId),
      enabled: !!user && open,
    });

  const addMutation = useMutation({
    mutationFn: (listId: string) => addListItem(listId, itemType, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["listsContainingItem", user?.id, itemType, itemId],
      });
      queryClient.invalidateQueries({ queryKey: ["userLists"] });
      queryClient.invalidateQueries({ queryKey: ["listItems"] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (listId: string) => {
      // We need to find the item ID first — fetch list items and find the match
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const fkColumn =
        itemType === "location"
          ? "location_id"
          : itemType === "flavor"
            ? "flavor_id"
            : "brand_id";
      const { data } = await supabase
        .from("list_items")
        .select("id")
        .eq("list_id", listId)
        .eq(fkColumn, itemId)
        .single();
      if (data) {
        await removeListItem(data.id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["listsContainingItem", user?.id, itemType, itemId],
      });
      queryClient.invalidateQueries({ queryKey: ["userLists"] });
      queryClient.invalidateQueries({ queryKey: ["listItems"] });
    },
  });

  const isLoading = loadingLists || loadingContaining;

  const handleToggle = (listId: string) => {
    if (containingListIds.includes(listId)) {
      removeMutation.mutate(listId);
    } else {
      addMutation.mutate(listId);
    }
  };

  if (!user) return null;

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="rounded-t-2xl">
          <SheetHeader>
            <SheetTitle>Add to List</SheetTitle>
          </SheetHeader>
          <div className="py-4 space-y-2">
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }, (_, i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-lg" />
                ))}
              </div>
            ) : lists.length === 0 ? (
              <div className="text-center py-8">
                <List className="size-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-3">
                  You don&apos;t have any lists yet.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 border-violet-200 text-violet-600 hover:bg-violet-50"
                  onClick={() => setCreateOpen(true)}
                >
                  <Plus className="size-3.5" />
                  Create a List
                </Button>
              </div>
            ) : (
              <>
                {lists.map((list) => {
                  const isInList = containingListIds.includes(list.id);
                  const isPending =
                    addMutation.isPending || removeMutation.isPending;
                  return (
                    <button
                      key={list.id}
                      type="button"
                      onClick={() => handleToggle(list.id)}
                      disabled={isPending}
                      className="w-full flex items-center justify-between px-3 py-3 rounded-lg hover:bg-neutral-50 active:bg-neutral-100 transition-colors disabled:opacity-50"
                    >
                      <div className="text-left min-w-0">
                        <p className="font-medium text-sm truncate">
                          {list.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {list.item_count} item
                          {list.item_count !== 1 ? "s" : ""}
                        </p>
                      </div>
                      {isInList ? (
                        <Check className="size-5 text-violet-500 shrink-0" />
                      ) : (
                        <Plus className="size-5 text-muted-foreground shrink-0" />
                      )}
                    </button>
                  );
                })}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full gap-1.5 text-violet-600 hover:bg-violet-50 mt-2"
                  onClick={() => setCreateOpen(true)}
                >
                  <Plus className="size-3.5" />
                  Create New List
                </Button>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
      <CreateListSheet
        open={createOpen}
        onOpenChange={setCreateOpen}
        userId={user.id}
      />
    </>
  );
}

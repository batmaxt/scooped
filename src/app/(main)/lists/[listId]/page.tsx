"use client";

import { use, useState, useCallback } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Globe,
  Lock,
  MoreHorizontal,
  Pencil,
  Trash2,
  List,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/components/providers/AuthProvider";
import { ListItemCard } from "@/components/shared/ListItemCard";
import { CreateListSheet } from "@/components/shared/CreateListSheet";
import {
  fetchListById,
  fetchListItems,
  removeListItem,
  reorderListItems,
  deleteList,
} from "@/queries/lists";
import type { ListItem } from "@/types/models";

export default function ListDetailPage({
  params,
}: {
  params: Promise<{ listId: string }>;
}) {
  const { listId } = use(params);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [editOpen, setEditOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: list, isLoading: loadingList } = useQuery({
    queryKey: ["list", listId],
    queryFn: () => fetchListById(listId),
    enabled: !!listId,
  });

  const { data: items = [], isLoading: loadingItems } = useQuery({
    queryKey: ["listItems", listId],
    queryFn: () => fetchListItems(listId),
    enabled: !!listId,
  });

  const isOwner = !!user && !!list && user.id === list.user_id;

  const removeMutation = useMutation({
    mutationFn: (itemId: string) => removeListItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listItems", listId] });
      queryClient.invalidateQueries({ queryKey: ["list", listId] });
      queryClient.invalidateQueries({ queryKey: ["userLists"] });
    },
  });

  const handleMoveUp = useCallback(
    (index: number) => {
      if (index === 0) return;
      const newItems = [...items];
      [newItems[index - 1], newItems[index]] = [
        newItems[index],
        newItems[index - 1],
      ];
      const updates = newItems.map((item, i) => ({
        id: item.id,
        position: i,
      }));
      // Optimistic: update cache immediately
      queryClient.setQueryData(
        ["listItems", listId],
        newItems.map((item, i) => ({ ...item, position: i }))
      );
      reorderListItems(updates).catch(() => {
        queryClient.invalidateQueries({ queryKey: ["listItems", listId] });
      });
    },
    [items, listId, queryClient]
  );

  const handleMoveDown = useCallback(
    (index: number) => {
      if (index >= items.length - 1) return;
      const newItems = [...items];
      [newItems[index], newItems[index + 1]] = [
        newItems[index + 1],
        newItems[index],
      ];
      const updates = newItems.map((item, i) => ({
        id: item.id,
        position: i,
      }));
      queryClient.setQueryData(
        ["listItems", listId],
        newItems.map((item, i) => ({ ...item, position: i }))
      );
      reorderListItems(updates).catch(() => {
        queryClient.invalidateQueries({ queryKey: ["listItems", listId] });
      });
    },
    [items, listId, queryClient]
  );

  const handleDelete = async () => {
    if (!list) return;
    setIsDeleting(true);
    try {
      await deleteList(list.id);
      queryClient.invalidateQueries({ queryKey: ["userLists"] });
      window.history.back();
    } catch {
      setIsDeleting(false);
    }
  };

  if (loadingList || loadingItems) {
    return (
      <div className="px-4 pt-4 space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton className="size-6" />
          <Skeleton className="h-5 w-40" />
        </div>
        <Skeleton className="h-4 w-60" />
        <div className="space-y-3 pt-4">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!list) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <List className="size-12 text-neutral-300 mb-4" />
        <h2 className="text-lg font-bold mb-2">List not found</h2>
        <p className="text-sm text-muted-foreground">
          This list may have been deleted or is private.
        </p>
        <Link
          href="/profile"
          className="mt-4 text-sm text-violet-500 font-medium"
        >
          Back to Profile
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-white pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => window.history.back()}
            className="p-1 -ml-1"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="font-semibold truncate">{list.name}</h1>
          </div>
          {isOwner && (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 -mr-2 rounded-full hover:bg-neutral-100 transition-colors"
                aria-label="Menu"
              >
                <MoreHorizontal className="w-5 h-5 text-neutral-600" />
              </button>
              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-1 z-50 bg-white rounded-lg shadow-lg border py-1 w-40">
                    <button
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-neutral-50 transition-colors"
                      onClick={() => {
                        setMenuOpen(false);
                        setEditOpen(true);
                      }}
                    >
                      <Pencil className="size-4" />
                      Edit List
                    </button>
                    <button
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      onClick={() => {
                        setMenuOpen(false);
                        handleDelete();
                      }}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Trash2 className="size-4" />
                      )}
                      Delete List
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* List metadata */}
      <div className="px-4 py-4 border-b">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {list.is_public ? (
            <Globe className="size-3.5" />
          ) : (
            <Lock className="size-3.5" />
          )}
          <span>{list.is_public ? "Public" : "Private"}</span>
          <span className="text-neutral-300">|</span>
          <span>
            {list.item_count} item{list.item_count !== 1 ? "s" : ""}
          </span>
        </div>
        {list.description && (
          <p className="text-sm text-muted-foreground mt-2">
            {list.description}
          </p>
        )}
      </div>

      {/* Items */}
      <div className="px-4 py-4 space-y-3">
        {items.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <div className="rounded-full bg-violet-50 p-4 mb-4">
              <List className="size-8 text-violet-400" />
            </div>
            <h3 className="font-semibold mb-1">This list is empty</h3>
            <p className="text-sm text-muted-foreground max-w-[260px]">
              {isOwner
                ? "Add shops, flavors, or brands from their pages."
                : "Nothing here yet."}
            </p>
          </div>
        ) : (
          items.map((item: ListItem, index: number) => (
            <ListItemCard
              key={item.id}
              item={item}
              isOwner={isOwner}
              isFirst={index === 0}
              isLast={index === items.length - 1}
              onMoveUp={() => handleMoveUp(index)}
              onMoveDown={() => handleMoveDown(index)}
              onRemove={() => removeMutation.mutate(item.id)}
            />
          ))
        )}
      </div>

      {/* Edit sheet */}
      {isOwner && (
        <CreateListSheet
          open={editOpen}
          onOpenChange={setEditOpen}
          userId={user!.id}
          editList={list}
        />
      )}
    </div>
  );
}

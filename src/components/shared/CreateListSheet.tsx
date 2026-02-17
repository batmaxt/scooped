"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { createList, updateList } from "@/queries/lists";
import type { List } from "@/types/models";

interface CreateListSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  /** Pass an existing list to edit instead of create */
  editList?: List;
}

export function CreateListSheet({
  open,
  onOpenChange,
  userId,
  editList,
}: CreateListSheetProps) {
  const [name, setName] = useState(editList?.name || "");
  const [description, setDescription] = useState(editList?.description || "");
  const [isPublic, setIsPublic] = useState(editList?.is_public ?? true);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => {
      if (editList) {
        return updateList(editList.id, {
          name: name.trim(),
          description: description.trim() || undefined,
          is_public: isPublic,
        });
      }
      return createList(userId, {
        name: name.trim(),
        description: description.trim() || undefined,
        is_public: isPublic,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userLists"] });
      setName("");
      setDescription("");
      setIsPublic(true);
      onOpenChange(false);
    },
  });

  const isEditing = !!editList;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl">
        <SheetHeader>
          <SheetTitle>{isEditing ? "Edit List" : "Create a List"}</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="listName">Name</Label>
            <Input
              id="listName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Must Try, Best Pistachio"
              maxLength={80}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="listDescription">Description (optional)</Label>
            <Input
              id="listDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this list about?"
              maxLength={200}
            />
          </div>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm font-medium">Public</span>
            <button
              type="button"
              role="switch"
              aria-checked={isPublic}
              onClick={() => setIsPublic(!isPublic)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                isPublic ? "bg-violet-500" : "bg-neutral-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform ${
                  isPublic ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </label>
          <Button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending || !name.trim()}
            className="w-full bg-violet-500 hover:bg-violet-600 text-white"
          >
            {mutation.isPending && (
              <Loader2 className="size-4 animate-spin mr-2" />
            )}
            {isEditing ? "Save Changes" : "Create List"}
          </Button>
          {mutation.isError && (
            <p className="text-xs text-red-500 text-center">
              Failed to {isEditing ? "update" : "create"} list. Please try
              again.
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

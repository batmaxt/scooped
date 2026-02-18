"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Send, Loader2, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/components/providers/AuthProvider";
import { fetchComments, addComment, deleteComment } from "@/queries/interactions";
import { getRelativeTime, getInitials } from "@/lib/utils";
import type { CheckinComment } from "@/types/models";
import Link from "next/link";

interface CommentSheetProps {
  checkinId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommentSheet({ checkinId, open, onOpenChange }: CommentSheetProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState("");

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ["comments", checkinId],
    queryFn: () => fetchComments(checkinId!),
    enabled: !!checkinId && open,
  });

  const addMutation = useMutation({
    mutationFn: () => addComment(user!.id, checkinId!, newComment.trim()),
    onSuccess: () => {
      setNewComment("");
      queryClient.invalidateQueries({ queryKey: ["comments", checkinId] });
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (commentId: string) => deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", checkinId] });
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user || !checkinId) return;
    addMutation.mutate();
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[70vh] flex flex-col rounded-t-2xl">
        <SheetHeader className="pb-2 border-b">
          <SheetTitle>
            Comments {comments.length > 0 && `(${comments.length})`}
          </SheetTitle>
        </SheetHeader>

        {/* Comment list */}
        <div className="flex-1 overflow-y-auto py-3 space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="size-8 rounded-full shrink-0" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-sm text-muted-foreground">No comments yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Be the first to comment!
              </p>
            </div>
          ) : (
            comments.map((comment: CheckinComment) => (
              <div key={comment.id} className="flex gap-3">
                <Link href={`/profile/${comment.profile?.username}`}>
                  <Avatar className="size-8 shrink-0">
                    {comment.profile?.avatar_url && (
                      <AvatarImage
                        src={comment.profile.avatar_url}
                        alt={comment.profile?.display_name || comment.profile?.username}
                      />
                    )}
                    <AvatarFallback className="bg-gradient-to-br from-pink-400 to-amber-300 text-white text-xs font-bold">
                      {getInitials(
                        comment.profile?.display_name,
                        comment.profile?.username
                      )}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/profile/${comment.profile?.username}`}
                      className="font-semibold text-sm hover:underline"
                    >
                      {comment.profile?.display_name || comment.profile?.username}
                    </Link>
                    <span className="text-xs text-muted-foreground">
                      {getRelativeTime(comment.created_at)}
                    </span>
                    {user?.id === comment.user_id && (
                      <button
                        type="button"
                        onClick={() => deleteMutation.mutate(comment.id)}
                        className="ml-auto min-w-[36px] min-h-[36px] flex items-center justify-center text-muted-foreground hover:text-red-500 transition-colors -mr-2"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-foreground/80 mt-0.5">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add comment form */}
        {user && (
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 pt-3 border-t"
          >
            <Input
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              maxLength={500}
              className="flex-1 h-10 rounded-full"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!newComment.trim() || addMutation.isPending}
              variant="brand"
              className="shrink-0 size-10 rounded-full"
            >
              {addMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
            </Button>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}

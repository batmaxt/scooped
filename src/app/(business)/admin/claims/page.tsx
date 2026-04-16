"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/components/providers/AuthProvider";
import { fetchAllClaims, approveClaim, rejectClaim } from "@/queries/business";
import type { BusinessClaim, Location } from "@/types/models";

const ADMIN_ID = "ed1906c8-2e71-4b6c-ac4a-8af4466edc1c";

const STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
] as const;

const STATUS_STYLES: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
  pending: { bg: "bg-amber-50", text: "text-amber-600", icon: Clock },
  approved: { bg: "bg-green-50", text: "text-green-600", icon: CheckCircle2 },
  rejected: { bg: "bg-red-50", text: "text-red-600", icon: XCircle },
};

function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const days = Math.floor((now.getTime() - date.getTime()) / 86400000);
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

// ---------------------------------------------------------------------------
// Claim Card
// ---------------------------------------------------------------------------

function ClaimCard({
  claim,
  onApprove,
  onReject,
}: {
  claim: BusinessClaim;
  onApprove: (claimId: string, locationId: string, userId: string, notes?: string) => void;
  onReject: (claimId: string, notes?: string) => void;
}) {
  const [notes, setNotes] = useState("");
  const [showActions, setShowActions] = useState(false);
  const location = claim.location as unknown as Location | undefined;
  const style = STATUS_STYLES[claim.status] || STATUS_STYLES.pending;
  const StatusIcon = style.icon;

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold">{claim.business_name}</h3>
            {location && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
                <MapPin className="size-3.5 shrink-0" />
                <span>
                  {location.name} — {location.city}, {location.state}
                </span>
              </div>
            )}
          </div>
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}
          >
            <StatusIcon className="size-3" />
            {claim.status}
          </span>
        </div>

        {/* Contact info */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="size-3.5 text-neutral-400" />
            <span>{claim.contact_email}</span>
          </div>
          {claim.contact_phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="size-3.5 text-neutral-400" />
              <span>{claim.contact_phone}</span>
            </div>
          )}
          {claim.verification_method && (
            <p className="text-xs text-muted-foreground">
              Role: {claim.verification_method}
            </p>
          )}
        </div>

        {/* Meta */}
        <p className="text-xs text-muted-foreground">
          Submitted {timeAgo(claim.created_at)}
          {claim.reviewed_at && ` · Reviewed ${timeAgo(claim.reviewed_at)}`}
        </p>

        {claim.admin_notes && (
          <p className="text-xs text-neutral-500 bg-neutral-50 rounded-lg p-2">
            Admin notes: {claim.admin_notes}
          </p>
        )}

        {/* Actions for pending claims */}
        {claim.status === "pending" && (
          <>
            {!showActions ? (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setShowActions(true)}
              >
                Review
              </Button>
            ) : (
              <div className="space-y-3 pt-1">
                <Input
                  placeholder="Admin notes (optional)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="h-9 text-sm"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white gap-1"
                    onClick={() =>
                      onApprove(
                        claim.id,
                        claim.location_id,
                        claim.user_id,
                        notes || undefined
                      )
                    }
                  >
                    <CheckCircle2 className="size-3.5" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-red-600 border-red-200 hover:bg-red-50 gap-1"
                    onClick={() => onReject(claim.id, notes || undefined)}
                  >
                    <XCircle className="size-3.5" />
                    Reject
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Admin Claims Page
// ---------------------------------------------------------------------------

export default function AdminClaimsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("pending");

  const { data: claims = [], isLoading } = useQuery({
    queryKey: ["admin-claims", filter],
    queryFn: () => fetchAllClaims(filter),
    enabled: !!user && user.id === ADMIN_ID,
  });

  const approveMutation = useMutation({
    mutationFn: ({
      claimId,
      locationId,
      userId,
      notes,
    }: {
      claimId: string;
      locationId: string;
      userId: string;
      notes?: string;
    }) => approveClaim(claimId, locationId, userId, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-claims"] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ claimId, notes }: { claimId: string; notes?: string }) =>
      rejectClaim(claimId, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-claims"] });
    },
  });

  // Auth loading
  if (authLoading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-14 w-full" />
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  // Not authorized
  if (!user || user.id !== ADMIN_ID) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <div className="rounded-full bg-red-50 p-5 mb-4">
          <ShieldCheck className="size-8 text-red-400" />
        </div>
        <h3 className="font-semibold mb-1">Not Authorized</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          You don&apos;t have permission to access this page.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-white pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-neutral-100">
        <div className="flex items-center gap-3 px-4 h-14">
          <Link
            href="/home"
            className="p-1 -ml-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <h1 className="text-base font-semibold">Claim Requests</h1>
        </div>
      </header>

      {/* Filter chips */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === f.value
                ? "bg-pink-500 text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="px-4 space-y-3">
        {isLoading ? (
          Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))
        ) : claims.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="rounded-full bg-neutral-100 p-5 mb-4">
              <ShieldCheck className="size-8 text-neutral-300" />
            </div>
            <h3 className="font-semibold mb-1">No claims</h3>
            <p className="text-sm text-muted-foreground">
              {filter === "pending"
                ? "No pending claims to review"
                : `No ${filter} claims found`}
            </p>
          </div>
        ) : (
          claims.map((claim) => (
            <ClaimCard
              key={claim.id}
              claim={claim}
              onApprove={(claimId, locationId, userId, notes) =>
                approveMutation.mutate({ claimId, locationId, userId, notes })
              }
              onReject={(claimId, notes) =>
                rejectMutation.mutate({ claimId, notes })
              }
            />
          ))
        )}

        {/* Mutation status */}
        {(approveMutation.isPending || rejectMutation.isPending) && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-neutral-900 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 shadow-lg">
            <Loader2 className="size-4 animate-spin" />
            Processing...
          </div>
        )}
      </div>
    </div>
  );
}

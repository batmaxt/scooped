"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  ArrowLeft,
  Store,
  CheckCircle2,
  Loader2,
  LogIn,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/providers/AuthProvider";
import { fetchLocationBySlug } from "@/queries/locations";
import { submitClaim, fetchUserClaims } from "@/queries/business";

// ---------------------------------------------------------------------------
// Not logged in
// ---------------------------------------------------------------------------

function NotLoggedIn() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
      <div className="rounded-full bg-pink-50 p-5 mb-5">
        <Store className="size-10 text-pink-400" />
      </div>
      <h2 className="text-xl font-bold mb-2">Claim Your Business</h2>
      <p className="text-sm text-muted-foreground max-w-xs mb-8 leading-relaxed">
        Sign in to claim and manage your ice cream shop on Scooped.
      </p>
      <Link href="/login">
        <Button
          size="lg"
          variant="brand"
          className="gap-2"
        >
          <LogIn className="size-4" />
          Sign In or Sign Up
        </Button>
      </Link>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Claim Form Inner (needs Suspense for useSearchParams)
// ---------------------------------------------------------------------------

function ClaimFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locationSlug = searchParams.get("location") || "";
  const { user } = useAuth();

  const [businessName, setBusinessName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [verificationMethod, setVerificationMethod] = useState("owner");
  const [submitted, setSubmitted] = useState(false);
  const [prefilled, setPrefilled] = useState(false);

  // Fetch location details
  const { data: location, isLoading: locationLoading } = useQuery({
    queryKey: ["location", locationSlug],
    queryFn: () => fetchLocationBySlug(locationSlug),
    enabled: !!locationSlug,
  });

  // Check if user already has a pending/approved claim for this location
  const { data: existingClaims = [] } = useQuery({
    queryKey: ["user-claims", user?.id],
    queryFn: () => fetchUserClaims(user!.id),
    enabled: !!user,
  });

  const existingClaimForLocation = existingClaims.find(
    (c) => c.location_id === location?.id
  );

  // Pre-fill business name from location
  if (location && !prefilled) {
    setBusinessName(location.name);
    setPrefilled(true);
  }

  const claimMutation = useMutation({
    mutationFn: () =>
      submitClaim({
        location_id: location!.id,
        user_id: user!.id,
        business_name: businessName.trim(),
        contact_email: contactEmail.trim(),
        contact_phone: contactPhone.trim() || undefined,
        verification_method: verificationMethod,
      }),
    onSuccess: () => setSubmitted(true),
  });

  if (!user) return <NotLoggedIn />;

  // No location slug provided
  if (!locationSlug) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <div className="rounded-full bg-neutral-100 p-5 mb-4">
          <Store className="size-8 text-neutral-400" />
        </div>
        <h3 className="font-semibold mb-1">No location selected</h3>
        <p className="text-sm text-muted-foreground max-w-xs mb-6">
          Visit a location page and tap &quot;Claim this business&quot; to get
          started.
        </p>
        <Link href="/discover">
          <Button variant="outline">Browse Locations</Button>
        </Link>
      </div>
    );
  }

  // Loading location
  if (locationLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="size-6 animate-spin text-pink-400" />
        <p className="text-sm text-muted-foreground">Loading location...</p>
      </div>
    );
  }

  // Location not found
  if (!location) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <p className="text-muted-foreground">Location not found</p>
        <Link href="/discover" className="mt-4">
          <Button variant="outline">Browse Locations</Button>
        </Link>
      </div>
    );
  }

  // Already claimed by someone else
  if (location.is_claimed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <div className="rounded-full bg-blue-50 p-5 mb-4">
          <CheckCircle2 className="size-8 text-blue-500" />
        </div>
        <h3 className="font-semibold mb-1">Already Claimed</h3>
        <p className="text-sm text-muted-foreground max-w-xs mb-6">
          {location.name} has already been claimed and verified.
        </p>
        <Link href={`/location/${location.slug}`}>
          <Button variant="outline">Back to Location</Button>
        </Link>
      </div>
    );
  }

  // User already submitted a claim for this location
  if (existingClaimForLocation) {
    const status = existingClaimForLocation.status;
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <div className="rounded-full bg-amber-50 p-5 mb-4">
          <Store className="size-8 text-amber-500" />
        </div>
        <h3 className="font-semibold mb-1">
          Claim {status === "pending" ? "Pending" : status === "rejected" ? "Rejected" : "Approved"}
        </h3>
        <p className="text-sm text-muted-foreground max-w-xs mb-6">
          {status === "pending"
            ? "Your claim for this location is being reviewed. We'll get back to you soon!"
            : status === "rejected"
              ? "Unfortunately your claim was not approved. Please contact support if you believe this is an error."
              : "Your claim has been approved! Head to your dashboard to manage your location."}
        </p>
        {status === "approved" ? (
          <Link href="/dashboard">
            <Button variant="brand">
              Go to Dashboard
            </Button>
          </Link>
        ) : (
          <Link href={`/location/${location.slug}`}>
            <Button variant="outline">Back to Location</Button>
          </Link>
        )}
      </div>
    );
  }

  // Success state
  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <div className="rounded-full bg-green-50 p-5 mb-5">
          <CheckCircle2 className="size-10 text-green-500" />
        </div>
        <h2 className="text-xl font-bold mb-2">Claim Submitted!</h2>
        <p className="text-sm text-muted-foreground max-w-xs mb-8 leading-relaxed">
          Your claim for <span className="font-medium">{location.name}</span> is
          pending review. We&apos;ll notify you once it&apos;s been processed.
        </p>
        <Link href={`/location/${location.slug}`}>
          <Button variant="outline">Back to Location</Button>
        </Link>
      </div>
    );
  }

  // Claim form
  const canSubmit =
    businessName.trim().length > 0 &&
    contactEmail.trim().length > 0 &&
    contactEmail.includes("@");

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-neutral-100">
        <div className="flex items-center gap-3 px-4 h-14">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-1 -ml-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-5" />
          </button>
          <h1 className="text-base font-semibold">Claim Business</h1>
        </div>
      </header>

      <div className="px-4 py-6 space-y-6">
        {/* Location card */}
        <div className="flex items-start gap-3 p-4 bg-neutral-50 rounded-xl">
          <div className="rounded-full bg-pink-100 p-2.5 shrink-0">
            <MapPin className="size-5 text-pink-500" />
          </div>
          <div>
            <h3 className="font-semibold">{location.name}</h3>
            <p className="text-sm text-muted-foreground">
              {location.address_line1}, {location.city}, {location.state}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">
              Business Name
            </label>
            <Input
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Your business name"
              className="h-11"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">
              Contact Email <span className="text-pink-500">*</span>
            </label>
            <Input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="you@business.com"
              className="h-11"
            />
            <p className="text-xs text-muted-foreground mt-1">
              We&apos;ll use this to verify your claim
            </p>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">
              Phone Number <span className="text-muted-foreground">(optional)</span>
            </label>
            <Input
              type="tel"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="(555) 123-4567"
              className="h-11"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">
              Your Role
            </label>
            <div className="space-y-2">
              {[
                { value: "owner", label: "I am the owner" },
                { value: "manager", label: "I am a manager" },
                { value: "other", label: "Other" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setVerificationMethod(option.value)}
                  className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-colors ${
                    verificationMethod === option.value
                      ? "border-pink-300 bg-pink-50 text-pink-700"
                      : "border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error */}
        {claimMutation.isError && (
          <p className="text-sm text-red-500">
            {claimMutation.error?.message || "Something went wrong. Please try again."}
          </p>
        )}

        {/* Submit */}
        <Button
          onClick={() => claimMutation.mutate()}
          disabled={!canSubmit || claimMutation.isPending}
          variant="brand-gradient"
          className="w-full h-12 text-base rounded-xl gap-2"
        >
          {claimMutation.isPending ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <Store className="size-5" />
          )}
          {claimMutation.isPending ? "Submitting..." : "Submit Claim"}
        </Button>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Page with Suspense wrapper
// ---------------------------------------------------------------------------

export default function ClaimPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="size-6 animate-spin text-pink-400" />
        </div>
      }
    >
      <ClaimFormInner />
    </Suspense>
  );
}

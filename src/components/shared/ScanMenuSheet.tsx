"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Camera,
  Loader2,
  Check,
  AlertCircle,
  ImagePlus,
  X,
  CircleAlert,
  Plus,
  CheckCircle2,
  IceCreamCone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useAuth } from "@/components/providers/AuthProvider";
import { reportSighting, createFlavorFromScan } from "@/queries/sightings";
import { fetchAllFlavorsForMatching } from "@/queries/checkins";
import { fetchLocationFlavors } from "@/queries/locations";
import { uploadMenuPhoto, saveMenuPhotoRecord } from "@/queries/menuPhotos";
import { checkImageSafety } from "@/lib/moderation/nsfwCheck";
import { matchFlavors, type FlavorMatch } from "@/lib/fuzzyMatch";

type ScanStep = "capture" | "processing" | "review" | "submitting" | "done";

interface ScanMenuSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locationId: string;
  locationName: string;
}

// Compress image to fit within Claude's 5MB base64 limit
function compressImage(file: File, maxSizeBytes = 4 * 1024 * 1024): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      // Scale down large images (max 2048px on longest side)
      const maxDim = 2048;
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        const scale = maxDim / Math.max(width, height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);

      // Try decreasing quality until under size limit
      let quality = 0.85;
      let dataUrl = canvas.toDataURL("image/jpeg", quality);
      while (dataUrl.length * 0.75 > maxSizeBytes && quality > 0.3) {
        quality -= 0.1;
        dataUrl = canvas.toDataURL("image/jpeg", quality);
      }
      resolve(dataUrl);
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function ScanMenuSheet({
  open,
  onOpenChange,
  locationId,
  locationName,
}: ScanMenuSheetProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<ScanStep>("capture");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [flavorMatches, setFlavorMatches] = useState<FlavorMatch[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(
    new Set()
  );
  const [selectedUnmatched, setSelectedUnmatched] = useState<Set<number>>(
    new Set()
  );
  const [addedFlavorIds, setAddedFlavorIds] = useState<Set<string>>(new Set());
  const [totalAdded, setTotalAdded] = useState(0);
  const [photosScanned, setPhotosScanned] = useState(0);

  // Fetch existing flavors at this location for dedup
  const { data: existingFlavors = [] } = useQuery({
    queryKey: ["location-flavors", locationId],
    queryFn: () => fetchLocationFlavors(locationId),
    enabled: open && !!locationId,
    staleTime: 30_000,
  });

  // Combine DB existing + locally added flavor IDs
  const existingFlavorIds = useMemo(() => {
    const ids = new Set<string>(addedFlavorIds);
    for (const f of existingFlavors) {
      const rec = f as Record<string, unknown>;
      if (rec.flavor_id) ids.add(rec.flavor_id as string);
    }
    return ids;
  }, [existingFlavors, addedFlavorIds]);

  // Reset state when sheet closes
  useEffect(() => {
    if (!open) {
      setStep("capture");
      setPhotoPreview(null);
      setPhotoFile(null);
      setError(null);
      setFlavorMatches([]);
      setSelectedIndices(new Set());
      setSelectedUnmatched(new Set());
      setAddedFlavorIds(new Set());
      setTotalAdded(0);
      setPhotosScanned(0);
    }
  }, [open]);

  const scanMutation = useMutation({
    mutationFn: async (imageBase64: string) => {
      const res = await fetch("/api/scan-menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageBase64 }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Scan failed");
      }
      return res.json() as Promise<{ flavors: string[] }>;
    },
    onSuccess: async (data) => {
      if (data.flavors.length === 0) {
        setError(
          "No flavors found in this image. Try a clearer photo of the menu."
        );
        setStep("capture");
        return;
      }
      const allFlavors = await fetchAllFlavorsForMatching();
      const matches = matchFlavors(data.flavors, allFlavors);
      setFlavorMatches(matches);

      // Pre-select only NEW flavors (not already at this location) with exact/high confidence
      const initial = new Set<number>();
      matches.forEach((m, i) => {
        if (!m.matchedFlavor) return;
        const isAlreadyHere = existingFlavorIds.has(m.matchedFlavor.id);
        if (
          !isAlreadyHere &&
          (m.confidence === "exact" || m.confidence === "high")
        ) {
          initial.add(i);
        }
      });
      setSelectedIndices(initial);
      setStep("review");
    },
    onError: (err: Error) => {
      setError(err.message);
      setStep("capture");
    },
  });

  const submitMutation = useMutation({
    mutationFn: async () => {
      let addedCount = 0;

      // 1. Report matched flavors that aren't already at this location
      const selected = flavorMatches.filter(
        (m, i) => selectedIndices.has(i) && m.matchedFlavor
      );
      const newFlavors = selected.filter(
        (m) => !existingFlavorIds.has(m.matchedFlavor!.id)
      );
      for (const match of newFlavors) {
        await reportSighting(
          locationId,
          match.matchedFlavor!.id,
          null,
          user?.id || null
        );
        addedCount++;
      }

      // 2. Create + report unmatched flavors that user selected
      const unmatchedToAdd = unmatchedItems.filter((_, i) =>
        selectedUnmatched.has(i)
      );
      for (const match of unmatchedToAdd) {
        try {
          const newFlavor = await createFlavorFromScan(match.extractedName);
          await reportSighting(
            locationId,
            newFlavor.id,
            null,
            user?.id || null
          );
          addedCount++;
        } catch (err) {
          console.error("Failed to create flavor:", match.extractedName, err);
        }
      }

      // 3. Upload the photo and save the record
      if (photoFile && user) {
        try {
          const photoUrl = await uploadMenuPhoto(user.id, photoFile);
          const allExtracted = flavorMatches.map((m) => m.displayName || m.extractedName);
          await saveMenuPhotoRecord(
            locationId,
            user.id,
            photoUrl,
            allExtracted,
            addedCount
          );
        } catch (err) {
          console.error("Failed to save menu photo:", err);
        }
      }

      return addedCount;
    },
    onSuccess: (newCount) => {
      setTotalAdded((prev) => prev + newCount);
      setPhotosScanned((prev) => prev + 1);

      // Track newly added flavor IDs for dedup in subsequent scans
      setAddedFlavorIds((prev) => {
        const next = new Set(prev);
        flavorMatches.forEach((m, i) => {
          if (selectedIndices.has(i) && m.matchedFlavor) {
            next.add(m.matchedFlavor.id);
          }
        });
        return next;
      });

      queryClient.invalidateQueries({
        queryKey: ["location-flavors", locationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["menu-photos", locationId],
      });

      setStep("done");
    },
  });

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Reset input so re-selecting same file works
      e.target.value = "";
      setError(null);

      if (!file.type.startsWith("image/")) {
        setError("Please select an image file.");
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setError("Image must be under 10 MB.");
        return;
      }

      // Preview
      setPhotoPreview(URL.createObjectURL(file));
      setPhotoFile(file);

      // NSFW check
      try {
        const moderation = await checkImageSafety(file);
        if (!moderation.safe) {
          setError(
            "This image was flagged by moderation. Please try another photo."
          );
          setPhotoPreview(null);
          setPhotoFile(null);
          return;
        }
      } catch {
        // Moderation check failed — allow the image through
      }

      // Compress and send to AI
      setStep("processing");
      try {
        const base64 = await compressImage(file);
        scanMutation.mutate(base64);
      } catch {
        setError("Failed to process the image.");
        setStep("capture");
      }
    },
    [scanMutation, existingFlavorIds]
  );

  const toggleSelection = useCallback((index: number) => {
    setSelectedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }, []);

  const toggleUnmatched = useCallback((index: number) => {
    setSelectedUnmatched((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }, []);

  const resetForAnotherScan = useCallback(() => {
    setStep("capture");
    setPhotoPreview(null);
    setPhotoFile(null);
    setFlavorMatches([]);
    setSelectedIndices(new Set());
    setSelectedUnmatched(new Set());
    setError(null);
  }, []);

  // Categorize matches
  const newMatches = flavorMatches.filter(
    (m) => m.matchedFlavor && !existingFlavorIds.has(m.matchedFlavor.id)
  );
  const alreadyHereMatches = flavorMatches.filter(
    (m) => m.matchedFlavor && existingFlavorIds.has(m.matchedFlavor.id)
  );
  const unmatchedItems = flavorMatches.filter((m) => !m.matchedFlavor);

  const selectedNewCount = [...selectedIndices].filter((i) => {
    const m = flavorMatches[i];
    return m?.matchedFlavor && !existingFlavorIds.has(m.matchedFlavor.id);
  }).length;
  const totalSelectedCount = selectedNewCount + selectedUnmatched.size;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-2xl max-h-[85vh] overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Camera className="size-5 text-[#F46B8F]" />
            Scan Menu
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-4 py-4">
          {/* Step: Capture */}
          {step === "capture" && (
            <>
              <p className="text-sm text-muted-foreground">
                Take a photo of the menu board at{" "}
                <span className="font-medium text-foreground">
                  {locationName}
                </span>{" "}
                and we&apos;ll extract the flavors automatically.
              </p>

              {photosScanned > 0 && (
                <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-lg px-3 py-2.5">
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                  <p className="text-sm text-emerald-700 dark:text-emerald-400">
                    {photosScanned} photo{photosScanned !== 1 ? "s" : ""}{" "}
                    scanned, {totalAdded} new flavor
                    {totalAdded !== 1 ? "s" : ""} added. Scan another section of
                    the menu!
                  </p>
                </div>
              )}

              {error && (
                <div className="flex items-start gap-2 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg px-3 py-2.5">
                  <AlertCircle className="size-4 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {error}
                  </p>
                  <button
                    onClick={() => setError(null)}
                    className="ml-auto shrink-0 text-red-400 hover:text-red-600"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-[rgba(93,64,55,0.12)] dark:border-[#332520]/50 rounded-2xl py-10 flex flex-col items-center gap-3 hover:bg-[#FFF3EE]/30 dark:hover:bg-[#332520]/10 transition-colors"
              >
                <div className="flex items-center justify-center size-14 rounded-full bg-[#FFF3EE] dark:bg-[#332520]/30">
                  <ImagePlus className="size-7 text-[#F46B8F]" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-[#2E1F1B] dark:text-[#FFF3EE]">
                    {photosScanned > 0
                      ? "Scan Another Photo"
                      : "Take Photo or Upload"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    JPG, PNG, or WebP &mdash; max 10 MB
                  </p>
                </div>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                capture="environment"
                onChange={handleFileSelect}
                className="hidden"
              />

              {photosScanned > 0 && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => onOpenChange(false)}
                >
                  Done Scanning
                </Button>
              )}
            </>
          )}

          {/* Step: Processing */}
          {step === "processing" && (
            <div className="flex flex-col items-center gap-4 py-4">
              {photoPreview && (
                <img
                  src={photoPreview}
                  alt="Menu photo"
                  className="w-full max-h-40 object-cover rounded-xl"
                />
              )}
              <div className="flex items-center gap-2.5">
                <Loader2 className="size-5 animate-spin text-[#F46B8F]" />
                <div>
                  <p className="text-sm font-medium">Scanning menu...</p>
                  <p className="text-xs text-muted-foreground">
                    This usually takes a few seconds.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step: Review */}
          {step === "review" && (
            <>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Found{" "}
                  <span className="font-semibold text-foreground">
                    {flavorMatches.length}
                  </span>{" "}
                  items on the menu.
                  {newMatches.length > 0 && (
                    <>
                      {" "}
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {newMatches.length} new
                      </span>{" "}
                      flavor{newMatches.length !== 1 ? "s" : ""} to add.
                    </>
                  )}
                </p>
              </div>

              {/* New flavors (selectable) */}
              {newMatches.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-1.5">
                    <Plus className="size-3" />
                    New Flavors ({newMatches.length})
                  </p>
                  <div className="space-y-1">
                    {flavorMatches.map((match, index) => {
                      if (
                        !match.matchedFlavor ||
                        existingFlavorIds.has(match.matchedFlavor.id)
                      )
                        return null;
                      const isSelected = selectedIndices.has(index);
                      return (
                        <button
                          key={index}
                          type="button"
                          onClick={() => toggleSelection(index)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
                            isSelected
                              ? "bg-emerald-50 dark:bg-emerald-950/20"
                              : "hover:bg-neutral-50 dark:hover:bg-neutral-800"
                          }`}
                        >
                          <div
                            className={`size-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                              isSelected
                                ? "bg-emerald-500 border-emerald-500"
                                : "border-neutral-300 dark:border-neutral-600"
                            }`}
                          >
                            {isSelected && (
                              <Check className="size-3 text-white" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {match.displayName}
                            </p>
                            <div className="flex items-center gap-1.5">
                              {match.extractedName !== match.displayName && (
                                <span className="text-xs text-muted-foreground truncate">
                                  from &ldquo;{match.extractedName}&rdquo;
                                </span>
                              )}
                              {match.matchedFlavor.brand && (
                                <span className="text-xs text-muted-foreground">
                                  {match.extractedName !== match.displayName
                                    ? " · "
                                    : ""}
                                  {match.matchedFlavor.brand.name}
                                </span>
                              )}
                            </div>
                          </div>
                          {match.confidence === "low" && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 shrink-0">
                              Possible
                            </span>
                          )}
                          {(match.confidence === "exact" ||
                            match.confidence === "high") && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 shrink-0">
                              Match
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Already at this location (non-selectable, greyed) */}
              {alreadyHereMatches.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="size-3" />
                    Already on Menu ({alreadyHereMatches.length})
                  </p>
                  <div className="space-y-1">
                    {flavorMatches.map((match, index) => {
                      if (
                        !match.matchedFlavor ||
                        !existingFlavorIds.has(match.matchedFlavor.id)
                      )
                        return null;
                      return (
                        <div
                          key={index}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg opacity-50"
                        >
                          <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-muted-foreground truncate">
                              {match.displayName}
                            </p>
                            {match.matchedFlavor.brand && (
                              <span className="text-xs text-muted-foreground">
                                {match.matchedFlavor.brand.name}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-muted-foreground shrink-0">
                            Already here
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Unmatched items (selectable — will create new flavors) */}
              {unmatchedItems.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2 flex items-center gap-1.5">
                    <Plus className="size-3" />
                    New to Database ({unmatchedItems.length})
                  </p>
                  <div className="space-y-1">
                    {unmatchedItems.map((match, i) => {
                      const isSelected = selectedUnmatched.has(i);
                      return (
                        <button
                          key={`unmatched-${i}`}
                          type="button"
                          onClick={() => toggleUnmatched(i)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
                            isSelected
                              ? "bg-amber-50 dark:bg-amber-950/20"
                              : "hover:bg-neutral-50 dark:hover:bg-neutral-800"
                          }`}
                        >
                          <div
                            className={`size-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                              isSelected
                                ? "bg-amber-500 border-amber-500"
                                : "border-neutral-300 dark:border-neutral-600"
                            }`}
                          >
                            {isSelected && (
                              <Check className="size-3 text-white" />
                            )}
                          </div>
                          <p className="text-sm font-medium truncate flex-1">
                            {match.extractedName}
                          </p>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 shrink-0">
                            New
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5 px-3">
                    These will be added as new flavors to the database.
                  </p>
                </div>
              )}

              {/* All flavors already here */}
              {newMatches.length === 0 && unmatchedItems.length === 0 && alreadyHereMatches.length > 0 && (
                <div className="bg-[#FFF3EE] dark:bg-[#332520]/20 rounded-xl p-4 text-center">
                  <IceCreamCone className="size-6 text-[#F46B8F] mx-auto mb-2" />
                  <p className="text-sm font-medium text-[#2E1F1B] dark:text-[#F5E6DC]">
                    All flavors are already on the menu!
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    No new flavors to add from this photo.
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-2 pt-2">
                {(newMatches.length > 0 || unmatchedItems.length > 0) && (
                  <Button
                    onClick={() => submitMutation.mutate()}
                    disabled={
                      totalSelectedCount === 0 || submitMutation.isPending
                    }
                    variant="brand"
                    className="w-full"
                  >
                    {submitMutation.isPending ? (
                      <Loader2 className="size-4 animate-spin mr-2" />
                    ) : (
                      <Plus className="size-4 mr-2" />
                    )}
                    {submitMutation.isPending
                      ? "Adding flavors..."
                      : `Add ${totalSelectedCount} Flavor${totalSelectedCount !== 1 ? "s" : ""}`}
                  </Button>
                )}

                <button
                  type="button"
                  onClick={resetForAnotherScan}
                  className="w-full text-sm text-[#F46B8F] hover:text-[#C4364A] py-2"
                >
                  {totalSelectedCount === 0 ? "Scan Another Photo" : "Retake Photo"}
                </button>
              </div>

              {submitMutation.isError && (
                <p className="text-xs text-red-500 text-center">
                  Failed to add flavors. Please try again.
                </p>
              )}
            </>
          )}

          {/* Step: Done */}
          {step === "done" && (
            <div className="flex flex-col items-center gap-4 py-6">
              <div className="flex items-center justify-center size-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                <CheckCircle2 className="size-8 text-emerald-500" />
              </div>
              <div className="text-center">
                <p className="font-bold text-[#2E1F1B] dark:text-[#F5E6DC]">
                  Menu updated!
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {totalAdded} new flavor{totalAdded !== 1 ? "s" : ""} added
                  from {photosScanned} photo{photosScanned !== 1 ? "s" : ""}
                </p>
              </div>

              <div className="w-full space-y-2 pt-2">
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={resetForAnotherScan}
                >
                  <Camera className="size-4" />
                  Scan Another Photo
                </Button>
                <Button
                  variant="brand"
                  className="w-full"
                  onClick={() => onOpenChange(false)}
                >
                  Done
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

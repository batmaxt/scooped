"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  IceCreamCone,
  Search,
  Loader2,
  Check,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useAuth } from "@/components/providers/AuthProvider";
import { reportSighting } from "@/queries/sightings";
import { fetchFlavors } from "@/queries/checkins";

interface ReportSightingSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locationId: string;
  locationName: string;
}

export function ReportSightingSheet({
  open,
  onOpenChange,
  locationId,
  locationName,
}: ReportSightingSheetProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedName, setSelectedName] = useState("");
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);

  const { data: flavors = [] } = useQuery({
    queryKey: ["flavor-search", search],
    queryFn: () => fetchFlavors(search),
    enabled: open && search.length > 0,
  });

  const mutation = useMutation({
    mutationFn: () =>
      reportSighting(locationId, selectedId!, selectedBrandId, user?.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["location-flavors", locationId] });
      onOpenChange(false);
      setSearch("");
      setSelectedId(null);
      setSelectedName("");
      setSelectedBrandId(null);
    },
  });

  const results = flavors.map((f: { id: string; name: string; brand_id?: string; brand?: { name: string } }) => ({
    id: f.id,
    name: f.name,
    brandId: f.brand_id,
    sub: f.brand?.name,
  }));

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl max-h-[85vh]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Eye className="size-5 text-pink-500" />
            Report a Sighting
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            Spotted a flavor at <span className="font-medium text-foreground">{locationName}</span>?
            Let others know!
          </p>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for a flavor..."
              className="pl-9 h-10"
            />
          </div>

          {/* Selected flavor */}
          {selectedId && (
            <div className="flex items-center gap-2 bg-pink-50 border border-pink-200 rounded-lg px-3 py-2">
              <Check className="size-4 text-pink-500" />
              <span className="text-sm font-medium">{selectedName}</span>
              <button
                type="button"
                onClick={() => {
                  setSelectedId(null);
                  setSelectedName("");
                  setSelectedBrandId(null);
                }}
                className="ml-auto text-xs text-pink-500 hover:text-pink-700"
              >
                Change
              </button>
            </div>
          )}

          {/* Results list */}
          {!selectedId && search.length > 0 && (
            <div className="max-h-48 overflow-y-auto space-y-1">
              {results.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No flavors found
                </p>
              ) : (
                results.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSelectedId(item.id);
                      setSelectedName(item.name);
                      setSelectedBrandId(item.brandId || null);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-neutral-50 transition-colors text-left"
                  >
                    <IceCreamCone className="size-4 text-pink-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      {item.sub && (
                        <p className="text-xs text-muted-foreground">{item.sub}</p>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          )}

          {/* Submit */}
          <Button
            onClick={() => mutation.mutate()}
            disabled={!selectedId || mutation.isPending}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white"
          >
            {mutation.isPending ? (
              <Loader2 className="size-4 animate-spin mr-2" />
            ) : (
              <Eye className="size-4 mr-2" />
            )}
            Report Sighting
          </Button>

          {mutation.isError && (
            <p className="text-xs text-red-500 text-center">
              Failed to report sighting. Please try again.
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

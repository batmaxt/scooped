"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  IceCreamCone,
  Tag,
  MapPin,
  Search,
  Loader2,
  Check,
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
import { createAlert } from "@/queries/alerts";
import { fetchFlavors } from "@/queries/checkins";
import { fetchBrands } from "@/queries/alerts";
import { fetchAllLocations } from "@/queries/locations";

type AlertTab = "flavor" | "brand" | "location";

const TABS: { value: AlertTab; label: string; icon: React.ElementType }[] = [
  { value: "flavor", label: "Flavor", icon: IceCreamCone },
  { value: "brand", label: "Brand", icon: Tag },
  { value: "location", label: "Location", icon: MapPin },
];

interface AddAlertSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: AlertTab;
  defaultTargetId?: string;
  defaultTargetName?: string;
}

export function AddAlertSheet({
  open,
  onOpenChange,
  defaultTab = "flavor",
  defaultTargetId,
  defaultTargetName,
}: AddAlertSheetProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<AlertTab>(defaultTab);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(
    defaultTargetId || null
  );
  const [selectedName, setSelectedName] = useState(defaultTargetName || "");

  // Search queries
  const { data: flavors = [] } = useQuery({
    queryKey: ["flavor-search", search],
    queryFn: () => fetchFlavors(search),
    enabled: tab === "flavor" && open && search.length > 0,
  });

  const { data: brands = [] } = useQuery({
    queryKey: ["brand-search", search],
    queryFn: () => fetchBrands(search),
    enabled: tab === "brand" && open && search.length > 0,
  });

  const { data: locations = [] } = useQuery({
    queryKey: ["all-locations"],
    queryFn: () => fetchAllLocations(),
    enabled: tab === "location" && open,
  });

  const filteredLocations = locations.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase())
  );

  const createMutation = useMutation({
    mutationFn: () =>
      createAlert(user!.id, tab, selectedId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-alerts"] });
      onOpenChange(false);
      setSearch("");
      setSelectedId(null);
      setSelectedName("");
    },
  });

  const handleTabChange = (newTab: AlertTab) => {
    setTab(newTab);
    setSearch("");
    setSelectedId(defaultTab === newTab ? defaultTargetId || null : null);
    setSelectedName(defaultTab === newTab ? defaultTargetName || "" : "");
  };

  const results: { id: string; name: string; sub?: string }[] =
    tab === "flavor"
      ? flavors.map((f: { id: string; name: string; brand?: { name: string } }) => ({
          id: f.id,
          name: f.name,
          sub: f.brand?.name,
        }))
      : tab === "brand"
        ? brands.map((b: { id: string; name: string }) => ({
            id: b.id,
            name: b.name,
          }))
        : filteredLocations
            .slice(0, 30)
            .map((l) => ({
              id: l.id,
              name: l.name,
              sub: `${l.city}, ${l.state}`,
            }));

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl max-h-[85vh]">
        <SheetHeader>
          <SheetTitle>Add Alert</SheetTitle>
        </SheetHeader>

        <div className="space-y-4 py-4">
          {/* Tab selector */}
          <div className="flex gap-2">
            {TABS.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => handleTabChange(t.value)}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    tab === t.value
                      ? "bg-pink-500 text-white"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  <Icon className="size-3.5" />
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${tab}s...`}
              className="pl-9 h-10"
            />
          </div>

          {/* Selected item */}
          {selectedId && (
            <div className="flex items-center gap-2 bg-pink-50 border border-pink-200 rounded-lg px-3 py-2">
              <Check className="size-4 text-pink-500" />
              <span className="text-sm font-medium">{selectedName}</span>
              <button
                type="button"
                onClick={() => {
                  setSelectedId(null);
                  setSelectedName("");
                }}
                className="ml-auto text-xs text-pink-500 hover:text-pink-700"
              >
                Change
              </button>
            </div>
          )}

          {/* Results */}
          {!selectedId && search.length > 0 && (
            <div className="max-h-48 overflow-y-auto space-y-1">
              {results.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No results found
                </p>
              ) : (
                results.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSelectedId(item.id);
                      setSelectedName(item.name);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-neutral-50 transition-colors text-left"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {item.name}
                      </p>
                      {item.sub && (
                        <p className="text-xs text-muted-foreground">
                          {item.sub}
                        </p>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          )}

          {/* Create button */}
          <Button
            onClick={() => createMutation.mutate()}
            disabled={!selectedId || createMutation.isPending}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white"
          >
            {createMutation.isPending ? (
              <Loader2 className="size-4 animate-spin mr-2" />
            ) : null}
            Create Alert
          </Button>

          {createMutation.isError && (
            <p className="text-xs text-red-500 text-center">
              Failed to create alert. Please try again.
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

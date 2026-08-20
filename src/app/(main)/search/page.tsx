"use client";

// The old Search tab merged into Discover (one omnibox: flavor, shop, or
// address). This route survives as a redirect so old links keep working.
import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchRedirect() {
  return (
    <Suspense fallback={null}>
      <SearchRedirectInner />
    </Suspense>
  );
}

function SearchRedirectInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const q = searchParams.get("q");
    router.replace(q ? `/discover?q=${encodeURIComponent(q)}` : "/discover");
  }, [router, searchParams]);

  return null;
}

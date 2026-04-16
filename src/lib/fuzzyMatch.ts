import type { Flavor } from "@/types/models";

export interface FlavorMatch {
  extractedName: string;
  matchedFlavor: Flavor | null;
  confidence: "exact" | "high" | "low" | "none";
  displayName: string;
}

function normalize(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[''`]/g, "")
    .replace(/-/g, " ")
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function wordsMatch(a: string, b: string): boolean {
  const wordsA = normalize(a).split(" ").filter(Boolean);
  const wordsB = new Set(normalize(b).split(" ").filter(Boolean));

  if (wordsA.length >= 2 && wordsA.every((w) => wordsB.has(w))) return true;

  const wordsASet = new Set(wordsA);
  const wordsBArr = normalize(b).split(" ").filter(Boolean);
  if (wordsBArr.length >= 2 && wordsBArr.every((w) => wordsASet.has(w)))
    return true;

  return false;
}

export function matchFlavors(
  extractedNames: string[],
  existingFlavors: Flavor[]
): FlavorMatch[] {
  return extractedNames.map((extractedName) => {
    const normalizedExtracted = normalize(extractedName);

    // Pass 1: Exact normalized match
    const exact = existingFlavors.find(
      (f) => normalize(f.name) === normalizedExtracted
    );
    if (exact) {
      return {
        extractedName,
        matchedFlavor: exact,
        confidence: "exact" as const,
        displayName: exact.name,
      };
    }

    // Pass 2: One name contains the other
    const contains = existingFlavors.find((f) => {
      const nf = normalize(f.name);
      return (
        (nf.includes(normalizedExtracted) && normalizedExtracted.length >= 4) ||
        (normalizedExtracted.includes(nf) && nf.length >= 4)
      );
    });
    if (contains) {
      return {
        extractedName,
        matchedFlavor: contains,
        confidence: "high" as const,
        displayName: contains.name,
      };
    }

    // Pass 3: Word overlap
    const wordMatch = existingFlavors.find((f) =>
      wordsMatch(extractedName, f.name)
    );
    if (wordMatch) {
      return {
        extractedName,
        matchedFlavor: wordMatch,
        confidence: "low" as const,
        displayName: wordMatch.name,
      };
    }

    return {
      extractedName,
      matchedFlavor: null,
      confidence: "none" as const,
      displayName: extractedName,
    };
  });
}

// Semantic flavor color system: a flavor's tile color should *feel like the
// flavor*. Keyword rules run in order — first match wins — with a warm-palette
// hash fallback for anything unrecognized.

interface FlavorRule {
  pattern: RegExp;
  color: string; // tile background
  emoji: string; // tile glyph
}

const FLAVOR_RULES: FlavorRule[] = [
  { pattern: /mint|pistachio|matcha|green tea|avocado/i, color: "#A8D5B5", emoji: "🌿" },
  { pattern: /chocolate|fudge|brownie|cocoa|mocha|oreo|cookies\s*(&|and)\s*cream/i, color: "#8B5E3C", emoji: "🍫" },
  { pattern: /coffee|espresso|latte|cold brew/i, color: "#A47551", emoji: "☕" },
  { pattern: /strawberry|raspberry|cherry|watermelon|guava|hibiscus/i, color: "#F49FB6", emoji: "🍓" },
  { pattern: /blueberry|blackberry|grape|lavender|ube|taro|black raspberry/i, color: "#B79FD4", emoji: "🫐" },
  { pattern: /mango|peach|orange|apricot|passion\s*fruit|creamsicle|cantaloupe/i, color: "#FBBF77", emoji: "🥭" },
  { pattern: /lemon|banana|pineapple|key lime|citrus/i, color: "#F7E08C", emoji: "🍋" },
  { pattern: /caramel|butterscotch|dulce|toffee|praline|butter pecan|brown butter/i, color: "#D9A05B", emoji: "🍮" },
  { pattern: /peanut|almond|hazelnut|cashew|walnut|pecan|nut/i, color: "#C9A176", emoji: "🥜" },
  { pattern: /cookie dough|cookie|graham|cinnamon|snicker|churro|gingerbread/i, color: "#D7B98E", emoji: "🍪" },
  { pattern: /birthday|cake|confetti|sprinkle|cotton candy|bubble\s*gum|superman|rainbow/i, color: "#F6B8D0", emoji: "🎂" },
  { pattern: /vanilla|sweet cream|custard|cheesecake|milk|fior/i, color: "#F3E5C9", emoji: "🍦" },
  { pattern: /pumpkin|sweet potato|maple|apple|pie/i, color: "#E0965F", emoji: "🥧" },
  { pattern: /coconut/i, color: "#EDE3D4", emoji: "🥥" },
  { pattern: /honey|honeycomb/i, color: "#EFC15C", emoji: "🍯" },
  { pattern: /sorbet|sherbet|ice|icee/i, color: "#9FD8DB", emoji: "🧊" },
];

// Warm fallback palette for unmatched names
export const FLAVOR_COLORS = [
  "#F2B45A", "#F49FB6", "#A8D5B5", "#D9A05B",
  "#B79FD4", "#F3E5C9", "#FBBF77", "#9FD8DB",
];

function hashOf(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return Math.abs(hash);
}

function ruleFor(name: string): FlavorRule | null {
  for (const rule of FLAVOR_RULES) {
    if (rule.pattern.test(name)) return rule;
  }
  return null;
}

export function flavorColor(name: string): string {
  const rule = ruleFor(name);
  if (rule) return rule.color;
  return FLAVOR_COLORS[hashOf(name) % FLAVOR_COLORS.length];
}

export function flavorEmoji(name: string): string {
  return ruleFor(name)?.emoji ?? "🍨";
}

export const CATEGORY_LABELS: Record<string, string> = {
  ice_cream: "Ice Cream",
  classic: "Classic",
  chocolate: "Chocolate",
  fruit: "Fruit",
  nut: "Nut",
  novelty: "Novelty",
  dairy_free: "Dairy Free",
  non_dairy: "Non-Dairy",
  sorbet: "Sorbet",
  gelato: "Gelato",
  soft_serve: "Soft Serve",
  italian_ice: "Italian Ice",
  frozen_treat: "Frozen Treat",
  other: "Other",
};

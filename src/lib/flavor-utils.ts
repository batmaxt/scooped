// Semantic flavor tile system: a flavor's color and emoji should *feel like
// the flavor*. SPECIALS (famous names, fun mappings) are checked first, then
// general family RULES — first match wins — with a warm hash fallback.

type FlavorRule = [pattern: RegExp, color: string, emoji: string];

// Hand-crafted mappings for famous flavors — the fun layer
const SPECIALS: FlavorRule[] = [
  [/planet earth/i, "#7CC9B4", "🌍"],
  [/phish food/i, "#8B5E3C", "🐟"],
  [/fudgie the whale/i, "#8B5E3C", "🐳"],
  [/flying saucer/i, "#8B5E3C", "🛸"],
  [/everything bagel/i, "#D7B98E", "🥯"],
  [/chubby hubby|pretzel/i, "#D7B98E", "🥨"],
  [/nutella|gianduja/i, "#A47551", "🌰"],
  [/cornbread/i, "#F2B45A", "🌽"],
  [/pear\b/i, "#C9D8A3", "🍐"],
  [/olive oil/i, "#B5CDA3", "🫒"],
  [/americone/i, "#D7B98E", "🦅"],
  [/netflix/i, "#F3E5C9", "🍿"],
  [/half baked|tonight dough|munchies|brookie/i, "#D7B98E", "🍪"],
  [/love potion/i, "#F49FB6", "💘"],
  [/one love|sweet nothings|lil'? love|lunchbox love/i, "#F49FB6", "💌"],
  [/black sesame/i, "#B8B8B8", "🖤"],
  [/captain|cap'n|sailor|nautical/i, "#F2B45A", "⚓"],
  [/starkiss/i, "#F08080", "⭐"],
  [/daiquiri|margarita|pina colada|piña colada/i, "#9FD8DB", "🍹"],
  [/blizzard|snowstorm|frosty/i, "#9FD8DB", "❄️"],
  [/neapolitan|spumoni/i, "#F6B8D0", "🍨"],
  [/rainbow/i, "#F6B8D0", "🌈"],
  [/superman|unicorn/i, "#B79FD4", "🦄"],
  [/campfire|happy camper/i, "#E0965F", "🔥"],
  [/candy fish|swedish fish/i, "#F08080", "🐠"],
  [/flapjack|pancake/i, "#D9A05B", "🥞"],
  [/moon tracks|moon\b/i, "#B8B8C8", "🌙"],
  [/out of this swirl|galaxy|cosmic|stargazer/i, "#B79FD4", "🪐"],
  [/tax crunch/i, "#7CC9B4", "💰"],
  [/founder'?s favorite/i, "#F2B45A", "🏆"],
  [/buckeye/i, "#C9915B", "🥜"],
  [/sour apple|green apple/i, "#B5CDA3", "🍏"],
  [/tropical/i, "#FBBF77", "🌺"],
  [/cookiewich|sandwich/i, "#D7B98E", "🥪"],
  [/hot toddy/i, "#C9915B", "🥃"],
  [/jamoca|java/i, "#A47551", "☕"],
  [/creme brulee|crème brûlée/i, "#D9A05B", "🍮"],
  [/cannoli/i, "#F3E5C9", "🥐"],
  [/spilled silk|silk\b/i, "#F3E5C9", "🥛"],
  [/royale?\b|royal\b|\bking\b|\bqueen\b|crown|majesty/i, "#EFC15C", "👑"],
  [/salt/i, "#D9A05B", "🧂"],
  [/monkey/i, "#F5E27A", "🐒"],
  [/moose tracks|bear paw|bear claw/i, "#8B5E3C", "🐻"],
  [/death by|graveyard|zombie/i, "#8B5E3C", "🪦"],
  [/monster/i, "#A8D5B5", "👹"],
  [/fireworks/i, "#C4364A", "🎆"],
  [/float\b|black cow/i, "#C9915B", "🥤"],
  [/mousse|moose/i, "#8B5E3C", "🫎"],
];

// General flavor-family rules — order matters, first match wins
const RULES: FlavorRule[] = [
  [/rocky road/i, "#8B5E3C", "🪨"],
  [/gold medal/i, "#EFC15C", "🥇"],
  [/cotton candy/i, "#F6B8D0", "🍭"],
  [/bubble\s*gum/i, "#F6B8D0", "🫧"],
  [/marshmallow|s'?mores/i, "#EDE3D4", "🍫"],
  [/cheesecake/i, "#F3E5C9", "🍰"],
  [/red velvet|tres leches|tiramisu/i, "#D98A8A", "🍰"],
  [/maple/i, "#C97B3D", "🍁"],
  [/pumpkin|sweet potato/i, "#E0965F", "🎃"],
  [/pineapple/i, "#F7D96B", "🍍"],
  [/\bapple|cobbler|\bpie\b/i, "#E0965F", "🥧"],
  [/banana/i, "#F5E27A", "🍌"],
  [/cherr/i, "#C25B7C", "🍒"],
  [/watermelon/i, "#F08080", "🍉"],
  [/peach|apricot/i, "#FBBF9B", "🍑"],
  [/black raspberry|black razz?berry/i, "#B79FD4", "🫐"],
  [/raspberry|razz?berry|cranberry/i, "#D65C7A", "🫐"],
  [/strawberry|guava|hibiscus/i, "#F49FB6", "🍓"],
  [/blueberry|blackberry|huckleberry|marionberry|boysenberry|brambleberry|mulberry|wildberry|\bberry\b|berries/i, "#B79FD4", "🫐"],
  [/grape|raisin|\bfig\b|plum/i, "#9B7BB8", "🍇"],
  [/ube|taro/i, "#B79FD4", "🍠"],
  [/lavender|violet|rose\b|floral/i, "#C9B8E8", "🪻"],
  [/mango|passion\s*fruit|papaya/i, "#FBBF77", "🥭"],
  [/orange|creamsicle|tangerine|citrus/i, "#FBAE5C", "🍊"],
  [/lemon|key lime|lime\b|yuzu/i, "#F7E08C", "🍋"],
  [/coconut/i, "#EDE3D4", "🥥"],
  [/matcha|green tea/i, "#A8D5B5", "🍵"],
  [/mint/i, "#A8D5B5", "🌿"],
  [/pistachio/i, "#B5CDA3", "🥜"],
  [/avocado/i, "#A8D5B5", "🥑"],
  [/\brum\b|bourbon|whiskey|bailey|amaretto|brandy|champagne/i, "#C9915B", "🥃"],
  [/coffee|espresso|latte|cold brew|cappuccino|mocha/i, "#A47551", "☕"],
  [/chai|earl grey|london fog|\btea\b/i, "#C9A87C", "🍵"],
  [/honey|brown sugar/i, "#EFC15C", "🍯"],
  [/caramel|butterscotch|dulce|toffee|praline/i, "#D9A05B", "🍯"],
  [/peanut butter|\bpb\b/i, "#C9915B", "🥜"],
  [/butter pecan|pecan|walnut|almond|hazelnut|cashew|macadamia|\bnut\b/i, "#C9A176", "🥜"],
  [/birthday|cake batter|cake mix|confetti|funfetti|sprinkle|celebration|party/i, "#F6B8D0", "🎂"],
  [/cookie|oreo|biscoff|graham|snicker|churro|gingerbread|cinnamon|waffle|donut|doughnut|\bdough\b/i, "#D7B98E", "🍪"],
  [/brownie|fudge|chocolate|chokolat|cocoa|cacao|devil|midnight|\bmud\b/i, "#8B5E3C", "🍫"],
  [/egg\s*nog/i, "#F3E5C9", "🥛"],
  [/\bcake\b|icing/i, "#F3E5C9", "🍰"],
  [/vanilla|sweet cream|custard|fior|panna|milk\b|cream\b/i, "#F3E5C9", "🍦"],
  [/sorbet|sherbet|sherbert|italian ice|\bice\b|icee/i, "#9FD8DB", "🧊"],
  [/lemonade|punch|soda|root beer|cola/i, "#F7E08C", "🥤"],
  [/candy|crunch|butterfinger|heath|m&m|reese/i, "#F2B45A", "🍬"],
  [/\bbar\b/i, "#8B5E3C", "🍫"],
];

const ALL_RULES: FlavorRule[] = [...SPECIALS, ...RULES];

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
  for (const rule of ALL_RULES) {
    if (rule[0].test(name)) return rule;
  }
  return null;
}

export function flavorColor(name: string): string {
  const rule = ruleFor(name);
  if (rule) return rule[1];
  return FLAVOR_COLORS[hashOf(name) % FLAVOR_COLORS.length];
}

export function flavorEmoji(name: string): string {
  return ruleFor(name)?.[2] ?? "🍨";
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

// Categories worth showing as a chip on flavor cards: dietary and format info
// only. Taste-family categories (fruit/nut/chocolate/novelty) are noise — the
// tile already communicates the flavor family.
export const INFORMATIVE_CATEGORIES = new Set([
  "dairy_free",
  "non_dairy",
  "sorbet",
  "gelato",
  "soft_serve",
  "italian_ice",
]);

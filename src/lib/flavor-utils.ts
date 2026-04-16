export const FLAVOR_COLORS = [
  "#8B6914", "#F2B45A", "#F46B8F", "#6B8E5A",
  "#9B6B9E", "#C4447A", "#D4956A", "#7A9EC4",
];

export function flavorColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return FLAVOR_COLORS[Math.abs(hash) % FLAVOR_COLORS.length];
}

export const FLAVOR_IMAGES = [
  "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1514849302-984523450cf4?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1560008581-09826d1de69e?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1576506295286-5cda18df43e7?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1579954115563-e72bf1381629?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1517093157656-b9eccef91cb1?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=200&q=80",
];

export function flavorImage(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return FLAVOR_IMAGES[Math.abs(hash) % FLAVOR_IMAGES.length];
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

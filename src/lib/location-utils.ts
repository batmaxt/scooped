// Warm gradient pairs for location monogram tiles — used when a location has
// no photo of its own. Honest branding beats a stock-photo lottery.
const MONOGRAM_GRADIENTS: [string, string][] = [
  ["#F46B8F", "#C4364A"],
  ["#F2B45A", "#D4956A"],
  ["#7CC9B4", "#4A9B84"],
  ["#B79FD4", "#8E6FB8"],
  ["#FBBF77", "#E0965F"],
];

export function monogramGradient(name: string): [string, string] {
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return MONOGRAM_GRADIENTS[Math.abs(hash) % MONOGRAM_GRADIENTS.length];
}

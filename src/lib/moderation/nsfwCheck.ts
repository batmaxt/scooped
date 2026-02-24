import * as nsfwjs from "nsfwjs";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ModerationResult {
  safe: boolean;
  flaggedCategory?: string;
  confidence?: number;
}

export class ModerationError extends Error {
  public flaggedCategory: string;
  public confidence: number;

  constructor(category: string, confidence: number) {
    super(
      "This image was flagged as potentially inappropriate and cannot be uploaded."
    );
    this.name = "ModerationError";
    this.flaggedCategory = category;
    this.confidence = confidence;
  }
}

// ---------------------------------------------------------------------------
// Singleton model (lazy loaded)
// ---------------------------------------------------------------------------

let modelPromise: Promise<nsfwjs.NSFWJS> | null = null;

function getModel(): Promise<nsfwjs.NSFWJS> {
  if (!modelPromise) {
    modelPromise = nsfwjs.load("MobileNetV2");
  }
  return modelPromise;
}

// ---------------------------------------------------------------------------
// Thresholds — NSFWJS returns: Drawing, Hentai, Neutral, Porn, Sexy
// ---------------------------------------------------------------------------

const THRESHOLDS: Record<string, number> = {
  Porn: 0.3,
  Hentai: 0.3,
  Sexy: 0.7,
};

// ---------------------------------------------------------------------------
// Main check function
// ---------------------------------------------------------------------------

export async function checkImageSafety(file: File): Promise<ModerationResult> {
  const img = await fileToImage(file);

  try {
    const model = await getModel();
    const predictions = await model.classify(img);

    for (const pred of predictions) {
      const threshold = THRESHOLDS[pred.className];
      if (threshold !== undefined && pred.probability > threshold) {
        return {
          safe: false,
          flaggedCategory: pred.className,
          confidence: pred.probability,
        };
      }
    }

    return { safe: true };
  } finally {
    URL.revokeObjectURL(img.src);
  }
}

// ---------------------------------------------------------------------------
// Helper: File -> HTMLImageElement
// ---------------------------------------------------------------------------

function fileToImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () =>
      reject(new Error("Failed to load image for moderation check"));
    img.src = URL.createObjectURL(file);
  });
}

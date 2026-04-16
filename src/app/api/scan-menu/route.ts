import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const EXTRACTION_PROMPT = `You are analyzing a photo of an ice cream shop's menu board or display case.

Extract ONLY the ice cream flavor names from this image. Return them as a JSON array of strings.

Rules:
- Return ONLY flavor names, not prices, sizes, descriptions, or toppings
- Clean up each name: proper capitalization, no trailing punctuation
- If a flavor has a brand prefix on the menu (e.g. "Van Leeuwen - Pistachio"), include ONLY the flavor name ("Pistachio")
- Combine multi-line flavor names into one string (e.g. "Salted\\nCaramel" becomes "Salted Caramel")
- Include dairy-free, vegan, sorbet, and gelato items -- they are flavors too
- If you see size/price info (e.g. "SM $4 / LG $6"), ignore it
- If you see section headers like "TODAY'S FLAVORS" or "GELATO", do not include those as flavors
- If the image is not a menu or contains no recognizable flavor names, return an empty array []
- Do NOT hallucinate or guess flavors that are not clearly visible in the image

Respond with ONLY the JSON array, no other text. Example: ["Vanilla Bean", "Chocolate Fudge", "Strawberry Sorbet"]`;

function parseFlavorResponse(text: string): string[] {
  try {
    const parsed = JSON.parse(text.trim());
    if (Array.isArray(parsed)) {
      return parsed
        .filter((item): item is string => typeof item === "string")
        .map((s) => s.trim())
        .filter((s) => s.length > 0 && s.length < 100);
    }
  } catch {
    // Try extracting JSON array from surrounding text
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        if (Array.isArray(parsed)) {
          return parsed
            .filter((item): item is string => typeof item === "string")
            .map((s) => s.trim())
            .filter((s) => s.length > 0 && s.length < 100);
        }
      } catch {
        // Fall through
      }
    }
  }
  return [];
}

export async function POST(request: Request) {
  // Auth check
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { error: "Authentication required", code: "AUTH_REQUIRED" },
      { status: 401 }
    );
  }

  // Validate API key is configured
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey === "your-anthropic-api-key-here") {
    return NextResponse.json(
      { error: "AI scanning is not configured yet", code: "NOT_CONFIGURED" },
      { status: 500 }
    );
  }

  // Parse request
  let body: { image?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body", code: "INVALID_BODY" },
      { status: 400 }
    );
  }

  const { image } = body;
  if (!image || typeof image !== "string") {
    return NextResponse.json(
      { error: "Image data is required", code: "MISSING_IMAGE" },
      { status: 400 }
    );
  }

  // Extract base64 data and media type
  const match = image.match(
    /^data:(image\/(jpeg|png|webp|gif));base64,(.+)$/
  );
  if (!match) {
    return NextResponse.json(
      { error: "Invalid image format", code: "INVALID_FORMAT" },
      { status: 400 }
    );
  }
  const mediaType = match[1] as
    | "image/jpeg"
    | "image/png"
    | "image/webp"
    | "image/gif";
  const base64Data = match[3];

  // Call Claude Vision
  try {
    const anthropic = new Anthropic({ apiKey });

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType,
                data: base64Data,
              },
            },
            {
              type: "text",
              text: EXTRACTION_PROMPT,
            },
          ],
        },
      ],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";
    const flavors = parseFlavorResponse(text);

    return NextResponse.json({ flavors });
  } catch (err: unknown) {
    if (err instanceof Anthropic.RateLimitError) {
      return NextResponse.json(
        {
          error: "Too many requests. Please try again in a moment.",
          code: "RATE_LIMITED",
        },
        { status: 429 }
      );
    }
    console.error("Claude Vision API error:", err);
    return NextResponse.json(
      { error: "Failed to analyze the menu photo", code: "AI_ERROR" },
      { status: 500 }
    );
  }
}

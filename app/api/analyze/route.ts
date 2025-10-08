import { NextRequest, NextResponse } from "next/server";

type NutritionData = {
  protein?: number;
  carbs?: number;
  fat?: number;
  calories?: number;
  foodItems?: Array<{
    name?: string;
    quantity?: string;
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  }>;
};

export async function POST(request: NextRequest) {
  try {
    // get form data from the frontend
    const formData = await request.formData();
    const image = formData.get("image") as File | null;

    if (!image) {
      console.error("[api/analyze] No image found in request FormData");
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // ✅ webhook url from .env.local
    const webhookUrl = process.env.WEBHOOK_URL;
    if (!webhookUrl) {
      throw new Error("Missing WEBHOOK_URL in environment variables");
    }

    console.log("[api/analyze] Sending image to webhook:", webhookUrl);
    console.log("[api/analyze] Image meta:", { name: image.name, type: image.type, size: image.size });

    // Build formdata to forward to n8n webhook
    const webhookFormData = new FormData();
    webhookFormData.append("image", image as any, (image as any).name);

    // Forward to webhook
    const webhookResp = await fetch(webhookUrl, {
      method: "POST",
      body: webhookFormData,
    });

    const text = await webhookResp.text();

    // Try to parse JSON response
    let parsed: any = null;
    try {
      parsed = text ? JSON.parse(text) : null;
    } catch {
      console.warn("[api/analyze] Webhook response is not valid JSON. Returning raw text.");
      parsed = { raw: text };
    }

    // Normalize response if n8n wraps body
    let nutritionData: NutritionData = parsed;
    if (Array.isArray(parsed) && parsed.length > 0) {
      nutritionData = parsed[0]?.body ?? parsed[0] ?? parsed;
    } else if (parsed?.body) {
      nutritionData = parsed.body;
    }

    console.log("[api/analyze] Nutrition data to frontend:", JSON.stringify(nutritionData).slice(0, 2000));

    return NextResponse.json(nutritionData);
  } catch (error: any) {
    console.error("[api/analyze] Error:", error?.message ?? error);
    return NextResponse.json(
      { error: error?.message ?? "Analyze failed", details: String(error) },
      { status: 500 }
    );
  }
}

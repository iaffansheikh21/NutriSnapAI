import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get("image") as File

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    const webhookUrl = process.env.WEBHOOK_URL || "http://localhost:5678/webhook-test/meal-ai"
    console.log("[v0] Sending image to webhook:", webhookUrl)
    console.log("[v0] Image details:", { name: image.name, type: image.type, size: image.size })

    const webhookFormData = new FormData()
    webhookFormData.append("image", image)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

    let response
    try {
      response = await fetch(webhookUrl, {
        method: "POST",
        body: webhookFormData,
        signal: controller.signal,
      })
      clearTimeout(timeoutId)
    } catch (fetchError: any) {
      clearTimeout(timeoutId)
      console.error("[v0] Fetch error details:", {
        message: fetchError.message,
        name: fetchError.name,
        cause: fetchError.cause,
      })

      if (fetchError.name === "AbortError") {
        throw new Error("Request timed out after 30 seconds")
      }

      throw new Error(`Network error: ${fetchError.message}. Make sure the webhook at ${webhookUrl} is accessible.`)
    }

    console.log("[v0] Response status:", response.status, response.statusText)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Webhook error response:", errorText)
      throw new Error(`Webhook request failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log("[v0] Webhook response:", JSON.stringify(data, null, 2))

    // Response is an array with one object containing an "output" property
    if (!Array.isArray(data) || data.length === 0 || !data[0].output) {
      throw new Error("Invalid response format from webhook")
    }

    const output = data[0].output

    if (output.status !== "success") {
      throw new Error("Analysis failed")
    }

    const nutritionData = {
      calories: output.total.calories,
      protein: output.total.protein,
      carbs: output.total.carbs,
      fat: output.total.fat,
      foodItems: output.food.map((item: any) => ({
        name: item.name,
        quantity: item.quantity,
        calories: item.calories,
        protein: item.protein,
        carbs: item.carbs,
        fat: item.fat,
      })),
    }

    return NextResponse.json(nutritionData)
  } catch (error: any) {
    console.error("[v0] Error in analyze API:", error.message)
    console.error("[v0] Full error:", error)
    return NextResponse.json(
      {
        error: error.message || "Failed to analyze image",
        details: "Check server logs for more information",
      },
      { status: 500 },
    )
  }
}

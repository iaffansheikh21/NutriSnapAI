"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Camera, Upload, Sparkles, Loader2, Zap, TrendingUp, Shield } from "lucide-react"
import { NutritionResults } from "@/components/nutrition-results"

interface FoodItem {
  name: string
  quantity: string
  calories: number
  protein: number
  carbs: number
  fat: number
}

interface NutritionData {
  protein: number
  carbs: number
  fat: number
  calories: number
  foodItems: FoodItem[]
  error?: string // Optional error property
}

export function NutriSnapHero() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [nutritionData, setNutritionData] = useState<NutritionData | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string)
      analyzeImage(file)
    }
    reader.readAsDataURL(file)
  }
const analyzeImage = async (file: File) => {
  setIsAnalyzing(true)
  setNutritionData(null)

  try {
    const formData = new FormData()
    formData.append("image", file)

    const response = await fetch("/api/analyze", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Failed to analyze image")
    }

    const json = await response.json()
    console.log("🔍 Agent response:", json)

    // ✅ Handle the correct response format from your backend
    if (json?.output?.status === "success") {
      const formatted = {
        calories: json.output.total.calories,
        protein: json.output.total.protein,
        carbs: json.output.total.carbs,
        fat: json.output.total.fat,
        foodItems: json.output.food || [],
      }

      console.log("✅ Formatted nutrition data:", formatted)
      setNutritionData(formatted)
    } else if (json?.code === 404) {
      alert("⚠️ Webhook not active. Please click 'Execute Workflow' in n8n or activate your workflow.")
      setNutritionData(null)
    } else {
      console.error("❌ Unexpected response format:", json)
      throw new Error("Invalid agent response format")
    }
  } catch (error) {
    console.error("Error analyzing image:", error)
    setNutritionData({
      protein: 0,
      carbs: 0,
      fat: 0,
      calories: 0,
      foodItems: [],
      error: "Analysis failed. Check console for details.",
    })
  } finally {
    setIsAnalyzing(false)
  }
}


  const handleReset = () => {
    setSelectedImage(null)
    setNutritionData(null)
    setIsAnalyzing(false)
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {!selectedImage && (
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
          <img
            src="/colorful-healthy-meal-bowl-with-fresh-vegetables--.jpg"
            alt="Hero background"
            className="w-full h-full object-cover opacity-40"
          />
        </div>
      )}

      {/* Content */}
      <div className="relative z-20">
        <header className="border-b border-border/40 backdrop-blur-md bg-background/50">
          <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <span className="text-lg sm:text-xl font-bold">NutriSnap AI</span>
            </div>
          </div>
        </header>

        <section className="container mx-auto px-4 sm:px-6">
          {!selectedImage ? (
            <div className="min-h-[calc(100vh-73px)] flex flex-col items-center justify-center py-12 sm:py-16">
              <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8 mb-8 sm:mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
                  <Zap className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-primary">AI-Powered Nutrition Analysis</span>
                </div>

                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-balance leading-[1.1]">
                  Snap. Analyze.
                  <span className="block text-primary mt-2">Track.</span>
                </h1>

                <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto text-pretty font-medium leading-relaxed">
                  Get instant macronutrient breakdowns from any meal photo. No manual entry, no guesswork.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 sm:pt-6">
                  <Button
                    size="lg"
                    className="gap-3 text-lg font-bold h-14 px-8 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 hover:scale-105 w-full sm:w-auto"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-6 w-6" />
                    Analyze My Meal
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="gap-3 text-lg font-semibold h-14 px-8 border-2 hover:bg-accent transition-all hover:scale-105 w-full sm:w-auto bg-transparent"
                    onClick={() => cameraInputRef.current?.click()}
                  >
                    <Camera className="h-6 w-6" />
                    Take Photo
                  </Button>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-6 pt-8 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    <span>Instant Results</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <span>95% Accuracy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    <span>Privacy First</span>
                  </div>
                </div>
              </div>

              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} title="Upload an image file" />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
                title="Take a photo"
              />

              <div className="max-w-5xl mx-auto mt-16 sm:mt-24 grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5 group">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-bold text-lg">AI-Powered</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Advanced computer vision analyzes your meals with 95% accuracy
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5 group">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <Zap className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-bold text-lg">Instant Results</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Get detailed nutrition breakdown in seconds, not minutes
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5 group">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <Camera className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-bold text-lg">Easy to Use</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Simply snap or upload a photo - no manual entry required
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          ) : (
            <div className="py-8 sm:py-12">
              <div className="max-w-3xl mx-auto space-y-6">
                <Card className="p-4 sm:p-6 border-border/50 bg-card/80 backdrop-blur-sm shadow-xl">
                  <div className="relative aspect-video rounded-xl overflow-hidden mb-6 shadow-lg">
                    <img
                      src={selectedImage || "/placeholder.svg"}
                      alt="Selected meal"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {isAnalyzing && (
                    <div className="flex flex-col items-center justify-center gap-4 py-12">
                      <div className="relative">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        <div className="absolute inset-0 h-12 w-12 animate-ping text-primary/20">
                          <Loader2 className="h-12 w-12" />
                        </div>
                      </div>
                      <div className="text-center space-y-2">
                        <p className="text-xl font-bold">Analyzing your meal...</p>
                        <p className="text-sm text-muted-foreground">This will only take a moment</p>
                      </div>
                    </div>
                  )}

                  {nutritionData && !isAnalyzing && <NutritionResults data={nutritionData} />}

                  <Button
                    variant="outline"
                    className="w-full mt-6 h-12 text-base font-semibold hover:bg-accent transition-all bg-transparent"
                    onClick={handleReset}
                  >
                    Analyze Another Meal
                  </Button>
                </Card>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

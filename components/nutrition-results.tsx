"use client"

import { Card } from "@/components/ui/card"
import { Flame, TrendingUp, Utensils, Brain } from "lucide-react"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts"

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
  summary?: string // ✅ added summary from AI
}

interface NutritionResultsProps {
  data: NutritionData
}

export function NutritionResults({ data }: NutritionResultsProps) {
  const macros = [
    { name: "Protein", value: data.protein, color: "#36A2EB" },
    { name: "Carbs", value: data.carbs, color: "#FFCE56" },
    { name: "Fat", value: data.fat, color: "#FF6384" },
  ]

  const total = data.protein + data.carbs + data.fat

  return (
    <div className="space-y-8">
      {/* 🔥 Total Calories */}
      <div className="text-center py-8 border-b border-border/50">
        <div className="inline-flex items-center justify-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Flame className="h-6 w-6 text-primary" />
          </div>
        </div>
        <div className="text-6xl sm:text-7xl font-black text-primary mb-2 tracking-tight">
          {data.calories}
        </div>
        <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Total Calories
        </div>
      </div>

      {/* 📊 Pie Chart for Macros */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h3 className="font-bold text-xl">Macronutrient Breakdown</h3>
        </div>
        <Card className="p-4 bg-secondary/30 border-border/50">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={macros}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {macros.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* 🍽️ Detected Foods */}
      {data?.foodItems?.length > 0 && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2">
            <Utensils className="h-5 w-5 text-primary" />
            <h3 className="font-bold text-xl">Detected Foods</h3>
          </div>
          <div className="space-y-3">
            {data.foodItems.map((item, index) => (
              <Card
                key={index}
                className="p-4 bg-secondary/20 border-border/50 hover:border-primary/30 transition-all hover:shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <h4 className="font-bold text-base">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">{item.quantity}</p>
                  </div>
                  <div className="grid grid-cols-4 gap-3 sm:gap-4 text-center">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Cal</div>
                      <div className="text-sm font-bold">{item.calories}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Pro</div>
                      <div className="text-sm font-bold">{item.protein}g</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Carb</div>
                      <div className="text-sm font-bold">{item.carbs}g</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Fat</div>
                      <div className="text-sm font-bold">{item.fat}g</div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 🧠 AI Summary */}
      {data.summary && (
        <Card className="p-6 bg-secondary/30 border-border/50 hover:border-primary/30 transition-all">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">AI Food Insight</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {data.summary}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

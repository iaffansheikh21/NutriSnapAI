import { Card } from "@/components/ui/card"
import { Flame, TrendingUp, Utensils } from "lucide-react"

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
}

interface NutritionResultsProps {
  data: NutritionData
}

export function NutritionResults({ data }: NutritionResultsProps) {
  const macros = [
    { name: "Protein", value: data.protein, unit: "g", color: "bg-chart-1", icon: "💪" },
    { name: "Carbs", value: data.carbs, unit: "g", color: "bg-chart-2", icon: "🌾" },
    { name: "Fat", value: data.fat, unit: "g", color: "bg-chart-3", icon: "🥑" },
  ]

  const total = data.protein + data.carbs + data.fat

  return (
    <div className="space-y-6">
      {/* Calories */}
      <div className="text-center py-8 border-b border-border/50">
        <div className="inline-flex items-center justify-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Flame className="h-6 w-6 text-primary" />
          </div>
        </div>
        <div className="text-6xl sm:text-7xl font-black text-primary mb-2 tracking-tight">{data.calories}</div>
        <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Total Calories</div>
      </div>

      {/* Macronutrients */}
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h3 className="font-bold text-xl">Macronutrients</h3>
        </div>

        {/* Visual breakdown */}
        <div className="flex h-4 rounded-full overflow-hidden bg-secondary shadow-inner">
          {macros.map((macro, index) => (
            <div
              key={macro.name}
              className={`${macro.color} transition-all duration-500 ease-out`}
              style={{
                width: `${(macro.value / total) * 100}%`,
                animationDelay: `${index * 100}ms`,
              }}
            />
          ))}
        </div>

        {/* Macro details */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {macros.map((macro) => (
            <Card
              key={macro.name}
              className="p-4 sm:p-5 bg-secondary/30 border-border/50 hover:border-primary/30 transition-all hover:shadow-lg group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className={`w-3 h-3 rounded-full ${macro.color} shadow-sm`} />
                  <span className="text-2xl group-hover:scale-110 transition-transform">{macro.icon}</span>
                </div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{macro.name}</div>
                <div className="text-3xl sm:text-4xl font-black tracking-tight">
                  {macro.value}
                  <span className="text-sm text-muted-foreground ml-1 font-semibold">{macro.unit}</span>
                </div>
                <div className="text-xs font-semibold text-primary">
                  {Math.round((macro.value / total) * 100)}% of total
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {data.foodItems.length > 0 && (
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
    </div>
  )
}

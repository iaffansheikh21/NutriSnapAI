# 🧠 NutriSnap AI

**NutriSnap AI** is an intelligent nutrition analyzer that lets users upload a food photo and instantly get a full macronutrient breakdown — calories, protein, carbs, and fat — powered by AI and n8n automation.

🌐 **Live Demo:** [https://nutri-snaps-ai.vercel.app/](https://nutri-snaps-ai.vercel.app/)

---

## 🚀 Features

- 📸 **Upload Meal Photo** – Analyze any dish directly from an image  
- ⚡ **AI-Powered Nutrition Analysis** – Get instant and accurate results  
- 📊 **Macro Breakdown** – Detailed calories, protein, carbs, and fat info  
- 💾 **n8n Webhook Integration** – Connect with your own AI workflow  
- 🧩 **Built with Next.js** – Fast, modern, and scalable web experience  

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, Tailwind CSS, ShadCN UI  
- **Backend:** Next.js API Routes  
- **AI/Automation:** n8n + OpenAI Webhook Integration  
- **Charting:** Recharts (for dynamic macro visualization)  

---

## 🧩 How It Works

1. Upload a food image.  
2. The image is sent to an n8n webhook for AI-based nutrition analysis.  
3. Results are sent back to your frontend — instantly showing macro data and a breakdown per food item.  

---

## 🧠 Example Output

```json
{
  "output": {
    "status": "success",
    "food": [
      { "name": "Brown Rice", "quantity": "1 cup", "calories": 215, "protein": 5, "carbs": 45, "fat": 1.8 },
      { "name": "Grilled Chicken", "quantity": "100g", "calories": 165, "protein": 31, "carbs": 0, "fat": 3.6 }
    ],
    "total": { "calories": 380, "protein": 36, "carbs": 45, "fat": 5.4 }
  }
}

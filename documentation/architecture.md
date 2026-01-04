# System Architecture: Calorie Tracker

## 1. Technology Stack

- **Frontend:** React.js (Vite)
- **State Management:** React Context or Zustand (lightweight).
- **Styling:** Tailwind CSS (for rapid, custom UI implementation).
- **Icons:** Lucide-React.
- **Backend & Database:** Firebase (Serverless)
    - **Auth:** Firebase Authentication (Google Sign-in, Email/Pass).
    - **Database:** Cloud Firestore (NoSQL).
    - **Storage:** Firebase Storage (for temporary holding of meal photos).
- **AI Layer:** Google Gemini API (Model: gemini-3.0-flash-preview)
    - Used for: Image-to-Text (analysis) and Text-to-JSON (calorie estimation).

## 2. High-Level Data Model (Firestore)

### Collection: `users`
```json
{
  "uid": "string",
  "dailyLimit": 2000,
  "currentStreak": 5,
  "lastLogDate": "2025-05-28", // ISO Date
  "preferences": {
    "units": "metric"
  }
}
```

### Collection: `daily_logs`
**Doc ID:** `${uid}_${YYYY-MM-DD}`
```json
{
  "userId": "string",
  "date": "2025-05-28",
  "totalCalories": 1450,
  "status": "under_limit", // or "over_limit"
  "entries": [
    {
      "name": "Oatmeal",
      "calories": 350,
      "timestamp": "08:00:00",
      "source": "manual" // or "ai_image", "ai_text"
    }
  ]
}
```

### Collection: `saved_meals`
```json
{
  "userId": "string",
  "name": "Post-Workout Shake",
  "calories": 400
}
```

## 3. AI Integration Flow (Image Recognition)

1.  **Capture:** User uploads image via Frontend `input type="file"`.
2.  **Preprocessing:** Image resized client-side to max 1024px width (optimize bandwidth).
3.  **API Call:** Send base64 image + Prompt to Gemini API.
4.  **System Prompt:** "Analyze this image. Identify food items. Estimate portion size and calories. Return ONLY a JSON object: `{ items: [{ name: string, calories: number }], total_estimated: number }`."
5.  **Verification:** UI displays the AI guess to the user.
6.  **Confirmation:** User edits (if necessary) and confirms. Data saved to Firestore.

## 4. Streak Logic

- **Real-time:** The streak is calculated on the frontend for display, but finalized on the backend.
- **Trigger:** When the user opens the app on Day X, check Day X-1.
    - If Day X-1 exists AND calories < limit: **Streak maintained/incremented.**
    - If Day X-1 missing OR calories > limit: **Streak resets to 0.**

## 5. Security & Privacy

- **Firestore Rules:** Users can only read/write their own documents (`request.auth.uid == resource.data.userId`).
- **API Keys:** Gemini API key stored in Firebase Functions (or environment variables if using a proxy), not exposed directly in client code if possible (though for MVP, client-side call with restricted key is acceptable).
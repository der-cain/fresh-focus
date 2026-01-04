# Implementation Plan & Milestones

### Milestone 1: Foundation & Auth (Days 1-2)
- [ ] Project Setup: Initialize React + Vite + Tailwind CSS.
- [ ] Firebase Init: Set up project, enable Auth and Firestore.
- [ ] Authentication UI: Create Login/Signup screens.
- [ ] Onboarding Flow: Create form for Goal Setting (Weight/Height -> Calorie Limit).
- [ ] Global State: Set up context for User and Daily Progress.

### Milestone 2: Manual Tracking & Database (Days 3-5)
- [ ] Dashboard UI: Create the main "Daily Balance" view (Progress bar).
- [ ] Add Item UI: Create a modal/drawer for inputting food.
- [ ] Database Logic: Implement addEntry function to update daily_logs.
- [ ] History/Favorites:
    - [ ] Query past unique entries.
    - [ ] Implement "Quick Add" from recent history.

### Milestone 3: AI Integration (Days 6-8)
- [ ] Gemini Setup: Get API Key and test basic prompts.
- [ ] Text Analysis: Implement "Natural Language Input" (e.g., "I had an apple and a coffee").
- [ ] Image Analysis:
    - [ ] Implement Camera/File access.
    - [ ] Build "Analyzing..." loading state.
    - [ ] Parse JSON response from Gemini.
- [ ] Verification UI: Allow user to correct AI estimates before saving.

### Milestone 4: The Streak Engine (Days 9-10)
- [ ] Streak Algorithm: Implement the check logic (compare Yesterday vs. Limit).
- [ ] Persistence: Store currentStreak in the user profile.
- [ ] Daily Summary: Create a "Morning Check-in" popup: "Yesterday you ate X calories. Streak Safe! 🔥" or "Streak Reset 😢".

### Milestone 5: UX Polish & "Fresh" UI (Days 11-14)
- [ ] Styling: Apply the "Fresh Organic" color palette (from Style Guide).
- [ ] Micro-interactions: Add animations for filling the progress bar and completing the streak.
- [ ] Responsive Check: Ensure tap targets work perfectly on mobile.
- [ ] Deploy: Deploy to Vercel/Netlify or Firebase Hosting.
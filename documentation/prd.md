# Product Requirements Document: Calorie Balance & Streak Tracker

## 1. Executive Summary
The goal is to build a mobile-first web application that simplifies calorie tracking through AI automation and incentivizes consistency through a gamified streak system. The app focuses on "Daily Balance" rather than strict macro-counting, making it accessible for casual users aiming for weight loss.

## 2. User Personas
- **The Busy Professional:** Wants to log food in seconds, not minutes. Uses photos to estimate calories because they eat out often.
- **The Routine Eater:** Eats the same breakfast and lunch daily and wants a "one-tap" add feature.
- **The Streak Keeper:** Needs visual motivation (green checks, streak flames) to stick to the diet.

## 3. Functional Requirements

### 3.1. Profile & Goals
- **User Onboarding:** Input current weight, target weight, age, height, and activity level.
- **Calorie Limit Calculation:** System suggests a daily limit (TDEE - deficit), but user can manually override.
- **Dynamic Adjustment:** Ability to update weight and adjust goals periodically.

### 3.2. Tracking & Logging (The Core Loop)
- **Manual Entry:** Search database or quick-add (Name + Calories).
- **Smart Text Entry:** User types "Burger and fries" -> AI estimates calories.
- **Visual Recognition (AI):** User uploads/snaps a photo of a plate -> AI analyzes components and estimates calories.
- **History & Favorites:**
    - "Recent Meals" list for quick re-adding.
    - "Save as Meal" feature to group items (e.g., "My Standard Breakfast").

### 3.3. The Streak System
- **Daily Check-in:** A logic check at the end of the day (or start of next).
- **Logic:** Total Consumed < Daily Limit = Success.
- **Streak Counter:** Number of consecutive days successfully under the limit.
- **Reset Condition:** If Total Consumed > Daily Limit, streak resets to 0.
- **Visual Feedback:** Dashboard prominence of the current streak count.

### 3.4. Dashboard & Analytics
- **Daily Progress Bar:** Visual representation of Calories Eaten vs. Limit.
- **Weekly View:** A simple 7-day lookback at pass/fail status.

## 4. Non-Functional Requirements
- **Performance:** Image analysis must return results in under 5 seconds.
- **Privacy:** User data (especially photos) must be handled securely.
- **Responsiveness:** Mobile-first design (PWA ready).

## 5. Future Scope (Post-MVP)
- Macro tracking (Protein/Carbs/Fat).
- Integration with Apple Health/Google Fit for active calorie burning.
- Social sharing of streaks.

# UX Style Guide: "Fresh Focus"

## 1. Design Philosophy
Most calorie trackers are clinical (blue/white), aggressive (red/black), or overly techy (dark mode purple). "Fresh Focus" aims to be organic, encouraging, and restorative. Tracking food is an act of self-care, not punishment.

- **Vibe:** A morning walk in a forest, a clean kitchen counter, fresh ingredients.
- **Interaction:** Soft, rounded, tactile.

## 2. Color Palette
Avoid purples and harsh neons. Use earth and plant tones.

| Role | Color Name | Hex Code | Usage |
| :--- | :--- | :--- | :--- |
| **Primary** | Matcha Green | `#6A994E` | Primary buttons, "Under Limit" progress bar, Streak icons. |
| **Secondary** | Sage Mist | `#A7C957` | Background accents, secondary buttons. |
| **Background** | Oat Milk | `#F2E8CF` | Main app background (warm off-white, easier on eyes than pure white). |
| **Surface** | Clean White | `#FFFFFF` | Cards, input fields, modal backgrounds. |
| **Alert/Action** | Persimmon | `#BC4749` | "Over Limit" warnings, Delete actions, Reset streak. |
| **Text** | Deep Loam | `#386641` | Primary text (very dark green, almost black). |

## 3. Typography
- **Font Family:** Nunito (Rounded sans-serif). It feels friendly and approachable.
- **Headers:** Bold, usually in Deep Loam.
- **Data/Numbers:** Space Mono or Roboto Mono for calorie counts to ensure readability and table alignment.

## 4. Component Styles

### The "Calorie Tank" (Progress Bar)
Instead of a thin line, use a Fluid Container. It looks like a glass filling up with water (or green tea).
- **0-80% full:** Matcha Green.
- **80-100% full:** Transitions to yellow/orange warning.
- **>100%:** Turns Persimmon Red.

### The Streak Flame
Don't use a standard "fire" icon. Use a Sprouting Leaf or a Growing Tree.
- **Day 1-3:** Seedling 🌱
- **Day 4-10:** Sapling 🌿
- **Day 10+:** Tree 🌳
- **Animation:** When the streak extends, the plant "waters" and pulses.

### Input Method (The "Plate")
The main action button is a large circle at the bottom center.
- **Icon:** A simple camera shutter combined with a fork/knife.
- **Interaction:** Tapping it opens a half-sheet (drawer) that feels like sliding a plate onto a table.

## 5. Tone of Voice
- **Success:** "Balance achieved. See you tomorrow!" (Not "Target hit")
- **Failure:** "Over the limit today. Let's reset and go again." (Not "Failed")
- **AI Loading:** "Looking at your food..." or "Identifying ingredients..."

## 6. Layout Patterns
- **Card-Based:** Every meal entry is a card with soft shadow (`shadow-md`) and large border radius (`rounded-2xl`).
- **No Bottom Tab Bar:** Use a top header for Stats/Profile and a floating action button (FAB) for adding food to maximize screen real estate for the list.
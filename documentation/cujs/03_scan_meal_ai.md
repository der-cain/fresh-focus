# CUJ 03: Scan Meal with AI

## Goal
Log one or more food items using natural language processing.

## Prerequisites
- User is on the Dashboard.

## Steps
1. Click the Floating Action Button (Plus icon) at the bottom of the screen.
2. In the "Add Meal" drawer, enter a natural language description in the first input (e.g., "Two eggs and a piece of toast").
3. Click the "Scan with AI" button.
4. Wait for the AI to process the request (a loading state will appear).
5. Review the items found by the AI in the results list:
    - **Modify Calories**: Select the calorie input next to any item to adjust its value if the AI's estimate seems off.
    - **Remove Item**: Click the "X" button next to any item that was incorrectly identified.
    - **Add Missing Item**: Click the "+ Add Missing Item" button at the bottom of the list to manually add elements the AI missed.
6. Click "Save All" to add the final list of items to the daily log.

## Expected Outcome
- The AI correctly parses the text into individual components (e.g., "Eggs" and "Toast") with estimated calories.
- After saved, the individual items appear in the "Today's Meals" list.
- The total calories for the day are updated.

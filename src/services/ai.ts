import type { FoodItem } from '../store/useStore';

// Mock response for testing
const MOCK_BURGER_RESPONSE = {
  items: [
    { name: 'Cheeseburger', calories: 550 },
    { name: 'Fries (Medium)', calories: 380 },
    { name: 'Ketchup', calories: 20 }
  ],
  total_estimated: 950
};

export interface AIAnalysisResult {
  items: FoodItem[];
  total_estimated: number;
}

export const AIService = {
  // Simulate text analysis
  async analyzeText(text: string): Promise<AIAnalysisResult> {
    console.log(`Analyzing text: ${text}`);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // For demo purposes, we just return the burger mock if the text contains "burger", 
    // otherwise a generic salad mock.
    if (text.toLowerCase().includes('burger')) {
      return MOCK_BURGER_RESPONSE;
    }

    return {
        items: [{ name: 'Mixed Salad', calories: 220 }, { name: 'Vinaigrette', calories: 80 }],
        total_estimated: 300
    };
  },

  // Simulate image analysis
  async analyzeImage(file: File): Promise<AIAnalysisResult> {
    console.log(`Analyzing image: ${file.name}`);
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Always return the burger mock for the demo scan
    return MOCK_BURGER_RESPONSE;
  }
};

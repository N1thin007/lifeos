// Curated database of common Indian dishes with approximate nutrition per typical serving.
// Values are estimates for an average home-cooked/restaurant serving.

export interface IndianFood {
  name: string
  serving_size: string
  calories: number
  protein: number
  carbs: number
  fat: number
}

export const INDIAN_FOODS: IndianFood[] = [
  // ---- Breads / Staples ----
  { name: 'Roti / Chapati (1 medium)', serving_size: '1 piece', calories: 85, protein: 3, carbs: 18, fat: 0.5 },
  { name: 'Naan (1 piece)', serving_size: '1 piece', calories: 260, protein: 8, carbs: 45, fat: 5 },
  { name: 'Paratha, plain (1 piece)', serving_size: '1 piece', calories: 210, protein: 4.5, carbs: 27, fat: 9 },
  { name: 'Aloo Paratha (1 piece)', serving_size: '1 piece', calories: 280, protein: 6, carbs: 36, fat: 12 },
  { name: 'Puri (1 piece)', serving_size: '1 piece', calories: 100, protein: 1.5, carbs: 11, fat: 6 },
  { name: 'Steamed Rice (1 cup, cooked)', serving_size: '1 cup', calories: 205, protein: 4.3, carbs: 45, fat: 0.4 },
  { name: 'Jeera Rice (1 cup)', serving_size: '1 cup', calories: 250, protein: 4.5, carbs: 45, fat: 6 },
  { name: 'Idli (1 piece)', serving_size: '1 piece', calories: 40, protein: 1.5, carbs: 8, fat: 0.2 },
  { name: 'Dosa, plain (1 piece)', serving_size: '1 piece', calories: 130, protein: 3, carbs: 22, fat: 3.5 },
  { name: 'Masala Dosa (1 piece)', serving_size: '1 piece', calories: 250, protein: 5, carbs: 35, fat: 10 },
  { name: 'Uttapam (1 piece)', serving_size: '1 piece', calories: 150, protein: 4, carbs: 24, fat: 4 },
  { name: 'Upma (1 cup)', serving_size: '1 cup', calories: 220, protein: 5, carbs: 35, fat: 7 },
  { name: 'Poha (1 cup)', serving_size: '1 cup', calories: 250, protein: 5, carbs: 42, fat: 7 },
  { name: 'Vada (Medu Vada, 1 piece)', serving_size: '1 piece', calories: 100, protein: 3, carbs: 10, fat: 5.5 },

  // ---- Dals / Curries ----
  { name: 'Dal Tadka (1 bowl, ~1 cup)', serving_size: '1 cup', calories: 180, protein: 9, carbs: 22, fat: 6 },
  { name: 'Dal Makhani (1 bowl)', serving_size: '1 cup', calories: 320, protein: 12, carbs: 28, fat: 18 },
  { name: 'Sambar (1 bowl)', serving_size: '1 cup', calories: 130, protein: 6, carbs: 18, fat: 4 },
  { name: 'Rasam (1 bowl)', serving_size: '1 cup', calories: 70, protein: 3, carbs: 10, fat: 2 },
  { name: 'Chana Masala (1 bowl)', serving_size: '1 cup', calories: 280, protein: 12, carbs: 35, fat: 11 },
  { name: 'Rajma (1 bowl)', serving_size: '1 cup', calories: 270, protein: 11, carbs: 32, fat: 10 },
  { name: 'Palak Paneer (1 bowl)', serving_size: '1 cup', calories: 300, protein: 14, carbs: 12, fat: 22 },
  { name: 'Paneer Butter Masala (1 bowl)', serving_size: '1 cup', calories: 420, protein: 15, carbs: 16, fat: 32 },
  { name: 'Kadai Paneer (1 bowl)', serving_size: '1 cup', calories: 350, protein: 14, carbs: 14, fat: 26 },
  { name: 'Aloo Gobi (1 bowl)', serving_size: '1 cup', calories: 180, protein: 4, carbs: 22, fat: 9 },
  { name: 'Bhindi Masala (1 bowl)', serving_size: '1 cup', calories: 150, protein: 3, carbs: 14, fat: 9 },
  { name: 'Baingan Bharta (1 bowl)', serving_size: '1 cup', calories: 170, protein: 3, carbs: 14, fat: 11 },
  { name: 'Mixed Vegetable Curry (1 bowl)', serving_size: '1 cup', calories: 160, protein: 4, carbs: 18, fat: 8 },
  { name: 'Chole (1 bowl)', serving_size: '1 cup', calories: 280, protein: 12, carbs: 35, fat: 11 },

  // ---- Non-veg ----
  { name: 'Chicken Curry (1 bowl, with gravy)', serving_size: '1 cup', calories: 320, protein: 28, carbs: 8, fat: 20 },
  { name: 'Butter Chicken (1 bowl)', serving_size: '1 cup', calories: 440, protein: 26, carbs: 12, fat: 32 },
  { name: 'Chicken Tikka (4 pieces)', serving_size: '4 pieces', calories: 220, protein: 30, carbs: 4, fat: 9 },
  { name: 'Tandoori Chicken (1 leg piece)', serving_size: '1 leg piece', calories: 200, protein: 28, carbs: 2, fat: 9 },
  { name: 'Chicken Biryani (1 plate)', serving_size: '1 plate', calories: 550, protein: 25, carbs: 65, fat: 20 },
  { name: 'Mutton Curry (1 bowl)', serving_size: '1 cup', calories: 380, protein: 26, carbs: 8, fat: 27 },
  { name: 'Egg Curry (1 bowl, 2 eggs)', serving_size: '1 bowl', calories: 280, protein: 14, carbs: 10, fat: 20 },
  { name: 'Boiled Egg (1 large)', serving_size: '1 egg', calories: 78, protein: 6.3, carbs: 0.6, fat: 5.3 },
  { name: 'Omelette (2 eggs)', serving_size: '2 eggs', calories: 220, protein: 13, carbs: 1.5, fat: 18 },
  { name: 'Fish Curry (1 bowl)', serving_size: '1 cup', calories: 250, protein: 24, carbs: 6, fat: 15 },
  { name: 'Fish Fry (1 piece)', serving_size: '1 piece', calories: 200, protein: 18, carbs: 6, fat: 12 },
  { name: 'Egg Biryani (1 plate)', serving_size: '1 plate', calories: 480, protein: 16, carbs: 65, fat: 16 },

  // ---- Snacks / Street food ----
  { name: 'Samosa (1 piece)', serving_size: '1 piece', calories: 260, protein: 4, carbs: 30, fat: 14 },
  { name: 'Pakora / Bhajji (4-5 pieces)', serving_size: '~5 pieces', calories: 220, protein: 4, carbs: 22, fat: 13 },
  { name: 'Pani Puri (6 pieces)', serving_size: '6 pieces', calories: 180, protein: 3, carbs: 30, fat: 6 },
  { name: 'Bhel Puri (1 plate)', serving_size: '1 plate', calories: 250, protein: 5, carbs: 40, fat: 8 },
  { name: 'Vada Pav (1 piece)', serving_size: '1 piece', calories: 290, protein: 6, carbs: 40, fat: 12 },
  { name: 'Pav Bhaji (1 plate)', serving_size: '1 plate', calories: 400, protein: 8, carbs: 50, fat: 18 },
  { name: 'Dhokla (4 pieces)', serving_size: '4 pieces', calories: 160, protein: 5, carbs: 25, fat: 4 },

  // ---- Sweets ----
  { name: 'Gulab Jamun (1 piece)', serving_size: '1 piece', calories: 150, protein: 2, carbs: 22, fat: 6 },
  { name: 'Rasgulla (1 piece)', serving_size: '1 piece', calories: 100, protein: 2, carbs: 20, fat: 1 },
  { name: 'Jalebi (1 piece)', serving_size: '1 piece', calories: 150, protein: 1, carbs: 20, fat: 8 },
  { name: 'Halwa (1 small bowl, ~100g)', serving_size: '100g', calories: 300, protein: 4, carbs: 40, fat: 14 },
  { name: 'Kheer (1 bowl)', serving_size: '1 cup', calories: 250, protein: 6, carbs: 38, fat: 8 },
  { name: 'Ladoo (1 piece)', serving_size: '1 piece', calories: 180, protein: 3, carbs: 22, fat: 9 },

  // ---- Dairy / Drinks ----
  { name: 'Curd / Yogurt (1 cup, plain)', serving_size: '1 cup', calories: 150, protein: 8, carbs: 11, fat: 8 },
  { name: 'Buttermilk / Chaas (1 glass)', serving_size: '1 glass', calories: 50, protein: 2, carbs: 5, fat: 2 },
  { name: 'Lassi, sweet (1 glass)', serving_size: '1 glass', calories: 220, protein: 6, carbs: 30, fat: 8 },
  { name: 'Masala Chai (1 cup, with milk & sugar)', serving_size: '1 cup', calories: 80, protein: 2, carbs: 12, fat: 3 },
  { name: 'Filter Coffee (1 cup, with milk & sugar)', serving_size: '1 cup', calories: 70, protein: 2, carbs: 10, fat: 2.5 },

  // ---- South Indian specifics ----
  { name: 'Curd Rice (1 bowl)', serving_size: '1 cup', calories: 230, protein: 6, carbs: 38, fat: 6 },
  { name: 'Lemon Rice (1 cup)', serving_size: '1 cup', calories: 240, protein: 4, carbs: 40, fat: 8 },
  { name: 'Coconut Chutney (2 tbsp)', serving_size: '2 tbsp', calories: 90, protein: 1.5, carbs: 4, fat: 8 },
  { name: 'Appam (1 piece)', serving_size: '1 piece', calories: 120, protein: 2, carbs: 22, fat: 2 },
  { name: 'Puttu (1 piece)', serving_size: '1 piece', calories: 150, protein: 3, carbs: 32, fat: 1 },
]

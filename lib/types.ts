export interface Food {
  id: string
  user_id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  serving_size: string
  is_recipe: boolean
  created_at: string
}

export interface FoodLog {
  id: string
  user_id: string
  food_name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  quantity: number
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  logged_date: string
  created_at: string
}

export interface WorkoutSession {
  id: string
  user_id: string
  session_date: string
  name: string
  notes: string | null
  created_at: string
  workout_exercises?: WorkoutExercise[]
}

export interface WorkoutExercise {
  id: string
  session_id: string
  user_id: string
  exercise_name: string
  sets: number | null
  reps: number | null
  weight: number | null
  weight_unit: string
  order_index: number
  created_at: string
}

export interface Task {
  id: string
  user_id: string
  title: string
  notes: string | null
  due_date: string
  completed: boolean
  created_at: string
}

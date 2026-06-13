// Common exercises grouped by category, for the workout exercise picker.

export interface ExerciseCategory {
  category: string
  exercises: string[]
}

export const EXERCISES: ExerciseCategory[] = [
  {
    category: 'Chest',
    exercises: [
      'Bench Press',
      'Incline Bench Press',
      'Decline Bench Press',
      'Dumbbell Press',
      'Incline Dumbbell Press',
      'Chest Fly',
      'Cable Fly',
      'Push Ups',
      'Dips',
      'Pec Deck Machine',
    ],
  },
  {
    category: 'Back',
    exercises: [
      'Deadlift',
      'Pull Ups',
      'Lat Pulldown',
      'Seated Cable Row',
      'Barbell Row',
      'Dumbbell Row',
      'T-Bar Row',
      'Face Pull',
      'Hyperextension',
      'Shrugs',
    ],
  },
  {
    category: 'Shoulders',
    exercises: [
      'Overhead Press',
      'Dumbbell Shoulder Press',
      'Arnold Press',
      'Lateral Raise',
      'Front Raise',
      'Rear Delt Fly',
      'Upright Row',
      'Cable Lateral Raise',
    ],
  },
  {
    category: 'Arms',
    exercises: [
      'Bicep Curl',
      'Hammer Curl',
      'Barbell Curl',
      'Preacher Curl',
      'Cable Curl',
      'Tricep Pushdown',
      'Overhead Tricep Extension',
      'Skull Crushers',
      'Close Grip Bench Press',
    ],
  },
  {
    category: 'Legs',
    exercises: [
      'Squat',
      'Front Squat',
      'Leg Press',
      'Lunges',
      'Romanian Deadlift',
      'Leg Curl',
      'Leg Extension',
      'Calf Raise',
      'Bulgarian Split Squat',
      'Hip Thrust',
      'Glute Bridge',
    ],
  },
  {
    category: 'Core',
    exercises: [
      'Plank',
      'Crunches',
      'Russian Twists',
      'Hanging Leg Raise',
      'Cable Crunch',
      'Mountain Climbers',
      'Bicycle Crunches',
      'Ab Wheel Rollout',
    ],
  },
  {
    category: 'Cardio',
    exercises: [
      'Running',
      'Cycling',
      'Rowing Machine',
      'Jump Rope',
      'Stair Climber',
      'Elliptical',
      'Swimming',
      'Walking',
      'Burpees',
    ],
  },
  {
    category: 'Olympic / Functional',
    exercises: [
      'Clean and Jerk',
      'Snatch',
      'Kettlebell Swing',
      'Box Jump',
      'Battle Ropes',
      'Farmer\'s Walk',
    ],
  },
]

export const ALL_EXERCISES: string[] = EXERCISES.flatMap((c) => c.exercises)

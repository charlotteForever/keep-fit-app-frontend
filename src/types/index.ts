export interface User {
  id: string;
  email: string;
  nickname?: string;
  age?: number;
  gender?: string;
  height?: number;
  weight?: number;
  goalType?: string;
  dietReference?: {
    fist?: {
      imageUrl: string;
      calibrated: boolean;
    };
    coin?: {
      imageUrl: string;
      diameterMm: number;
    };
  };
}

export interface DietRecord {
  id: string;
  userId: string;
  type: 'diet';
  date: string;
  valueJson: DietRecordData;
  createdAt: string;
  updatedAt: string;
}

export interface DietRecordData {
  mode: 'nutrition_label' | 'reference_photo' | 'quick';
  status: 'pending' | 'confirmed';
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  images: Array<{ url: string }>;
  nutritionPer100g?: {
    calories: number;
    protein?: number;
    fat?: number;
    carbohydrate?: number;
  };
  consumedGrams?: number;
  items?: Array<{
    name: string;
    grams: number;
    calories: number;
    source: string;
  }>;
  total?: {
    calories: number;
    protein?: number;
    fat?: number;
    carbohydrate?: number;
  };
  reference?: {
    type: string;
    presentInImage: boolean;
  };
  source?: string;
}

export interface DashboardData {
  date: string;
  calories: {
    current: number;
    goal: number;
    percentage: number;
  };
  protein: {
    current: number;
    goal: number;
    percentage: number;
  };
  workout: {
    minutes: number;
    goal: number;
  };
  score: number;
  aiRecommendation: string;
  recentRecords: DietRecord[];
}

export interface FoodItem {
  name: string;
  probability: number;
  estimatedGrams?: number;
  caloriesPer100g?: number;
}

// utils/storage.ts
import { Category } from '@/types/category';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HABITS_KEY = '@habits';

export interface Habit {
  id: string;
  title: string;
  hasGoal: boolean;
  endDate?: string;
  monthsGoal?: number; 
  category: Category;
  frequency: {
    hasFrequency: boolean;
    selectedDays: number[];
  };
  hasReminder: boolean;
  reminderTime?: string;
  createdAt: string;
}

export const saveHabit = async (habit: Omit<Habit, 'id' | 'createdAt'>): Promise<Habit> => {
  try {
    const newHabit: Habit = {
      ...habit,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    const existingHabits = await getHabits();
    const updatedHabits = [...existingHabits, newHabit];
    
    await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(updatedHabits));
    return newHabit;
  } catch (error) {
    console.error('Error saving habit:', error);
    throw error;
  }
};

export const getHabits = async (): Promise<Habit[]> => {
  try {
    const habitsJson = await AsyncStorage.getItem(HABITS_KEY);
    return habitsJson ? JSON.parse(habitsJson) : [];
  } catch (error) {
    console.error('Error getting habits:', error);
    return [];
  }
};

export const clearHabits = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(HABITS_KEY);
  } catch (error) {
    console.error('Error clearing habits:', error);
  }
};
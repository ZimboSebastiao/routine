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

const saveAllHabits = async (habits: Habit[]) => {
  await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(habits));
};

export const saveHabit = async (habit: Omit<Habit, 'id' | 'createdAt'>): Promise<Habit> => {
  try {
    const newHabit: Habit = {
      ...habit,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    const existingHabits = await getHabits();
    const updatedHabits = [...existingHabits, newHabit];
    
    await saveAllHabits(updatedHabits);
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

export const updateHabit = async (id: string, habitData: Partial<Habit>): Promise<Habit | null> => {
  try {
    const habits = await getHabits();
    const index = habits.findIndex(h => h.id === id);
    
    if (index === -1) return null;
    
    const updatedHabit = { ...habits[index], ...habitData };
    const updatedHabits = [...habits];
    updatedHabits[index] = updatedHabit;
    
    await saveAllHabits(updatedHabits);
    return updatedHabit;
  } catch (error) {
    console.error('Error updating habit:', error);
    throw error;
  }
};

export const deleteHabitPermanently = async (id: string): Promise<boolean> => {
  try {
    const habits = await getHabits();
    const updatedHabits = habits.filter(habit => habit.id !== id);
    await saveAllHabits(updatedHabits);
    return true;
  } catch (error) {
    console.error('Error deleting habit:', error);
    throw error;
  }
};

export const clearHabits = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(HABITS_KEY);
  } catch (error) {
    console.error('Error clearing habits:', error);
  }
};
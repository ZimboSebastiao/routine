import { Category } from '@/types/category';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HABITS_KEY = '@habits';
const TASKS_KEY = '@tasks';

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

export interface Task {
  id: string;
  habitId: string; 
  title: string;
  createdAt: string;
  completed: boolean;
  timeSpent?: number; 
  notes?: string; 
  description: string;
  startTime: string; 
  endTime: string;   
  color: string; 
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

export const getHabitById = async (id: string): Promise<Habit | null> => {
  try {
    const habits = await getHabits();
    const foundHabit = habits.find(habit => habit.id === id);
    return foundHabit || null;
  } catch (error) {
    console.error('Error getting habit by ID:', error);
    throw error;
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

export const saveTask = async (task: Omit<Task, 'id'>): Promise<Task> => {
  try {
    const newTask: Task = {
      ...task,
      id: Date.now().toString()
    };
    
    const existingTasks = await getTasks();
    const updatedTasks = [...existingTasks, newTask];
    
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(updatedTasks));
    return newTask;
  } catch (error) {
    console.error('Error saving task:', error);
    throw error;
  }
};

export const getTasks = async (habitId?: string): Promise<Task[]> => {
  try {
    const tasksJson = await AsyncStorage.getItem(TASKS_KEY);
    const allTasks = tasksJson ? JSON.parse(tasksJson) : [];
    
    return habitId 
      ? allTasks.filter((task: Task) => task.habitId === habitId)
      : allTasks;
  } catch (error) {
    console.error('Error getting tasks:', error);
    return [];
  }
};

export const updateTask = async (id: string, updates: Partial<Task>): Promise<Task | null> => {
  try {
    const tasks = await getTasks();
    const index = tasks.findIndex(t => t.id === id);
    
    if (index === -1) return null;
    
    const updatedTask = { ...tasks[index], ...updates };
    const updatedTasks = [...tasks];
    updatedTasks[index] = updatedTask;
    
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(updatedTasks));
    return updatedTask;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

export const deleteTask = async (id: string): Promise<boolean> => {
  try {
    const tasks = await getTasks();
    const updatedTasks = tasks.filter(task => task.id !== id);
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(updatedTasks));
    return true;
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Task } from './storage';

const WEEKLY_TIME_KEY = '@weekly_time_total';
const WEEK_START_KEY = '@current_week_start_time';


const getCurrentWeekStart = (): Date => {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay()); 
  weekStart.setHours(0, 0, 0, 0);
  return weekStart;
};

const checkAndUpdateWeek = async (): Promise<void> => {
  try {
    const storedWeekStart = await AsyncStorage.getItem(WEEK_START_KEY);
    const currentWeekStart = getCurrentWeekStart();
    
    if (!storedWeekStart || new Date(storedWeekStart) < currentWeekStart) {
      await AsyncStorage.setItem(WEEK_START_KEY, currentWeekStart.toISOString());
      await AsyncStorage.setItem(WEEKLY_TIME_KEY, '0');
    }
  } catch (error) {
    console.error('Error checking week:', error);
  }
};


export const addWeeklyTime = async (timeInMinutes: number): Promise<number> => {
  try {
    await checkAndUpdateWeek();
    
    const currentTimeStr = await AsyncStorage.getItem(WEEKLY_TIME_KEY);
    const currentTime = currentTimeStr ? parseInt(currentTimeStr, 10) : 0;
    const newTotal = currentTime + timeInMinutes;
    
    await AsyncStorage.setItem(WEEKLY_TIME_KEY, newTotal.toString());
    return newTotal;
  } catch (error) {
    console.error('Error adding weekly time:', error);
    return 0;
  }
};

export const getWeeklyTime = async (): Promise<number> => {
  try {
    await checkAndUpdateWeek();
    
    const timeStr = await AsyncStorage.getItem(WEEKLY_TIME_KEY);
    return timeStr ? parseInt(timeStr, 10) : 0;
  } catch (error) {
    console.error('Error getting weekly time:', error);
    return 0;
  }
};

export const updateWeeklyTimeFromTasks = async (): Promise<number> => {
  try {
    await checkAndUpdateWeek();
    
    const tasksJson = await AsyncStorage.getItem('@tasks');
    const allTasks: Task[] = tasksJson ? JSON.parse(tasksJson) : [];
    
    const weekStart = getCurrentWeekStart();
    const completedTasksThisWeek = allTasks.filter(task => 
      task.completed && 
      task.timeSpent && 
      new Date(task.createdAt) >= weekStart
    );
    
    const totalTime = completedTasksThisWeek.reduce(
      (sum, task) => sum + (task.timeSpent || 0), 
      0
    );

    await AsyncStorage.setItem(WEEKLY_TIME_KEY, totalTime.toString());
    return totalTime;
  } catch (error) {
    console.error('Error updating weekly time from tasks:', error);
    return 0;
  }
};

export const getCurrentWeekInfo = async () => {
  const weekStart = getCurrentWeekStart();
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6); 
  weekEnd.setHours(23, 59, 59, 999);
  
  const now = new Date();
  const daysRemaining = Math.max(0, 6 - now.getDay()); 
  
  return {
    weekStart,
    weekEnd,
    daysRemaining,
    currentDay: now.getDay() 
  };
};
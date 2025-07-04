import { Task } from '@/utils/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const POINTS_KEY = '@user_points';
const WEEK_START_KEY = '@current_week_start';

export const calculateTaskPoints = (task: Task): number => {
  if (!task.completed || !task.timeSpent) return 0;

  const BASE_POINTS = 10;
  const POINTS_PER_MINUTE = 0.5;
  const timePoints = task.timeSpent * POINTS_PER_MINUTE;
  const totalPoints = Math.round(BASE_POINTS + timePoints);
  const MAX_POINTS = 100;
  
  return Math.min(totalPoints, MAX_POINTS);
};

const getWeekStartDate = async (): Promise<Date> => {
  try {
    const storedDate = await AsyncStorage.getItem(WEEK_START_KEY);
    const now = new Date();
    
    const currentWeekStart = new Date(now);
    currentWeekStart.setDate(now.getDate() - now.getDay());
    currentWeekStart.setHours(0, 0, 0, 0);

    if (storedDate) {
      const storedWeekStart = new Date(storedDate);
      
      if (storedWeekStart.getTime() !== currentWeekStart.getTime()) {
        await AsyncStorage.setItem(WEEK_START_KEY, currentWeekStart.toISOString());
        await AsyncStorage.setItem(POINTS_KEY, '0');
        return currentWeekStart;
      }
      
      return storedWeekStart;
    } else {
      await AsyncStorage.setItem(WEEK_START_KEY, currentWeekStart.toISOString());
      await AsyncStorage.setItem(POINTS_KEY, '0');
      return currentWeekStart;
    }
  } catch (error) {
    console.error('Error getting week start date:', error);
    return new Date();
  }
};

export const recordTaskPoints = async (task: Task): Promise<number> => {
  const points = calculateTaskPoints(task);
  
  if (points > 0) {
    try {
      await getWeekStartDate();

      const currentPoints = await getUserPoints();
      const newTotal = currentPoints + points;
      
      await AsyncStorage.setItem(POINTS_KEY, newTotal.toString());
      return newTotal;
    } catch (error) {
      console.error('Error recording task points:', error);
    }
  }
  
  return points;
};

export const getUserPoints = async (): Promise<number> => {
  try {
    await getWeekStartDate(); 
    
    const points = await AsyncStorage.getItem(POINTS_KEY);
    return points ? parseInt(points, 10) : 0;
  } catch (error) {
    console.error('Error getting user points:', error);
    return 0;
  }
};

export const getCurrentWeekInfo = async () => {
  const weekStart = await getWeekStartDate();
  const now = new Date();
  
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  const daysRemaining = Math.max(0, 6 - now.getDay());

  return {
    weekStart,
    weekEnd,
    daysRemaining
  };
};

export const getPointsHistory = async () => {
  try {
    const history = await AsyncStorage.getItem('@points_history');
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error getting points history:', error);
    return [];
  }
};

export const resetPointsSystem = async () => {
  try {
    await AsyncStorage.removeItem(POINTS_KEY);
    await AsyncStorage.removeItem(WEEK_START_KEY);
    await AsyncStorage.removeItem('@points_history');
  } catch (error) {
    console.error('Error resetting points system:', error);
  }
};
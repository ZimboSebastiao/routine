import AsyncStorage from '@react-native-async-storage/async-storage';
import { getHabits } from './storage';

const HABITS_COUNT_KEY = '@habits_count';

export const updateHabitsCount = async (): Promise<number> => {
  try {
    const habits = await getHabits();
    const count = habits.length;
    await AsyncStorage.setItem(HABITS_COUNT_KEY, count.toString());
    return count;
  } catch (error) {
    console.error('Error updating habits count:', error);
    return 0;
  }
};

export const getHabitsCount = async (): Promise<number> => {
  try {
    return await updateHabitsCount();

  } catch (error) {
    console.error('Error getting habits count:', error);
    return 0;
  }
};

export const handleHabitsChange = async (): Promise<void> => {
  await updateHabitsCount();
};
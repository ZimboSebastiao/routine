import { cancelHabitReminders } from '@/utils/notifications';
import { deleteHabitPermanently, Habit, updateHabit } from '@/utils/storage';

export const editHabitWithNotifications = async (
  habitId: string, 
  updates: Partial<Habit>
): Promise<Habit | null> => {
  try {
    await cancelHabitReminders(habitId);
    
    return await updateHabit(habitId, updates);
  } catch (error) {
    console.error('Error in editHabitWithNotifications:', error);
    throw new Error('Failed to edit habit with notifications');
  }
};

export const deleteHabitCompletely = async (habitId: string): Promise<boolean> => {
  try {
    await cancelHabitReminders(habitId);
    
    return await deleteHabitPermanently(habitId);
  } catch (error) {
    console.error('Error in deleteHabitCompletely:', error);
    throw new Error('Failed to delete habit completely');
  }
};
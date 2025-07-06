import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Habit } from './storage';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true, 
    shouldShowList: true    
  }),
});

export const scheduleHabitReminders = async (habit: Habit): Promise<void> => {
  if (!habit.hasReminder || !habit.frequency.selectedDays.length) return;

  await cancelHabitReminders(habit.id);

  for (const day of habit.frequency.selectedDays) {

    const androidDay = day === 0 ? 7 : day; 
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Lembrete de Hábito',
        body: `Hora de realizar: ${habit.title}`,
        sound: 'default',
        data: { habitId: habit.id },
      },
      trigger: {

        ...(Platform.OS === 'ios' ? {
          type: 'calendar',
          weekday: day,
          hour: 8,
          minute: 0,
          repeats: true
        } : {
          type: 'daily',
          hour: 8,
          minute: 0,
          repeats: true
        })
      } as Notifications.NotificationTriggerInput,
    });
  }
};

export const cancelHabitReminders = async (habitId: string): Promise<void> => {
  const allNotifications = await Notifications.getAllScheduledNotificationsAsync();
  const habitNotifications = allNotifications.filter(
    notification => notification.content.data?.habitId === habitId
  );
  
  for (const notification of habitNotifications) {
    await Notifications.cancelScheduledNotificationAsync(notification.identifier);
  }
};

export const requestNotificationPermissions = async (): Promise<boolean> => {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
};
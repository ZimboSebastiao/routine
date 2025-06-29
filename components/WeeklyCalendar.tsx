import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface WeeklyCalendarProps {
  currentDate?: Date;
  highlightColor?: string;
}

const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({ 
  currentDate = new Date(), 
  highlightColor = '#000000' 
}) => {
  // Data atual
  const today = currentDate.getDate();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const currentWeekday = currentDate.getDay();

  // Gera a semana atual
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const weekDates = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return date;
  });

  return (
    <View style={styles.container}>
      {/* Dias da semana */}
      <View style={styles.weekDaysContainer}>
        {weekDays.map((day, index) => (
          <Text 
            key={day} 
            style={[
              styles.weekDayText,
              index === currentWeekday && styles.currentWeekdayText
            ]}
          >
            {day}
          </Text>
        ))}
      </View>

      {/* Dias do mês */}
      <View style={styles.daysContainer}>
        {weekDates.map((date, index) => {
          const day = date.getDate();
          const isCurrentDay = day === today && 
                             date.getMonth() === currentMonth && 
                             date.getFullYear() === currentYear;
          const isCurrentWeekday = index === currentWeekday;

          return (
            <View 
              key={index} 
              style={[
                styles.dayContainer,
                !isCurrentDay && styles.normalDay,
                isCurrentDay && { backgroundColor: highlightColor }
              ]}
            >
              <Text style={[
                isCurrentDay ? styles.currentDayText : styles.normalDayText,
                isCurrentWeekday && !isCurrentDay && styles.currentWeekdayText,
                date.getMonth() !== currentMonth && styles.otherMonthDay
              ]}>
                {day}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 10,
  },
  weekDaysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  weekDayText: {
    fontWeight: '600',
    fontSize: 14,
    color: '#757575',
    width: 36,
    textAlign: 'center',
  },
  currentWeekdayText: {
    color: '#000000',
    fontWeight: 'bold',
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayContainer: {
    width: 41,
    height: 41,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  normalDay: {
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: 'white',
	borderRadius: 50,
},
  normalDayText: {
    fontSize: 16,
    color: '#1c1c1c',
  },
  currentDayText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  otherMonthDay: {
    color: '#BDBDBD',
    fontWeight: 'normal',
  },
});

export default WeeklyCalendar;
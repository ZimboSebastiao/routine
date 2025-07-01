import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const Weekly = () => {
  const [currentWeek, setCurrentWeek] = useState<Date[]>([]);
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());
  const [selectedHour, setSelectedHour] = useState<string | null>(null);

  // Gera os dias da semana (Domingo a Sábado)
  const generateWeekDays = (startDate: Date = new Date()) => {
    const days = [];
    const current = new Date(startDate);
    // Vai para o domingo
    current.setDate(current.getDate() - current.getDay());
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(current);
      day.setDate(current.getDate() + i);
      days.push(day);
    }
    
    return days;
  };

  // Gera horários das 8h às 20h
  const generateHours = () => {
    const hours = [];
    for (let i = 8; i <= 20; i++) {
      hours.push(`${i.toString().padStart(2, '0')}:00`);
    }
    return hours;
  };

  // Formata o dia da semana (DOM, SEG, TER...)
  const formatWeekDay = (date: Date) => {
    const days = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
    return days[date.getDay()];
  };

  // Verifica se é hoje
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Inicializa a semana atual
  useEffect(() => {
    setCurrentWeek(generateWeekDays());
  }, []);

  return (
    <View style={styles.container}>
      {/* Cabeçalho com dias da semana */}
      <View style={styles.weekHeader}>
        {currentWeek.map((day, i) => (
          <Text key={i} style={styles.weekDayText}>
            {formatWeekDay(day)}
          </Text>
        ))}
      </View>

      {/* Dias do mês */}
      <View style={styles.daysContainer}>
        {currentWeek.map((day, i) => {
          const isSelected = day.toDateString() === selectedDay.toDateString();
          const isCurrent = isToday(day);

          return (
            <TouchableOpacity
              key={i}
              style={[
                styles.dayContainer,
                isCurrent && styles.currentDay,
                isSelected && styles.selectedDay
              ]}
              onPress={() => setSelectedDay(day)}
            >
              <Text style={[
                styles.dayText,
                isSelected && styles.selectedDayText,
                isCurrent && !isSelected && styles.currentDayText
              ]}>
                {day.getDate()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Lista de horários */}
      <ScrollView style={styles.hoursScroll}>
        {generateHours().map((hour, i) => (
          <TouchableOpacity
            key={i}
            style={[
              styles.hourItem,
              selectedHour === hour && styles.selectedHour
            ]}
            onPress={() => setSelectedHour(hour)}
          >
            <Text style={styles.hourText}>{hour}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    padding: 10,
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  weekDayText: {
    width: 40,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#555',
    fontSize: 14,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dayContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  dayText: {
    fontSize: 16,
    color: '#333',
  },
  currentDay: {
    backgroundColor: '#FFEEE0',
    borderWidth: 1,
    borderColor: '#FF7617',
  },
  currentDayText: {
    color: '#FF7617',
    fontWeight: 'bold',
  },
  selectedDay: {
    backgroundColor: '#FF7617',
  },
  selectedDayText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  hoursScroll: {
    flex: 1,
  },
  hourItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E2E0',
  },
  selectedHour: {
    backgroundColor: '#FFF5EF',
    borderLeftWidth: 3,
    borderLeftColor: '#FF7617',
  },
  hourText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
});
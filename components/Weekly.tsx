import { Task } from '@/utils/storage';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface WeeklyProps {
  tasks: Task[];
  selectedDay: Date;
  onSelectDay: (day: Date) => void;
}

export const Weekly = ({ tasks, selectedDay, onSelectDay }: WeeklyProps) => {
  const [currentWeek, setCurrentWeek] = useState<Date[]>([]);
  const PIXELS_PER_MINUTE = 1;
  const fallbackColors = ['#FFE8A3', '#D4A5ED', '#FFA3B1', '#A3D1FF'];

  const generateWeekDays = () => {
    if (isNaN(selectedDay.getTime())) {
      console.warn('Invalid selectedDay, using current date instead');
      selectedDay = new Date(); 
    }

    const days = [];
    const current = new Date(selectedDay);
    current.setDate(current.getDate() - current.getDay());

    for (let i = 0; i < 7; i++) {
      const day = new Date(current);
      day.setDate(current.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const processTasksForDay = () => {
    const dayTasks = tasks
      .filter(task => {
        const taskDate = task.startTime 
          ? new Date(task.startTime) 
          : task.createdAt 
            ? new Date(task.createdAt) 
            : new Date();

        if (isNaN(taskDate.getTime())) {
          console.warn('Invalid task date:', task);
          return false;
        }

        return (
          taskDate.getDate() === selectedDay.getDate() &&
          taskDate.getMonth() === selectedDay.getMonth() &&
          taskDate.getFullYear() === selectedDay.getFullYear()
        );
      })
      .map((task, index) => {

        let startTime = task.startTime 
          ? new Date(task.startTime) 
          : task.createdAt 
            ? new Date(task.createdAt) 
            : new Date();

        if (isNaN(startTime.getTime())) {
          console.warn('Invalid startTime, using current time:', task);
          startTime = new Date();
        }

        let duration = 1; 
        
        if (task.completed && task.endTime) {
          const endTime = new Date(task.endTime);
          if (!isNaN(endTime.getTime())) {
            duration = Math.max(1, Math.floor((endTime.getTime() - startTime.getTime()) / 60000));
          }
        } else {
          duration = Math.max(1, Math.min(1440, task.timeSpent || 30));
        }

        return {
          ...task,
          color: task.color || fallbackColors[index % fallbackColors.length],
          startTime: startTime.toISOString(),
          endTime: new Date(startTime.getTime() + duration * 60000).toISOString(),
          startMinutes: startTime.getHours() * 60 + startTime.getMinutes(),
          durationMinutes: duration,
        };
      })
      .sort((a, b) => a.startMinutes - b.startMinutes);

    const groupedTasks: any[][] = [];
    dayTasks.forEach(task => {
      let placed = false;
      for (const group of groupedTasks) {
        const lastTask = group[group.length - 1];
        const lastEnd = lastTask.startMinutes + lastTask.durationMinutes;
        if (task.startMinutes >= lastEnd) {
          group.push(task);
          placed = true;
          break;
        }
      }
      if (!placed) groupedTasks.push([task]);
    });

    return groupedTasks;
  };

  const formatTime = (date: Date) => {
    if (isNaN(date.getTime())) return '00:00';
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    setCurrentWeek(generateWeekDays());
  }, [selectedDay]);

  const taskGroups = processTasksForDay();
  const calendarHeight = 24 * 60 * PIXELS_PER_MINUTE;
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.weekHeader}>
        {currentWeek.map((day, i) => (
          <Text key={i} style={styles.weekDayText}>
            {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'][day.getDay()]}
          </Text>
        ))}
      </View>

      <View style={styles.daysContainer}>
        {currentWeek.map((day, i) => {
          const isSelected = day.toDateString() === selectedDay.toDateString();
          const isToday = new Date().toDateString() === day.toDateString();

          return (
            <TouchableOpacity
              key={i}
              style={[
                styles.dayContainer,
                isToday && styles.currentDay,
                isSelected && styles.selectedDay
              ]}
              onPress={() => onSelectDay(day)}
            >
              <Text style={[
                styles.dayText,
                isSelected && styles.selectedDayText,
                isToday && !isSelected && styles.currentDayText
              ]}>
                {day.getDate()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={[styles.calendarContainer, { height: calendarHeight }]}>
        {Array.from({ length: 25 }).map((_, i) => (
          <View 
            key={`line-${i}`} 
            style={[
              styles.timeLine,
              { top: i * 60 * PIXELS_PER_MINUTE }
            ]}
          >
            <Text style={styles.timeText}>{`${i.toString().padStart(2, '0')}:00`}</Text>
          </View>
        ))}

        {/* Linha do tempo atual */}
        <View
          style={{
            position: 'absolute',
            top: nowMinutes * PIXELS_PER_MINUTE,
            left: 0,
            right: 0,
            height: 2,
            backgroundColor: 'green',
          }}
        />

        <View style={styles.tasksContainer}>
          {taskGroups.map((group, groupIndex) => (
            <View key={`group-${groupIndex}`} style={styles.taskGroup}>
              {group.map(task => (
                <View
                  key={task.id}
                  style={[
                    styles.taskItem,
                    { 
                      top: task.startMinutes * PIXELS_PER_MINUTE,
                      height: Math.max(40, task.durationMinutes * PIXELS_PER_MINUTE),
                      backgroundColor: task.color,
                    }
                  ]}
                >
                  <View style={styles.taskContent}>
                    <Text style={styles.taskTitle} numberOfLines={1} ellipsizeMode="tail">
                      {task.title}
                    </Text>
                    <Text style={styles.taskTimeText}>
                      {formatTime(new Date(task.startTime))} - {formatTime(new Date(task.endTime))}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginBottom: 25,
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
  calendarContainer: {
    position: 'relative',
    marginLeft: 40,
    borderLeftWidth: 1,
    borderLeftColor: '#E2E2E0',
  },
  timeLine: {
    position: 'absolute',
    left: -50,
    right: 0,
    height: 0.5,
    backgroundColor: '#E2E2E0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    width: 45,
    textAlign: 'right',
    paddingRight: 5,
    fontSize: 12,
    color: '#555',
    marginTop: -18,
  },
  tasksContainer: {
    flex: 1,
    position: 'relative',
    minHeight: 0,
  },
  taskGroup: {
    position: 'absolute',
    top: 0,
    bottom: 0,
  },
  taskItem: {
    position: 'absolute',
    borderRadius: 12,
    padding: 10,
    backgroundColor: "red",
    justifyContent: 'flex-start',
    overflow: 'hidden',
    marginHorizontal: 34,
  },
  taskTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 2,
  },
  taskDescription: {
    color: 'white',
    fontSize: 12,
    opacity: 0.85,
  },
  taskTimeText: {
    color: 'white',
    fontSize: 10,
    opacity: 0.8,
  },
  taskContent: {
    flex: 1,
    justifyContent: 'center',
  },
});
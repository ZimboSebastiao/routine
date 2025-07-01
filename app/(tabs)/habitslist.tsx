// app/habits/index.tsx
import { EmptyHabitsState } from '@/components/EmptyHabitsState';
import { HabitCard } from '@/components/HabitCard';
import { deleteHabitCompletely } from '@/services/habitManager';
import { getHabits, Habit } from '@/utils/storage';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

export default function HabitsList() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadHabits = async () => {
    try {
      const storedHabits = await getHabits();
      setHabits(storedHabits);
    } catch (error) {
      console.error('Error loading habits:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadHabits();
    }, [])
  );

  const handleAddHabit = () => router.push('/newhabit');
  const handleEditHabit = (habitId: string) => router.push(`/edithabit?id=${habitId}`);

  const handleDeleteHabit = async (habitId: string) => {
    try {
      await deleteHabitCompletely(habitId);
      loadHabits(); 
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meus Hábitos</Text>
        <Pressable onPress={handleAddHabit} style={styles.addButton}>
          <Feather name="plus" size={24} color="white" />
        </Pressable>
      </View>

      {habits.length === 0 ? (
        <EmptyHabitsState onAddHabit={handleAddHabit} />
      ) : (
        <FlatList
          data={habits}
          renderItem={({ item }) => (
            <HabitCard 
              habit={item} 
              onEdit={handleEditHabit}
              onDelete={handleDeleteHabit}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F2EF',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#A278C6',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
});
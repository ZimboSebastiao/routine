import { deleteHabitCompletely } from '@/services/habitManager';
import { getCategoryById } from '@/utils/categoryUtils';
import { getHabits, Habit } from '@/utils/storage';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Card, IconButton } from 'react-native-paper';

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

  const handleAddHabit = () => {
    router.push('/newhabit');
  };

  const handleEditHabit = (habitId: string) => {
    router.push(`/edithabit?id=${habitId}`);
  };

	const handleDeleteHabit = async (habitId: string) => {
	try {
		await deleteHabitCompletely(habitId);
		loadHabits(); 
	} catch (error) {
		console.error('Error deleting habit:', error);
	}
	};

  const renderHabitItem = ({ item }: { item: Habit }) => {
    const category = getCategoryById(item.category.id);
    
    return (
      <Card style={styles.habitCard}>
        <Card.Content>
          <View style={styles.habitHeader}>
            <View style={styles.habitTitleContainer}>
              {category?.icon && (
                <Image 
                  source={category.icon} 
                  style={styles.categoryIcon}
                  resizeMode="contain"
                />
              )}
              <Text style={styles.habitTitle}>{item.title}</Text>
            </View>
            <View style={styles.habitActions}>
              <IconButton
                icon="pencil"
                size={20}
                onPress={() => handleEditHabit(item.id)}
              />
              <IconButton
                icon="trash-can"
                size={20}
                onPress={() => handleDeleteHabit(item.id)}
              />
            </View>
          </View>
          
          <View style={styles.habitInfo}>
            <View style={[styles.categoryBadge, { backgroundColor: category?.color || '#A278C6' }]}>
              <Text style={styles.categoryText}>{category?.name || 'Sem categoria'}</Text>
            </View>
            
            {item.hasGoal && item.endDate && (
              <View style={styles.detailRow}>
                <Feather name="flag" size={16} color="#666" />
                <Text style={styles.habitDetail}>
                  Meta: até {new Date(item.endDate).toLocaleDateString('pt-BR')}
                </Text>
              </View>
            )}
            
            {item.frequency.hasFrequency && (
              <View style={styles.detailRow}>
                <Feather name="calendar" size={16} color="#666" />
                <Text style={styles.habitDetail}>
                  {item.monthsGoal} meses, {item.frequency.selectedDays.length} dias/semana
                </Text>
              </View>
            )}
            
            {item.hasReminder && (
              <View style={styles.detailRow}>
                <Feather name="bell" size={16} color="#666" />
                <Text style={styles.habitDetail}>
                  Lembretes: {item.reminderTime} nos dias selecionados
                </Text>
              </View>
            )}
          </View>
        </Card.Content>
      </Card>
    );
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
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Nenhum hábito cadastrado</Text>
          <Pressable onPress={handleAddHabit} style={styles.addFirstButton}>
            <Text style={styles.addFirstButtonText}>Criar primeiro hábito</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={habits}
          renderItem={renderHabitItem}
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
  habitCard: {
    marginBottom: 12,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 2,
  },
  habitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  habitTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    width: 32,
    height: 32,
    marginRight: 12,
    borderRadius: 16,
  },
  habitTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  habitActions: {
    flexDirection: 'row',
  },
  habitInfo: {
    marginTop: 8,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  habitDetail: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  addFirstButton: {
    backgroundColor: '#A278C6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  addFirstButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
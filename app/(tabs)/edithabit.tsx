// app/edithabit.tsx
import CategorySelector from '@/components/CategorySelector';
import { editHabitWithNotifications } from '@/services/habitManager';
import { Category } from '@/types/category';
import { getHabits, Habit } from '@/utils/storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Card, TextInput } from 'react-native-paper';

export default function EditHabit() {
  const { id } = useLocalSearchParams();
  const [habit, setHabit] = useState<Habit | null>(null);
  const [title, setTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadHabit = async () => {
      const habits = await getHabits();
      const foundHabit = habits.find(h => h.id === id);
      if (foundHabit) {
        setHabit(foundHabit);
        setTitle(foundHabit.title);
        setSelectedCategory(foundHabit.category);
      }
    };

    loadHabit();
  }, [id]);

  const handleSave = async () => {
    if (!habit || !title.trim() || !selectedCategory) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
      return;
    }

    try {
      await editHabitWithNotifications(habit.id, {
        title,
        category: selectedCategory
      });
      
      Alert.alert('Sucesso', 'Hábito atualizado com sucesso!');
      router.back();
    } catch (error) {
      console.error('Error updating habit:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o hábito');
    }
  };

  if (!habit) {
    return (
      <View style={styles.container}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <TextInput
            label="Título do hábito"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />

          <CategorySelector 
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          <Button 
            mode="contained" 
            onPress={handleSave}
            style={styles.saveButton}
          >
            Salvar Alterações
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F2EF',
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'white',
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: '#A278C6',
    paddingVertical: 8,
  },
});
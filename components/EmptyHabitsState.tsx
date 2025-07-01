import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface EmptyHabitsStateProps {
  onAddHabit: () => void;
}

export const EmptyHabitsState = ({ onAddHabit }: EmptyHabitsStateProps) => (
  <View style={styles.emptyState}>
    <Text style={styles.emptyText}>Nenhum hábito cadastrado</Text>
    <Pressable onPress={onAddHabit} style={styles.addFirstButton}>
      <Text style={styles.addFirstButtonText}>Criar primeiro hábito</Text>
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
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
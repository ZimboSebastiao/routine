import { getCategoryById } from '@/utils/categoryUtils';
import { Habit } from '@/utils/storage';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Card, IconButton } from 'react-native-paper';

interface HabitCardProps {
  habit: Habit;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const HabitCard = ({ habit, onEdit, onDelete }: HabitCardProps) => {
  const category = getCategoryById(habit.category.id);
  
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
            <Text style={styles.habitTitle}>{habit.title}</Text>
          </View>
          <View style={styles.habitActions}>
            <IconButton
              icon="pencil"
              size={20}
              onPress={() => onEdit(habit.id)}
            />
            <IconButton
              icon="trash-can"
              size={20}
              onPress={() => onDelete(habit.id)}
            />
          </View>
        </View>
        
        <View style={styles.habitInfo}>

          <View style={styles.containerFlags}>
			{habit.hasGoal && habit.endDate && (
				<View style={styles.detailRow}>
				<Feather name="flag" size={16} color="#666" />
				<Text style={styles.habitDetail}>
					{new Date(habit.endDate).toLocaleDateString('pt-BR')}
				</Text>
				</View>
			)}
			
			{habit.frequency.hasFrequency && (
				<View style={styles.detailRow}>
				<Feather name="calendar" size={16} color="#666" />
				<Text style={styles.habitDetail}>
					{habit.monthsGoal} meses, {habit.frequency.selectedDays.length} dias
				</Text>
				</View>
			)}
		  </View>
          <View style={[styles.categoryBadge, { backgroundColor: category?.color || '#A278C6' }]}>
            <Text style={styles.categoryText}>{category?.name || 'Sem categoria'}</Text>
          </View>
          
          {habit.hasReminder && (
            <View style={styles.detailRow}>
              <Feather name="bell" size={16} color="#666" />
              <Text style={styles.habitDetail}>
                Lembretes: {habit.reminderTime} nos dias selecionados
              </Text>
            </View>
          )}
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  habitCard: {
    marginBottom: 10,
    backgroundColor: 'white',
    borderRadius: 20,
  },
  habitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
},
habitTitleContainer: {
	flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
},
categoryIcon: {
	width: 60,
    height: 60,
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
	marginTop: 4,
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
    fontSize: 13,
    color: '#666',
    marginLeft: 8,
  },
  containerFlags: {
	flexDirection: "row-reverse",
	justifyContent: "space-between",
	alignItems: "center",
  }
});
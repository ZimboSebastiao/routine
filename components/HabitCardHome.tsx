import { getCategoryById } from '@/utils/categoryUtils';
import { Habit } from '@/utils/storage';
import { Feather } from '@expo/vector-icons';
import { Play } from 'lucide-react-native';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Card } from 'react-native-paper';

interface HabitCardProps {
  habit: Habit;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const HabitCardHome = ({ habit, onEdit, onDelete }: HabitCardProps) => {
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
            <Play 
			color={"#FF7617"}
              size={23}
              
            />
          </View>
        </View>
        
        <View style={styles.habitInfo}>

          
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
	borderWidth: 1,
	borderColor: "white",

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
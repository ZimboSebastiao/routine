import { getCategoryById } from '@/utils/categoryUtils';
import { getHabitById, getTasks, Habit, saveTask, Task } from '@/utils/storage';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
	Modal,
	Pressable,
	SectionList,
	StyleSheet,
	Text,
	TextInput,
	View
} from 'react-native';
import { Card } from 'react-native-paper';

interface GroupedTasks {
  title: string;
  totalTime: string;
  data: Task[];
}

export default function HabitTasksScreen() {
  const { habitId } = useLocalSearchParams();
  const [habit, setHabit] = useState<Habit | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [groupedTasks, setGroupedTasks] = useState<GroupedTasks[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskNotes, setNewTaskNotes] = useState('');
  const [isNotesCategory, setIsNotesCategory] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      const loadedHabit = await getHabitById(habitId as string);
      if (loadedHabit) {
        setHabit(loadedHabit);
        const category = getCategoryById(loadedHabit.category.id);
        setIsNotesCategory(category?.name === 'Notas');
        
        const loadedTasks = await getTasks(habitId as string);
        setTasks(loadedTasks);
        groupTasksByDay(loadedTasks);
      }
    };
    
    loadData();
  }, [habitId]);

  const groupTasksByDay = (tasks: Task[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    
    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    
    const older = new Date(today);
    older.setDate(older.getDate() - 4);

    const grouped: {[key: string]: Task[]} = {
      'Hoje': [],
      'Ontem': [],
      'Dois dias atrás': [],
      'Três dias atrás': [],
      'Mais antigo': []
    };

    tasks.forEach(task => {
      const taskDate = new Date(task.createdAt);
      taskDate.setHours(0, 0, 0, 0);
      
      if (taskDate.getTime() === today.getTime()) {
        grouped['Hoje'].push(task);
      } else if (taskDate.getTime() === yesterday.getTime()) {
        grouped['Ontem'].push(task);
      } else if (taskDate.getTime() === twoDaysAgo.getTime()) {
        grouped['Dois dias atrás'].push(task);
      } else if (taskDate.getTime() === threeDaysAgo.getTime()) {
        grouped['Três dias atrás'].push(task);
      } else {
        grouped['Mais antigo'].push(task);
      }
    });

    // Converter para o formato SectionList e calcular tempo total
    const sections: GroupedTasks[] = Object.keys(grouped)
      .filter(key => grouped[key].length > 0)
      .map(key => {
        const totalSeconds = grouped[key].reduce((sum, task) => sum + (task.timeSpent || 0), 0);
        return {
          title: key,
          totalTime: formatTotalTime(totalSeconds),
          data: grouped[key]
        };
      });

    setGroupedTasks(sections);
  };


  const formatTotalTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatTaskTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hrs > 0 ? `${hrs}h ` : ''}${mins > 0 ? `${mins}m ` : ''}${secs}s`;
  };

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;
    
    try {
      const newTask = await saveTask({
        habitId: habitId as string,
        title: newTaskTitle,
        notes: isNotesCategory ? newTaskNotes : undefined,
        createdAt: new Date().toISOString(),
        completed: false
      });
      
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      groupTasksByDay(updatedTasks);
      setNewTaskTitle('');
      setNewTaskNotes('');
      setModalVisible(false);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleTimerAction = async (taskId: string) => {
    if (isNotesCategory) return;
    const task = tasks.find(t => t.id === taskId);
    if (task?.completed) return;

    router.push({
      pathname: '/(tabs)/timer',
      params: { taskId }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tarefas para: {habit?.title}</Text>
      
      <SectionList
        sections={groupedTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.taskCard}>
            <Card.Content>
              <View style={styles.taskHeader}>
                <Text style={styles.taskTitle}>{item.title}</Text>
                {!isNotesCategory && !item.completed && (
                  <Pressable 
                    onPress={() => handleTimerAction(item.id)}
                    style={styles.playButton}
                  >
                    <FontAwesome name="play" size={20} color="#FF7617" />
                  </Pressable>
                )}
                {!isNotesCategory && item.timeSpent && (
                  <Text style={styles.timeText}>{formatTaskTime(item.timeSpent)}</Text>
                )}
              </View>
              
              {isNotesCategory && item.notes && (
                <Text style={styles.taskNotes}>{item.notes}</Text>
              )}
              
              <Text style={styles.createdAt}>
                Criado em: {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </Card.Content>
          </Card>
        )}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {!isNotesCategory && (
              <Text style={styles.sectionTime}>Total: {section.totalTime}</Text>
            )}
          </View>
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhuma tarefa criada ainda</Text>
        }
      />
      
     
      <Pressable
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Feather name="plus" size={24} color="white" />
      </Pressable>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nova Tarefa</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Título da tarefa"
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
            />
            
            {isNotesCategory && (
              <TextInput
                style={[styles.input, styles.notesInput]}
                placeholder="Anotações"
                multiline
                numberOfLines={4}
                value={newTaskNotes}
                onChangeText={setNewTaskNotes}
              />
            )}
            
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </Pressable>
              
              <Pressable
                style={[styles.modalButton, styles.addButtonModal]}
                onPress={handleAddTask}
              >
                <Text style={styles.buttonText}>Adicionar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  taskCard: {
    marginBottom: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  timeText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 14,
  },
  taskNotes: {
    color: '#666',
    marginTop: 8,
    fontSize: 14,
  },
  createdAt: {
    color: '#999',
    fontSize: 12,
    marginTop: 8,
  },
  listContent: {
    paddingBottom: 80,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 32,
  },
  addButton: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    backgroundColor: '#6B1E9C',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: '#ddd',
  },
  addButtonModal: {
    backgroundColor: '#6B1E9C',
  },
  buttonText: {
    color: 'white',
  },
  
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionTime: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  

});
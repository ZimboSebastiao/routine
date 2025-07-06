import { getCategoryById } from '@/utils/categoryUtils';
import { deleteTask, getHabitById, getTasks, Habit, saveTask, Task } from '@/utils/storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Play, Plus, Trash2, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
	Alert,
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




const handleDeleteTask = async (taskId: string) => {
  Alert.alert(
    "Confirmar exclusão",
    "Tem certeza que deseja excluir esta tarefa?",
    [
      {
        text: "Cancelar",
        style: "cancel"
      },
      { 
        text: "Excluir", 
        onPress: async () => {
          try {
            await deleteTask(taskId);
            const updatedTasks = tasks.filter(task => task.id !== taskId);
            setTasks(updatedTasks);
            groupTasksByDay(updatedTasks);
          } catch (error) {
            console.error('Error deleting task:', error);
          }
        }
      }
    ]
  );
};

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
		  completed: false,
		  color: '',
		  description: '',
		  startTime: '',
		  endTime: ''
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
		<View style={styles.titleIconContainer}>
			<Text style={styles.titleContainer}>Plano Diário <Text style={styles.title}>{habit?.title}</Text></Text>
			<Pressable 
			onPress={() => router.push('/')}
			style={({ pressed }) => [
				styles.iconView,
				{
				transform: [{ scale: pressed ? 0.95 : 1 }],
				opacity: pressed ? 0.8 : 1,
				}
			]}
			>
			{({ pressed }) => (
				<X 
				size={34} 
				color={pressed ? '#A278C6' : '#000000'}
				/>
			)}
			</Pressable>
		</View>
      
      
      	<SectionList
			sections={groupedTasks}
			keyExtractor={(item) => item.id}
			renderItem={({ item }) => (
          	<Card style={styles.taskCard}>
				<Card.Content>
					<View style={styles.taskHeader}>
						<Text style={styles.taskTitle}>{item.title}</Text>
						<View style={styles.taskActions}>
						{!isNotesCategory && !item.completed && (
							<Pressable 
							onPress={() => handleTimerAction(item.id)}
							style={styles.actionButton}
							>
							<View style={styles.playButton}>
								<Play  size={20} color="white" />
							</View>
							</Pressable>
						)}
						{!isNotesCategory && item.timeSpent && (
							<Text style={styles.timeText}>{formatTaskTime(item.timeSpent)}</Text>
						)}
						<Pressable 
							onPress={() => handleDeleteTask(item.id)}
							style={styles.actionButton}
						>
						<View style={styles.playButton}>
							<Trash2 size={20} color="white" />
						</View>
						</Pressable>
						</View>
					</View>		
					{isNotesCategory && item.notes && (
						<Text style={styles.taskNotes}>{item.notes}</Text>
					)}
				
					<Text style={styles.createdAt}>
						{new Date(item.createdAt).toLocaleDateString()}
					</Text>
				</Card.Content>
          	</Card>
			)}
			renderSectionHeader={({ section }) => (
          	<View style={styles.sectionHeader}>
				<Text style={styles.sectionTitle}>{section.title}</Text>
				{!isNotesCategory && (
					<Text style={styles.sectionTime}>{section.totalTime}</Text>
				)}
          	</View>
        	)}
			contentContainerStyle={styles.listContent}
			ListEmptyComponent={
          		<Text style={styles.emptyText}>Nenhuma tarefa criada ainda</Text>
        	}/>
			<Pressable style={styles.addButton} onPress={() => setModalVisible(true)}>
        		<Plus size={24} color="white" />
      		</Pressable>
      
			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => setModalVisible(false)}>
        		<View style={styles.modalContainer}>
          			<View style={styles.modalContent}>
						<Text style={styles.modalTitle}>Nova Tarefa</Text>
						<TextInput
							style={styles.input}
							placeholder="Título da tarefa"
							value={newTaskTitle}
							onChangeText={setNewTaskTitle} />
							{isNotesCategory && (
						<TextInput
							style={[styles.input, styles.notesInput]}
							placeholder="Anotações"
							multiline
							numberOfLines={4}
							value={newTaskNotes}
							onChangeText={setNewTaskNotes} />)}
						<View style={styles.modalButtons}>
							<Pressable
								style={[styles.modalButton, styles.cancelButton]}
								onPress={() => setModalVisible(false)}>
								<Text style={styles.buttonText}>Cancelar</Text>
							</Pressable>
							<Pressable
								style={[styles.modalButton, styles.addButtonModal]}
								onPress={handleAddTask}>
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
    backgroundColor: "#F8F2EF",
  },
  titleContainer: {
    marginVertical: 60,
    marginBottom: 40,
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  titleIconContainer: {
	  flexDirection: "row",
	  justifyContent: "space-between",
	  alignItems: "center",
	  width: "94%",
	},
	iconView: {
		justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: 50,
    backgroundColor: "white",
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "white",
},
title: {
	fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#6B1E9C',
},
taskCard: {
    backgroundColor: 'white',
    borderRadius: 15,
	borderWidth: 1.5,
	borderColor: "white",
    elevation: 4,
	margin: 15,
	marginBottom: 5,
},
taskHeader: {
	flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
},
taskTitle: {
	fontSize: 19,
    fontWeight: '600',
    flex: 1,
},
playButton: {
	backgroundColor: "#6B1E9C",
	flexDirection: 'row',
    alignItems: 'center',
    padding: 7,
	borderRadius: 50,
	borderWidth: 0.8,
	borderColor: "#6B1E9C",
	elevation: 2,
},
timeText: {
	margin: 0,
    color: '#333',
    fontSize: 14,
},
taskNotes: {
	backgroundColor: 'white',
	color: '#667',
    marginTop: 0,
    fontSize: 15,
	padding: 10,
	marginBottom: 10,
	borderWidth: 0.9,
	borderColor: "white",
	borderRadius: 15,
	elevation: 2,
},
createdAt: {
	width: "35%",
	color: '#6B1E9C',
    fontSize: 12,
	fontWeight: "600",
    marginTop: 0,
	padding: 6,
	textAlign: "center",
	borderWidth: 0.8,
	borderColor: "white",
	borderRadius: 20,
	backgroundColor: "white",
	elevation: 2,
},
listContent: {
    paddingBottom: 50,
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
    marginLeft: 15,
	paddingBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionTime: {
    fontSize: 16,
	paddingRight: 15,
    color: '#333',
    fontWeight: '600',
  },
taskActions: {
  flexDirection: 'row',
  alignItems: 'center',
//   backgroundColor: "red"
},
actionButton: {
  marginLeft: 12,
  padding: 4,
},

});
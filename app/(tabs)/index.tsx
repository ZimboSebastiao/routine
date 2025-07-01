import { EmptyHabitsState } from '@/components/EmptyHabitsState';
import { HabitCardHome } from '@/components/HabitCardHome';
import UserAvatar from '@/components/UserAvatar';
import WeeklyCalendar from "@/components/WeeklyCalendar";
import { useGreeting } from "@/hooks/useGreeting";
import { deleteHabitCompletely } from '@/services/habitManager';
import { formatFullDateCapitalized } from "@/utils/dateFormatter";
import { getHabits, Habit } from '@/utils/storage';
import { Image } from 'expo-image';
import { useFocusEffect, useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import {
	FlatList,
	Pressable,
	StyleSheet,
	Text,
	View
} from "react-native";



export default function HomeScreen() {
	const router = useRouter();
	const greeting = useGreeting();
	const today = new Date();
	const [habits, setHabits] = useState<Habit[]>([]);
	const [loading, setLoading] = useState(true);

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
		<View style={styles.stepContainer}>
			<View>
				<Text style={styles.textStepContainer}>
					{greeting}, Zimbo
				</Text>
				<Text style={styles.todayText}>{formatFullDateCapitalized(today)}</Text>
			</View>

			<View>
				<UserAvatar 
					size={60}
					defaultColor="#FF5722"
					editable={false}
				/>
			</View>
		</View>
		<WeeklyCalendar />

		<View style={styles.reminderContainer}>
			<Text style={styles.reminderTitle}>Monitore sua rotina</Text>
			<View>
				<View style={styles.imageContainer}>
					<View>
						<Text style={styles.effectText}>Nunca perca sua rotina matinal!</Text>
						<Text style={styles.effectText}>Receba um aviso e fique no ritmo.</Text>
					</View>

					<View>
						<Image 
							source={require('@/assets/images/date.png')} 
							style={styles.image}
						/>
					</View>
				</View>
				</View>
			<Pressable
				onPress={() => router.push('/insights')}
					style={({ pressed }) => [
					styles.reminderButton,
					{
						transform: [{ scale: pressed ? 0.95 : 1 }],
						shadowOpacity: pressed ? 0.4 : 0.2,
						elevation: pressed ? 6 : 3,
					},
					]}
			>
				{({ pressed }) => (
				<Text style={[
					styles.reminderTextButton,
						{ color: pressed ? '#A278C6' : '#6B1E9C' }
					]}>
						Visualizar
					</Text>
					)}
			</Pressable>
		</View>

		<View style={styles.dailyContainer}>
			<Text style={styles.textDailyConatiner}>Rotina diária</Text>
			<Pressable
				onPress={() => router.push('/habitslist')}
				style={({ pressed }) => [
				{
					transform: [{ scale: pressed ? 0.95 : 1 }],
					shadowOpacity: pressed ? 0.4 : 0.2,
				},
				]}
			>
				{({ pressed }) => (
				<Text
					style={[
					styles.textButtonInsight,
						{ color: pressed ? '#6B1E9C' : 'gray' }
					]}>
					Exibir todas
					</Text>
					)}
			</Pressable>
		</View>


		{habits.length === 0 ? (
		<EmptyHabitsState onAddHabit={handleAddHabit} />
			) : (
			<FlatList
			data={habits}
			renderItem={({ item }) => (
				<HabitCardHome 
				habit={item} 
				onEdit={handleEditHabit}
				onDelete={handleDeleteHabit}
				/>
			)}
			keyExtractor={(item) => item.id}
			contentContainerStyle={styles.listContent}
			style={styles.habitsList}
			/>
		)}
	
		<View style={styles.plusContainer}>
			<Pressable
				onPress={() => router.push('/newhabit')}
				style={({ pressed }) => [
				styles.iconView,
				{
					transform: [{ scale: pressed ? 0.95 : 1 }],
					shadowOpacity: pressed ? 0.4 : 0.2,
					elevation: pressed ? 6 : 3,
				},
				]}
			>
				<Plus size={40} color="#fff" />
			</Pressable>
    	</View>



	</View>
  );
}

const styles = StyleSheet.create({
  	container: {
		flex: 1,
		backgroundColor: "#F8F2EF",
	},
	stepContainer: {
		marginVertical: 60,
		marginBottom: 0,
		flexDirection: "row",
		justifyContent: "space-between",
		alignContent: "center",
		alignItems: "flex-start",
		marginLeft: 10,
	},
	textStepContainer: {
		fontSize: 25,
		fontWeight: "bold",
		paddingBottom: 10,
  	},
	todayText: {
		fontWeight: "bold",
		color: "gray",
	},
	reminderContainer: {
		backgroundColor: "#bea3d9",
		marginLeft: 15,
		width: "92%",
		padding: 14,
		margin: 10,
		paddingBottom: 8,
		paddingTop: 8,
		borderWidth: 1,
		borderColor: "#bea3d9",
		borderRadius: 18,
	},
	reminderTitle: {
		fontSize: 19,
		fontWeight: "bold",
	},
	reminderButton: {
		backgroundColor: "#FDF7FF",
		padding: 8,
		width: "40%",
		borderRadius: 20,
		justifyContent: "center",
		alignItems: "center"
	},
	reminderTextButton: {
		fontWeight: "bold",
	},
	imageContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		alignContent: "center",
	},
	effectText: {
		color: "#2d2c2e",
		fontSize: 14.6,
	},
	image: {
		width: 125,
		height: 90,
		right: 20
	},
	dailyContainer: {
		width: "96%",
		marginTop: 5,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		alignContent: "center",
	},
	textDailyConatiner: {
		fontSize: 20,
		marginLeft: 15,
		fontWeight: "bold",
	},
	textButtonInsight: {
		fontSize: 16,
		fontWeight: "bold",
		color: "gray",
	},
	iconView: {
		justifyContent: "center",
		alignItems: "center",
		width: 60,
		height: 60,
		backgroundColor: "#6B1E9C",
		borderRadius: 30,
		borderWidth: 1,
		borderColor: "#6B1E9C",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 4,
  	},
	plusContainer: {
		position: "absolute",
		bottom: 25,
		right: 25,
	},
  	listContent: {
    	paddingBottom: 20,
  },
  habitsContainer: {
    flex: 1,
    marginTop: 10,
  },
  habitsList: {
    flex: 1,
    width: '92%',
	marginLeft: 15,
	marginTop: 20
  },

});

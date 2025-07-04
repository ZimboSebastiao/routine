import BarChartCustom from '@/components/BarChartCustom';
import { getHabitsCount } from '@/utils/habitsCounter';
import { getCurrentWeekInfo, getUserPoints } from '@/utils/pointsSystem';
import { getWeeklyTime, updateWeeklyTimeFromTasks } from '@/utils/weeklyTimeTracker';
import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { X } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { captureRef } from 'react-native-view-shot';
import tasks from './tasks';




export default function Insights() {
	const router = useRouter();
	const [weeklyPoints, setWeeklyPoints] = useState(0);
	const [daysRemaining, setDaysRemaining] = useState(7);
	const [weeklyTime, setWeeklyTime] = useState(0);
	const [habitsCount, setHabitsCount] = useState(0);
	const shareViewRef = useRef<View>(null);
	const [isSharing, setIsSharing] = useState(false);


	const onShareProgress = async () => {
	try {
		setIsSharing(true); 
		await new Promise(resolve => setTimeout(resolve, 100)); 

		if (shareViewRef.current) {
		const uri = await captureRef(shareViewRef, {
			format: 'png',
			quality: 1,
			// width: 2080,
			// height: 1920,
		});

		const fileUri = `${FileSystem.cacheDirectory}progresso.png`;
		await FileSystem.copyAsync({ from: uri, to: fileUri });

		await Sharing.shareAsync(fileUri);
		}
	} catch (error) {
		console.error('Erro ao compartilhar:', error);
	} finally {
		setIsSharing(false);
	}
	};




	useEffect(() => {
		const loadData = async () => {
		const points = await getUserPoints();
		const count = await getHabitsCount();
		const weekInfo = await getCurrentWeekInfo();
		
		await updateWeeklyTimeFromTasks();
		const time = await getWeeklyTime();
		
		setWeeklyPoints(points);
		setHabitsCount(count);
		setDaysRemaining(weekInfo.daysRemaining);
		setWeeklyTime(time);
	};
	
	loadData();
	}, [tasks]);


	const formatTime = (seconds: number): string => {
	const hours = Math.floor(seconds / 3600); 
	const remainingSeconds = seconds % 3600;
	const minutes = Math.floor(remainingSeconds / 60);
	return `${hours}h ${minutes}min`;
	};

	useEffect(() => {
	const loadPoints = async () => {
		const points = await getUserPoints();
		const weekInfo = await getCurrentWeekInfo();
		setWeeklyPoints(points);
		setDaysRemaining(weekInfo.daysRemaining);
	};
	
	loadPoints();
	}, [tasks]);

	

	
  return (
	 <SafeAreaProvider style={styles.container}>
		
		<View style={styles.titleIconContainer}>
			<Text style={styles.titleContainer}>Evolução e percepções</Text>
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

		<ScrollView>
			 <View style={styles.shareContainer} ref={shareViewRef} collapsable={false}>
			 <BarChartCustom />

			 <View style={styles.cardContainer}>
				<View style={styles.cardGroupText}>
					<View>
						<Text style={styles.cardContainerTitle}>Pontos Obtidos</Text>
						<Text style={styles.cardContainerText}>Nesta semana</Text>
					</View>
					<View style={styles.cardPoints}>
						<Text style={styles.cardNumber}>{weeklyPoints}</Text>
						<Text style={styles.cardName}>Pontos</Text>
					</View>
				</View>

				<View style={styles.resumeContainer}>
					<View>
						<Text style={styles.resumeTexts}>Hábitos</Text>
						<Text style={styles.resumeDatas}>{habitsCount}</Text>
					</View>
					<View style={styles.separator} />
					<View>
						<Text style={styles.resumeTexts}>Restando</Text>
						<Text style={styles.resumeDatas}>{daysRemaining}</Text>
					</View>
					<View style={styles.separator} />
					<View>
						<Text style={styles.resumeTexts}>Horas</Text>
						<Text style={styles.resumeDatas}>{formatTime(weeklyTime)}</Text>
					</View>
				</View>
				{!isSharing && (
				<View style={styles.saveContainer}>
					<Pressable
						onPress={onShareProgress}
						style={({ pressed }) => [
						styles.buttonSave,
						{
							transform: [{ scale: pressed ? 0.95 : 1 }],
							opacity: pressed ? 0.8 : 1,
						}
						]}
					>
						{({ pressed }) => (
						<Text style={[
							styles.textSave,
							{ color: pressed ? '#f0f0f0' : 'white' }
						]}>
							Compartilhar progresso
						</Text>
						)}
					</Pressable>
				</View>
				)}
			 </View>
			</View>
		</ScrollView>

	 </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
	backgroundColor: "#F8F2EF",
  },
  shareContainer: {
	backgroundColor: "#F8F2EF",
  },
  titleContainer: {
	  marginVertical: 60,
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
	saveContainer: {
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
	},
	buttonSave: {
		backgroundColor: "#A278C6",
		padding: 20,
		marginBottom: 20,
		width: "94%",
		borderRadius: 30,
		elevation: 3,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 4,
	},
	textSave: {
		fontSize: 17,
		color: "white",
		fontWeight: "bold",
		textAlign: "center",
	},
	cardContainer: {
		height: "50%",
		borderTopLeftRadius: 35,
		borderTopRightRadius: 35,
		backgroundColor: "white",
	},
	cardGroupText: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 20,
		marginTop: 35,
		paddingTop: 0,
	},
	cardContainerTitle: {
		fontSize: 20,
		fontWeight: "bold",
	},
	cardContainerText: {
		fontSize: 14,
		color: "gray",
	},
	cardNumber: {
		color: "#A6511E",
		fontSize: 20,
		fontWeight: "bold",
	},
	cardName: {
		color: "gray",
		fontSize: 20,
	},
	cardPoints: {
		flexDirection: "row",
		gap: 6
	},
	resumeContainer: {
		padding: 20,
		flexDirection: "row",
		justifyContent: "space-between",
	},
	separator: {
		width: 1,
		height: "100%",
		backgroundColor: '#ccc',
	},
	resumeTexts: {
		color: "gray",
		fontSize: 15,
	},
	resumeDatas:
	{
		fontSize: 18,
		fontWeight: "bold",
		textAlign: "center"
	}

});

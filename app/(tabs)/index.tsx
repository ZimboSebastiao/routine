import UserAvatar from '@/components/UserAvatar';
import WeeklyCalendar from "@/components/WeeklyCalendar";
import { useGreeting } from "@/hooks/useGreeting";
import { formatFullDateCapitalized } from "@/utils/dateFormatter";
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import {
	Pressable,
	StyleSheet,
	Text,
	View
} from "react-native";


export default function HomeScreen() {
	const router = useRouter();
	const greeting = useGreeting();
	const today = new Date();

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
			<Text style={styles.reminderTitle}>Ative o lembrete</Text>
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
				onPress={() => router.push('/newhabit')}
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
						Ativar agora
					</Text>
					)}
			</Pressable>
		</View>

		<View style={styles.dailyContainer}>
			<Text style={styles.textDailyConatiner}>Rotina diária</Text>
		</View>

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
		marginBottom: 30,
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
		// resizeMode: 'contain',
		right: 20
	},
	dailyContainer: {
		backgroundColor: "yellow",
	},
	textDailyConatiner: {
		fontSize: 20,
		marginLeft: 15,
		fontWeight: "bold",
	},
	iconView: {
		justifyContent: "center",
		alignItems: "center",
		width: 60,
		height: 60,
		backgroundColor: "#642D08",
		borderRadius: 30,
		borderWidth: 1,
		borderColor: "#642D08",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 4,
  	},
	plusContainer: {
		position: "absolute",
		bottom: 25,
		right: 25,
	},
});

import UserAvatar from '@/components/UserAvatar';
import WeeklyCalendar from "@/components/WeeklyCalendar";
import { useGreeting } from "@/hooks/useGreeting";
import { formatFullDateCapitalized } from "@/utils/dateFormatter";
import {
	StyleSheet,
	Text,
	View
} from "react-native";


export default function HomeScreen() {
const greeting = useGreeting();
const today = new Date();

  return (
	<View style={styles.container}>
		<View style={styles.stepContainer}>
			<View>
				<Text style={styles.textStepContainer}>
					{greeting}, Zimbo
				</Text>
				<Text>{formatFullDateCapitalized(today)}</Text>
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

		<View style={styles.dailyContainer}>
			<Text style={styles.textDailyConatiner}>Rotina diária</Text>
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
		fontSize: 22,
		fontWeight: "bold",
		paddingBottom: 10,
  	},
	dailyContainer: {
		backgroundColor: "yellow",
	},
	textDailyConatiner: {
		fontSize: 17,
		marginLeft: 15,
		fontWeight: "bold",
	},
});

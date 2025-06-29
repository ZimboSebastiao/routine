import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function Insights() {
	const router = useRouter();
	const [checked, setChecked] = React.useState(false);
	const [checked2, setChecked2] = React.useState(false);
	const [date, setDate] = useState(new Date());
	const [showPicker, setShowPicker] = useState(false);
	const [displayValue, setDisplayValue] = useState('');
	const [diasSelecionados, setDiasSelecionados] = useState<number[]>([]);
	const [isSwitchOn, setIsSwitchOn] = React.useState(false);
	const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

  	const scaleSize = 1.7;
	
	
	const onChange = (event: any, selectedDate?: Date) => {
		setShowPicker(Platform.OS === 'ios');
		if (selectedDate) {
		setDate(selectedDate);
		setDisplayValue(selectedDate.toLocaleDateString('pt-BR')); 
		}
	};

	

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

			<View style={styles.saveContainer}>
				<Pressable
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
		</ScrollView>

	 </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
	}

});

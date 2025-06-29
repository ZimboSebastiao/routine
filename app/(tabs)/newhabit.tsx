import MonthPicker from '@/components/MonthPicker';
import WeeklyFrequency from '@/components/WeeklyFrequency';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { Calendar, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Avatar, Checkbox, Switch } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function NewHabit() {
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
			<Text style={styles.titleContainer}>Novo hábito</Text>
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

		<View style={styles.avatarContainer}>
			<Avatar.Image size={180} source={require('@/assets/images/flow.jpg')} />
		</View>
		<ScrollView>
		<View style={styles.forms}>
			<View>
				<Text style={styles.textTitle}>Título do hábito</Text>
				<TextInput
					style={styles.formInput}
					placeholder="Digite aqui"
					placeholderTextColor={"#d1d1d1"}
				/>
			</View>

			<View>
				<View style={styles.checkbocContainer}>
					<Text style={styles.textTitle}>Defina uma meta</Text>
					<Checkbox
						status={checked ? 'checked' : 'unchecked'}
						onPress={() => {setChecked(!checked);}}
						color="#A278C6"
					/>
				</View>
				
				<View style={styles.container}>
					<View style={styles.goalContainer}>
						{/* Input com ícone integrado */}
						<View style={styles.inputContainer}>
							<TextInput
							style={styles.formGoal}
							placeholder="Data"
							value={displayValue}
							editable={false} 
							/>
							<TouchableOpacity 
							onPress={() => setShowPicker(true)}
							style={styles.iconCalendar}
							
							>
							<Calendar width={24} height={24} color="gray" />
							</TouchableOpacity>
						</View>

							{showPicker && (
								<DateTimePicker
								value={date}
								mode="date"
								display={Platform.OS === 'ios' ? 'spinner' : 'default'}
								onChange={onChange}
								locale="pt-BR" 
								/>
							)}

						<MonthPicker />
					</View>

				</View>

			</View>


			<View style={styles.daysContainer}>
				<View style={styles.checkbocContainer}>
					<Text style={styles.textTitle}>Frequência</Text>
					<Checkbox
						status={checked2 ? 'checked' : 'unchecked'}
						onPress={() => {setChecked2(!checked2);}}
						color="#A278C6"
					/>
				</View>

				<View>
					<WeeklyFrequency onChange={(dias) => setDiasSelecionados(dias)} />
				</View>
			</View>

			<View>
				<View style={styles.checkbocContainer}>
					<Text style={styles.textTitle}>Receber lembretes</Text>
					<View style={{ transform: [{ scaleX: scaleSize }, { scaleY: scaleSize }] }}>
					<Switch 
						value={isSwitchOn} 
						onValueChange={onToggleSwitch}
						color="#A278C6" 
						style={styles.switchContainer}
					/>
					</View>
				</View>
			</View>

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
						Salvar Hábito
					</Text>
					)}
				</Pressable>
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
	avatarContainer: {
	  marginBottom: 30,
	  alignItems: "center",
	},
	forms: {
		marginLeft: 15,
	},
	textTitle: {
		fontSize: 18,
		color: "gray"
	},
	formInput: {
		height: 55,
		width: '94%',
		borderWidth: 1,
		borderColor: 'white',
		borderRadius: 10,
		backgroundColor: 'white',
		fontSize: 18,
		color: "gray",
		marginVertical: 12,
	},
	checkbocContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		alignContent: "center",
		width: "94%",
		marginBottom: 30,
	},
	formGoal: {
		width: "100%",
		backgroundColor: 'white',
		fontSize: 18,
		color: '#333',
		height: 60,
		marginVertical: 12,
		borderRadius: 10,
	},
	inputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		width: "44%",
		backgroundColor: '#FFF',
	},
	iconCalendar: {
			width: 0,
			marginLeft: -30,
	},
	goalContainer: {
		height: 30,
		flexDirection: "row",
		gap: 20,
		width: '94%',
	},
	daysContainer: {
		marginVertical: 35,
	},
	switchContainer: {
		height: 40
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

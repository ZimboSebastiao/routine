import React, { useState } from 'react';
import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar, ChevronDown } from 'lucide-react-native';
import { Avatar, Checkbox } from 'react-native-paper';


export default function NewHabit() {
	const [checked, setChecked] = React.useState(false);
	const [date, setDate] = useState(new Date());
	const [showPicker, setShowPicker] = useState(false);
	const [displayValue, setDisplayValue] = useState('');
	
	 const onChange = (event: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
      setDisplayValue(selectedDate.toLocaleDateString('pt-BR')); // Formato brasileiro
    }
  };

  return (
	 <SafeAreaProvider style={styles.container}>
		<Text style={styles.titleContainer}>Novo hábito</Text>
		<View style={styles.avatarContainer}>
			<Avatar.Image size={180} source={require('@/assets/images/flower.jpg')} />
		</View>

		<View style={styles.forms}>
			<View>
				<Text style={styles.textTitle}>Título do hábito</Text>
				<TextInput
					style={styles.formInput}
					// placeholder="Digite aqui"
				/>
			</View>

			<View>
				<View style={styles.checkbocContainer}>
					<Text style={styles.textTitle}>Definir uma meta</Text>
					<Checkbox
						status={checked ? 'checked' : 'unchecked'}
						onPress={() => {setChecked(!checked);}}
						color="#FF7617"
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

						<View style={styles.inputContainer}>
							<TextInput
							style={styles.formGoal}
							placeholder="Mês"
							value={displayValue}
							editable={false} 
							/>
							<TouchableOpacity 
							onPress={() => setShowPicker(true)}
							style={styles.iconCalendar}
							
							>
							<ChevronDown width={24} height={24} color="gray" />
							</TouchableOpacity>
						</View>
					</View>

				</View>

			</View>

		</View>

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
	avatarContainer: {
	  marginBottom: 30,
	  alignItems: "center",
	},
	forms: {
		marginLeft: 15,
	},
	textTitle: {
		fontSize: 18,
	},
	formInput: {
		height: 55,
		width: '94%',
		borderWidth: 1,
		borderColor: 'white',
		borderRadius: 10,
		backgroundColor: 'white',
		fontSize: 18,
		color: '#333',
		marginVertical: 12,
	},
	checkbocContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		alignContent: "center",
		width: "94%",
		marginBottom: 50,
	},
	formGoal: {
		width: "100%",
		height: 60,
		backgroundColor: 'white',
		fontSize: 18,
		color: '#333',
		marginVertical: 12,
		borderRadius: 10,
	},
	inputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		width: "44%",
		borderWidth: 1,
		borderColor: 'white',
		borderRadius: 10,
		backgroundColor: '#FFF',
  },
  iconCalendar: {
		backgroundColor: "red",
		width: 0,
		marginLeft: -30,
  },
  goalContainer: {
	backgroundColor: "red",
	flexDirection: "row",
	gap: 20,
  }

});

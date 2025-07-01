import { CategorySelector } from '@/components/CategorySelector';
import MonthPicker from '@/components/MonthPicker';
import WeeklyFrequency from '@/components/WeeklyFrequency';
import { Category } from '@/types/category';
import { requestNotificationPermissions, scheduleHabitReminders } from '@/utils/notifications';
import { saveHabit } from '@/utils/storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { Calendar, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Avatar, Checkbox, Switch } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function NewHabit() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [checked2, setChecked2] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [displayValue, setDisplayValue] = useState('');
  const [diasSelecionados, setDiasSelecionados] = useState<number[]>([]);
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState<number | undefined>(undefined);
  const [habitTitle, setHabitTitle] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const scaleSize = 1.7;
  
  const onChange = (event: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
      setDisplayValue(selectedDate.toLocaleDateString('pt-BR'));
      // Clear date error when date is selected
      if (errors.date) {
        const newErrors = {...errors};
        delete newErrors.date;
        setErrors(newErrors);
      }
    }
  };

  const onToggleSwitch = () => {
    setIsSwitchOn(!isSwitchOn);
    // Clear reminder error when toggling
    if (errors.reminder) {
      const newErrors = {...errors};
      delete newErrors.reminder;
      setErrors(newErrors);
    }
  };

  const handleSaveHabit = async () => {
    if (!validateForm()) return;

    try {
      // Verifica permissões para notificações
      if (isSwitchOn) {
        const hasPermission = await requestNotificationPermissions();
        if (!hasPermission) {
          Alert.alert('Permissão necessária', 'Permissão para notificações é necessária para receber lembretes');
          return;
        }
      }

      const newHabit = {
        title: habitTitle,
        hasGoal: checked,
        endDate: checked ? date.toISOString() : undefined,
        monthsGoal: checked2 ? selectedQuantity : undefined,
        category: selectedCategory!,
        frequency: {
          hasFrequency: checked2,
          selectedDays: diasSelecionados,
        },
        hasReminder: isSwitchOn,
        reminderTime: isSwitchOn ? '08:00' : undefined,
      };

      const savedHabit = await saveHabit(newHabit);
      
      if (isSwitchOn) {
        await scheduleHabitReminders(savedHabit);
      }

      router.push('/');
    } catch (error) {
      console.error('Error saving habit:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao salvar o hábito');
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validação do título
    if (!habitTitle || !habitTitle.trim()) {
      newErrors.title = 'Por favor, insira um título para o hábito';
    }

    // Validação da categoria
    if (!selectedCategory) {
      newErrors.category = 'Por favor, selecione uma categoria';
    }

    // Validação da meta (checkbox1)
    if (checked) {
      if (!displayValue) {
        newErrors.date = 'Por favor, selecione uma data de término';
      } else {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (new Date(date) <= today) {
          newErrors.date = 'A data de término deve ser no futuro';
        }
      }
    }

    // Validação da frequência (checkbox2)
    if (checked2) {
      if (selectedQuantity === undefined || selectedQuantity <= 0) {
        newErrors.months = 'Por favor, selecione uma duração válida';
      }
      
      if (diasSelecionados.length === 0) {
        newErrors.days = 'Por favor, selecione pelo menos um dia';
      }
    }

    // Validação do switch de lembretes
    if (isSwitchOn) {
      if (!checked2) {
        newErrors.reminder = 'Ative a frequência semanal para receber lembretes';
      } else if (diasSelecionados.length === 0) {
        newErrors.reminder = 'Selecione os dias da semana para receber lembretes';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckbox1Toggle = () => {
    setChecked(!checked);
    // Clear date error when toggling checkbox
    if (errors.date) {
      const newErrors = {...errors};
      delete newErrors.date;
      setErrors(newErrors);
    }
  };

  const handleCheckbox2Toggle = () => {
    setChecked2(!checked2);
    // Clear frequency errors when toggling checkbox
    if (errors.months || errors.days || errors.reminder) {
      const newErrors = {...errors};
      delete newErrors.months;
      delete newErrors.days;
      delete newErrors.reminder;
      setErrors(newErrors);
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
        <Avatar.Image size={160} source={require('@/assets/images/flow.jpg')} />
      </View>

      <ScrollView>
        <View style={styles.forms}>
          {/* Título do Hábito */}
          <View>
            <Text style={styles.textTitle}>Título do hábito</Text>
            <TextInput
              style={[styles.formInput, errors.title && styles.errorInput]}
              placeholder="Digite aqui"
              placeholderTextColor={"#d1d1d1"}
              onChangeText={(text) => {
                setHabitTitle(text);
                if (errors.title) {
                  const newErrors = {...errors};
                  delete newErrors.title;
                  setErrors(newErrors);
                }
              }}
              value={habitTitle}
            />
            {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
          </View>

          {/* Meta */}
          <View>
            <View style={styles.checkbocContainer}>
              <Text style={styles.textTitle}>Defina uma meta</Text>
              <Checkbox
                status={checked ? 'checked' : 'unchecked'}
                onPress={handleCheckbox1Toggle}
                color="#A278C6"
              />
            </View>
            
            {checked && (
              <View style={styles.container}>
                <View style={styles.goalContainer}>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={[styles.formGoal, errors.date && styles.errorInput]}
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
                  {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}

                  <MonthPicker 
                    selectedQuantity={selectedQuantity}
                    onSelectQuantity={(quantity) => {
                      setSelectedQuantity(quantity);
                      if (errors.months) {
                        const newErrors = {...errors};
                        delete newErrors.months;
                        setErrors(newErrors);
                      }
                    }}
                  />
                  {errors.months && <Text style={styles.errorText}>{errors.months}</Text>}
                </View>
              </View>
            )}
          </View>

          {/* Categoria */}
          <View style={styles.categContainer}>
            <Text style={styles.textTitle}>Selecione a categoria</Text>
            <CategorySelector 
              selectedCategory={selectedCategory}
              onSelectCategory={(category) => {
                setSelectedCategory(category);
                if (errors.category) {
                  const newErrors = {...errors};
                  delete newErrors.category;
                  setErrors(newErrors);
                }
              }}
            />
            {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
          </View>

          {/* Frequência */}
          <View style={styles.daysContainer}>
            <View style={styles.checkbocContainer}>
              <Text style={styles.textTitle}>Frequência</Text>
              <Checkbox
                status={checked2 ? 'checked' : 'unchecked'}
                onPress={handleCheckbox2Toggle}
                color="#A278C6"
              />
            </View>

            {checked2 && (
              <View>
                <WeeklyFrequency 
                  onChange={(dias) => {
                    setDiasSelecionados(dias);
                    if (errors.days || errors.reminder) {
                      const newErrors = {...errors};
                      delete newErrors.days;
                      delete newErrors.reminder;
                      setErrors(newErrors);
                    }
                  }} 
                />
                {errors.days && <Text style={styles.errorText}>{errors.days}</Text>}
              </View>
            )}
          </View>

          {/* Lembretes */}
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
            {errors.reminder && <Text style={styles.errorText}>{errors.reminder}</Text>}
          </View>

          {/* Botão Salvar */}
          <View style={styles.saveContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.buttonSave,
                {
                  transform: [{ scale: pressed ? 0.95 : 1 }],
                  opacity: pressed ? 0.8 : 1,
                }
              ]}
              onPress={handleSaveHabit}
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
		marginVertical: 0,
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
	},
	categContainer: {
		marginTop: 35,
	},
	errorInput: {
		borderColor: 'red',
		borderWidth: 1,
  },
  errorText: {
    color: 'red',
    marginTop: -10,
    marginBottom: 10,
    marginLeft: 5,
    fontSize: 14,
	backgroundColor: "yellow"
  },
});



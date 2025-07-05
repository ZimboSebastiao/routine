import { saveOnboardingData } from '@/utils/onboarding';
import { Image } from 'expo-image';
import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';



export default function OnboardingScreen() {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const navigation = useNavigation();

    useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Erro', 'Por favor, insira seu nome');
      return;
    }

    setIsSubmitting(true);
    try {
      await saveOnboardingData({
		  name,
		  onboardingCompleted: false
	  });
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao salvar seus dados');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
		<View style={styles.containerImage}>
			<Image 
				source={require('@/assets/images/girl.png')} 
				style={styles.image}
			/>
		</View>
      <Text style={styles.title}>Bem-vindo(a)!</Text>
      <Text style={styles.subtitle}>Antes de começar, nos diga como podemos te chamar</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Primeiro nome"
        value={name}
        onChangeText={setName}
        autoFocus
        importantForAutofill="yes"
        autoComplete="name"
      />

      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
          !name.trim() && styles.buttonDisabled
        ]}
        onPress={handleSubmit}
        disabled={!name.trim() || isSubmitting}
      >
        <Text style={styles.buttonText}>
          {isSubmitting ? 'Salvando...' : 'Continuar'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
		backgroundColor: "#F8F2EF",
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#6B1E9C',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  	image: {
		width: 305,
		height:270,
		right: 20,
	},
	containerImage: {
		marginBottom: 30,
	}
});


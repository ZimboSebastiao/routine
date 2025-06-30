import Overview from '@/components/Overview';
import { useRouter } from 'expo-router';
import { Share } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';


export default function Painel() {
	const router = useRouter();

  return (
	 <SafeAreaProvider style={styles.container}>
				<View style={styles.titleIconContainer}>
					<Text style={styles.titleContainer}>Painel</Text>
					<Pressable 
						style={({ pressed }) => [
							styles.iconView,
							{
								transform: [{ scale: pressed ? 0.95 : 1 }],
								opacity: pressed ? 0.8 : 1,
							}
							]}
							
						>
						{({ pressed }) => (
							<Share 
							size={24} 
							color={pressed ? '#A278C6' : '#000000'}
							/>
						)}
					</Pressable>
		
				</View>

				<Overview />
		
	 </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
	flex: 1,
	backgroundColor: "#F8F2EF",
  },
  titleContainer: {
	  marginVertical: 50,
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
		width: 40,
		height: 40,
		backgroundColor: "white",
		borderRadius: 50,
		borderWidth: 1,
		borderColor: "white",
	},


});

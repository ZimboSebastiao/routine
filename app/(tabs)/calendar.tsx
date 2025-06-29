import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function Calendar() {



	

  return (
	 <SafeAreaProvider style={styles.container}>
		
		


			

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
	}


});

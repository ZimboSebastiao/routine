import UserAvatar from '@/components/UserAvatar';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';


export default function Profile() {
  return (
   <View style={styles.container}>
		<View style={styles.avatarContainer}>
			 <UserAvatar 
				size={160}
				defaultColor="#FF5722"
				editable={true}
			/>
		</View>
   </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
	backgroundColor: "#F8F2EF",
  },
  avatarContainer: {
	marginVertical: 60,
	marginBottom: 30,
	alignItems: "center",
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});

import { useCurrentTime } from '@/utils/currentTime';
import { formatShortDate } from '@/utils/dateFormatter';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function CurrentTime() {
  const hora = useCurrentTime(); 
  const data = formatShortDate();

  return (
    <View style={styles.dateContainer}>
	   <Text style={{ fontSize:16, fontWeight: "bold" }}> Agora - {data}</Text>
      <Text style={{ fontSize:16, fontWeight: "bold" }}> {hora}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
	dateContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 15,
		paddingTop: 0,
	}
})



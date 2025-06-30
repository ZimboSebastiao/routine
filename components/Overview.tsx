import * as React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';


export default function Overview() {
  const [value, setValue] = React.useState('');

  return (
    <SafeAreaView style={styles.container}>
		<SegmentedButtons
			value={value}
			onValueChange={setValue}
			style={styles.segmentedContainer}
			buttons={[
				{
				value: 'week',
				label: 'Weekly',
				style: styles.button,
				labelStyle: styles.label,
				},
				{
				value: 'month',
				label: 'Monthly',
				style: styles.button,
				labelStyle: styles.label,
				},
				{
				value: 'year',
				label: 'Annual',
				style: styles.button,
				labelStyle: styles.label,
				},
			]}
		/>
		{/* Conteúdo semanal aqui */}
		<View>
			{value === 'week' && <Text>Conteúdo semanal aqui</Text>}
			
		</View>
		{/* Conteúdo mensal aqui */}
		<View>
			{value === 'month' && <Text>Conteúdo mensal aqui</Text>}
			
		</View>
		{/* Conteúdo anual aqui */}
		<View>
			{value === 'year' && <Text>Conteúdo anual aqui</Text>}
			
		</View>



    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  segmentedContainer: {
    margin: 10,
    borderRadius: 20,
  },
  button: {
    marginHorizontal: 8,
    backgroundColor: '#6B1E9C', 
    borderColor: '#bea3d9',
    borderWidth: 1,
	borderRadius: 50,
	borderEndEndRadius: 50,
	borderStartStartRadius: 50,
	borderStartEndRadius: 50,
	borderEndStartRadius: 50,
	padding: 4

  },
  label: {
    color: 'white',
    fontWeight: '600',
  },
});

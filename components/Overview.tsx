import * as React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import BarChartSVG from './BarChartSVG';
import BarChartSVGMonth from './BarChartSVGMonth';
import BarChartSVGMonthYear from './BarChartSVGYear';


export default function Overview() {
  const [value, setValue] = React.useState('week');

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
            style: {
              ...styles.button,
              backgroundColor: value === 'week' ? '#6B1E9C' : '#fff',
            },
            labelStyle: {
              ...styles.label,
              color: value === 'week' ? '#fff' : '#6B1E9C',
            },
          },
          {
            value: 'month',
            label: 'Monthly',
            style: {
              ...styles.button,
              backgroundColor: value === 'month' ? '#6B1E9C' : '#fff',
            },
            labelStyle: {
              ...styles.label,
              color: value === 'month' ? '#fff' : '#6B1E9C',
            },
          },
          {
            value: 'year',
            label: 'Annual',
            style: {
              ...styles.button,
              backgroundColor: value === 'year' ? '#6B1E9C' : '#fff',
            },
            labelStyle: {
              ...styles.label,
              color: value === 'year' ? '#fff' : '#6B1E9C',
            },
          },
        ]}
      />
      {/* Conteúdo semanal aqui */}
        {value === 'week' && 
      	<View style={styles.weekContainer}>
			<View> 
				<Text style={styles.totalHours}>Horas Dedicadas</Text>
				<Text style={styles.hours}>20:43:12</Text>
			</View>

			<View>
				<Text style={styles.totalDays}>Dias ativos</Text>
				<Text style={styles.days}>7 dias</Text>
			</View>
			<View style={styles.horizontalLine} />
		<BarChartSVG />
		</View>
		}

      {/* Conteúdo mensal aqui */}
        {value === 'month' && 
      	<View style={styles.weekContainer}>
			<View> 
				<Text style={styles.totalHours}>Horas Dedicadas</Text>
				<Text style={styles.hours}>760:43:12</Text>
			</View>

			<View>
				<Text style={styles.totalDays}>Dias ativos</Text>
				<Text style={styles.days}>24 dias</Text>
			</View>
			<View style={styles.horizontalLine} />
		<BarChartSVGMonth />
		</View>
		}

      {/* Conteúdo anual aqui */}

        {value === 'year' && 
		<View style={styles.weekContainer}> 
			<View> 
				<Text style={styles.totalHours}>Horas Dedicadas</Text>
				<Text style={styles.hours}>760:43:12</Text>
			</View>

			<View>
				<Text style={styles.totalDays}>Dias ativos</Text>
				<Text style={styles.days}>24 dias</Text>
			</View>
			<View style={styles.horizontalLine} />
		<BarChartSVGMonthYear />
		</View>
		}

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
  segmentedContainer: {
    margin: 10,
    borderRadius: 20,
},
button: {
	marginHorizontal: 8,
	backgroundColor: '#6B1E9C',
    borderWidth: 0,
	borderRadius: 50,
	borderEndEndRadius: 50,
	borderStartStartRadius: 50,
	borderStartEndRadius: 50,
	borderEndStartRadius: 50,
	padding: 4

  },
  label: {
    color: 'black',
    fontWeight: '600',
  },
  weekContainer: {
	margin: 20,
  },
  totalHours: {
	fontSize: 18,
  },
  hours: {
	fontSize: 28,
	fontWeight: "bold",
  },
  totalDays: {
	fontSize: 18,
	marginTop: 10,
	paddingTop: 18,
  },
  days: {
	fontSize: 28,
	fontWeight: "bold",
	paddingBottom: 15,
  },
  horizontalLine: {
		height: 2.3,
		width: "100%",
		backgroundColor: '#f0e8df',
	}


});

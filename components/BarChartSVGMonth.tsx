import React from "react";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import Svg, { Circle, G, Rect, Text } from "react-native-svg";

const screenWidth = Dimensions.get("window").width;
const chartHeight = 200;
const barWidth = 38;
const barSpacing = 45;
const leftPadding = 35;

const days = [
  { label: "1", date: "22/05", billable: 108},
  { label: "2", date: "23/05", billable: 4},
  { label: "3", date: "24/05", billable: 3},
  { label: "4", date: "25/05", billable: 2},
  { label: "5", date: "26/05", billable: 1},
  { label: "6", date: "27/05", billable: 1},
  { label: "7", date: "28/05", billable: 1 },
  { label: "8", date: "22/05", billable: 108},
  { label: "9", date: "23/05", billable: 4},
  { label: "10", date: "24/05", billable: 3},
  { label: "11", date: "25/05", billable: 2},
  { label: "12", date: "26/05", billable: 1},
  { label: "13", date: "27/05", billable: 1},
  { label: "14", date: "28/05", billable: 1 },
  { label: "15", date: "22/05", billable: 108},
  { label: "16", date: "23/05", billable: 4},
  { label: "17", date: "24/05", billable: 3},
  { label: "18", date: "25/05", billable: 2},
  { label: "19", date: "26/05", billable: 1},
  { label: "20", date: "27/05", billable: 1},
  { label: "21", date: "28/05", billable: 1 },
  { label: "22", date: "23/05", billable: 4},
  { label: "23", date: "24/05", billable: 3},
  { label: "24", date: "25/05", billable: 2},
  { label: "25", date: "26/05", billable: 1},
  { label: "26", date: "27/05", billable: 1},
  { label: "27", date: "28/05", billable: 1 },
  { label: "28", date: "23/05", billable: 4},
  { label: "29", date: "24/05", billable: 3},
  { label: "30", date: "25/05", billable: 2},
  { label: "31", date: "26/05", billable: 1},

];

const maxHours = 1000;
const logScale = (value: number) => Math.log10(value + 1) * (chartHeight / Math.log10(maxHours + 1));

export default function BarChartSVGMonth() {
  const chartWidth = leftPadding + days.length * barSpacing;

  return (
    <View style={styles.container}>
      {/* Legenda */}
      <Svg height={40} width={screenWidth}>
        <Circle cx={leftPadding + 70} cy={8} r={4} fill="#f17e44" />
        <Text x={leftPadding + 80} y={14} fontSize="18" fill="#000">
          Progresso e análises
        </Text>

        
      </Svg>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Svg height={chartHeight + 60} width={chartWidth}>
          <G>
            {/* Linhas horizontais e labels de horas */}
            {[1, 10, 50, 200, 900].map((h) => (
              <G key={h}>
                <Text
                  x={0}
                  y={chartHeight - logScale(h) + 9}
                  fontSize="15"
                  fill="#aaa"
                >
                  {h}h
                </Text>
                <Rect
                  x={leftPadding - 5}
                  y={chartHeight - logScale(h)}
                  width={chartWidth - leftPadding}
                  height={2}
                  fill="#f0e8df"
                />
              </G>
            ))}

            {/* Gráfico */}
            <G y={chartHeight}>
              {days.map((day, index) => {
                const x = leftPadding + index * barSpacing;
                const billableHeight = logScale(day.billable);
                

                return (
                  <G key={index}>
                    
                    {/* Billable bar */}
					<Rect
                      x={x}
                      y={-billableHeight}
                      width={barWidth}
                      height={billableHeight}
                      fill="#f17e44"
                      rx={6}
                    />
					
					{/* Value label */}
                    <Text
                      x={x + barWidth / 2}
                      y={-billableHeight - 5}
                      fontSize="8"
                      fill="#333"
                      textAnchor="middle"
                    >
                      {day.billable}
                    </Text>

                    {/* Day label */}
                    <Text
                      x={x + barWidth / 2}
                      y={20}
                      fontSize="15"
                      fill="#333"
                      textAnchor="middle"
                    >
                      {day.label}
                    </Text>

                    {/* Date label */}
                    <Text
                      x={x + barWidth / 2}
                      y={35}
                      fontSize="13"
                      fill="#999"
                      textAnchor="middle"
                    >
                      {day.date}
                    </Text>
                  </G>
                );
              })}
            </G>
          </G>
        </Svg>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,

  }
});

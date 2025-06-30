import React from "react";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import Svg, { Circle, G, Rect, Text } from "react-native-svg";

const screenWidth = Dimensions.get("window").width;
const chartHeight = 200;
const barWidth = 38;
const barSpacing = 45;
const leftPadding = 35;

const days = [
  { label: "D", date: "22/05", billable: 8, nonBillable: 0 },
  { label: "S", date: "23/05", billable: 4, nonBillable: 4 },
  { label: "T", date: "24/05", billable: 3, nonBillable: 2 },
  { label: "Q", date: "25/05", billable: 2, nonBillable: 0 },
  { label: "Q", date: "26/05", billable: 1, nonBillable: 1 },
  { label: "S", date: "27/05", billable: 1, nonBillable: 0 },
  { label: "S", date: "28/05", billable: 1, nonBillable: 0 }
];

const maxHours = 17;
const scale = chartHeight / maxHours;

export default function BarChartSVG() {
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
            {[0, 2, 4, 6, 8, 10, 12, 14, 16].map((h) => (
              <G key={h}>
                <Text
                  x={0}
                  y={chartHeight - h * scale + 3}
                  fontSize="15"
                  fill="#aaa"
                >
                  {h}h
                </Text>
                <Rect
                  x={leftPadding - 5}
                  y={chartHeight - h * scale}
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
                const billableHeight = day.billable * scale;
                const nonBillableHeight = day.nonBillable * scale;

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
    alignItems: "center",

  }
});

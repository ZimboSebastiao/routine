import React from "react";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import Svg, { Circle, G, Rect, Text } from "react-native-svg";

const screenWidth = Dimensions.get("window").width;
const chartHeight = 220;
const barWidth = 32;
const barSpacing = 45;
const leftPadding = 60;

const days = [
  { label: "Jan", countDays: 23, billable: 808},
  { label: "Fev", countDays: 18, billable: 564},
  { label: "Mar", countDays: 10, billable: 323},
  { label: "Abr", countDays: 17, billable: 562},
  { label: "Mai", countDays: 12, billable: 571},
  { label: "Jun", countDays: 26, billable: 461},
  { label: "Jul", countDays: 18, billable: 751 },
  { label: "Ago", countDays: 21, billable: 708},
  { label: "Set", countDays: 25, billable: 496},
  { label: "Out", countDays: 23, billable: 334},
  { label: "Nov", countDays: 20, billable: 762},
  { label: "Dez", countDays: 28, billable: 875},


];

const maxHours = 90000;
const logScale = (value: number) => Math.log10(value + 1) * (chartHeight / Math.log10(maxHours + 1));

export default function BarChartSVGMonthYear() {
  const chartWidth = leftPadding + days.length * barSpacing;

  return (
    <View style={styles.container}>
      {/* Legenda */}
      <Svg height={40} width={screenWidth}>
        <Circle cx={leftPadding + 40} cy={8} r={4} fill="#f17e44" />
        <Text x={leftPadding + 50} y={14} fontSize="18" fill="#000">
          Progresso e análises
        </Text>

        
      </Svg>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Svg height={chartHeight + 60} width={chartWidth}>
          <G>
            {/* Linhas horizontais e labels de horas */}
            {[1, 20, 100, 700, 4000, 17000, 80000].map((h) => (
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
                      {day.countDays}
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
